import bcrypt from "bcrypt";
import crypto from "crypto";
import Joi from "joi";
import { Pool } from "pg";
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
} from "../utils/token.js";

//ρύθμιση της σύνδεσης με την postgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

//βοηθιτική function για custom errors με status code
function createError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

//η βασική λογική του login - δεν ξέρει τίποτα για το request / responce
async function getDBResponse(email, password) {
  //1. Validation με το Joi
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(72).required(),
  });

  //επιστροφή του error κατ΄το validation των στοιχειων
  const { error } = schema.validate({ email, password });
  if (error) {
    throw createError(400, error.details[0].message);
  }

  //2. Έλεγχος στην βάση εάν υπάρχει ο χρήστης
  const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  //Έλεγχος σφάλματος κατά το query στην βάση
  if (userResult.rows.length === 0) {
    throw createError(401, "Wrong email or password");
  }

  const user = userResult.rows[0];

  //3. Έλεγχος εάν ο κωδικός ταιριάζει με τον κρυπτογραφημένο στην βάση δεδομένων
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw createError(401, "Wrong email or password");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(); //δημιουργεί ένα τυχαίο string 64 χαρακτήρων
  const tokenHash = hashToken(refreshToken); //δημιουργεί hash string περιλαμβάνοντας το refresh token
  const familyId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await pool.query(
    `
      INSERT INTO refresh_tokens (user_id, family_id, token_hash, expires_at) 
      VALUES ($1,$2,$3,$4)
    `,
    [user.id, familyId, tokenHash, expiresAt],
  );

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, email: user.email },
  };
}

async function registerUser(
  email,
  password,
  first_name,
  last_name,
  company_name,
  location,
) {
  //1. Validation με Joi
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(72).required(),
    first_name: Joi.string().max(100).allow("", null).required(),
    last_name: Joi.string().max(100).allow("", null).required(),
    company_name: Joi.string().max(255).allow("", null),
    location: Joi.string().max(255).allow("", null),
  });

  //επιστροφή του error κατ΄το validation των στοιχείων
  const { error } = schema.validate({
    email,
    password,
    first_name,
    last_name,
    company_name,
    location,
  });
  if (error) {
    throw createError(400, error.details[0].message);
  }

  //3. Εισαγωγή δεδομενων στην βαση
  const client = await pool.connect();

  try {
    const userResult = await client.query(
      "SELECT * FROM users WHERE email=$1",
      [email],
    );

    //εάν δεν υπάρχει ο χρήστης στην βάση τότε βγάλε σφάλμα 409 conflict
    if (userResult.rows.length !== 0) {
      throw createError(409, "Conflict");
    }

    await client.query("BEGIN");
    //Εισαγωγή στον πρώτο πίνακα και παίρνω id

    //πρώτα κάνω hash το Password
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await client.query(
      `
      INSERT INTO users (email, password_hash) 
      VALUES ($1,$2) 
      RETURNING id`,
      [email, passwordHash],
    );

    //κρατάμε το επιστρεφόμενο id
    const userId = result.rows[0].id;

    await client.query(
      `
      INSERT INTO user_profiles (user_id, first_name, last_name, company_name, location) 
      VALUES ($1,$2,$3,$4,$5)
      `,
      [userId, first_name, last_name, company_name, location],
    );

    //πρέπει να γίνει commit για να αποθηκευτούν μόνιμα τα δεδομένα
    await client.query("COMMIT");

    //επιστροφή κάποιον στοιχείων του user για την σύνθεση του αντικειμένου στο auth.js
    return { id: userId, email, first_name, last_name };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

async function refreshUser(refreshToken) {
  //έλεγχος εάν υπάρχει το refresh token
  if (!refreshToken) {
    throw createError(401, "Refresh token mising");
  }
  //Rotation Μέσα σε transaction
  const client = await pool.connect();
  //Το flag για το transaction. Δήλωσέ το πριν το try
  let inTransaction = false;
  try {
    await client.query("BEGIN");
    inTransaction = true;
    //1. δημιουργία ξανά του hash token
    const tokenHash = hashToken(refreshToken);
    //2. έλεγχος στην βάση με το hash + έλεγχος εάν έχει λήξη
    const result = await client.query(
      `SELECT rt.id, rt.user_id, rt.family_id, rt.used, rt.used_at, rt.revoked, rt.expires_at, u.email
        FROM refresh_tokens rt
        JOIN users u ON u.id = rt.user_id
        WHERE rt.token_hash = $1
        FOR UPDATE OF rt`,
      [tokenHash],
    );

    if (result.rows.length === 0) {
      throw createError(401, "Invalid refresh token");
    }

    const stored = result.rows[0];

    //έλεγχος εάν το token έχει ξανα χρησιμοποιηθεί - Reuse detection
    const GRACE_MS = 10 * 1000; //Παράθυρο ανοχής: 10 δευτερόλεπτα

    //1. Ήδη ακυρωμένη οικογλενεια: πάντα 401 , δεν χρειάζεται νέο Update
    if (stored.revoked) {
      throw createError(401, "Refresh token revoked");
    }

    //2. Token που έχει ήδη χρησιμοποιηθεί
    if (stored.used) {
      const msSinceUse = stored.used_at
        ? Date.now() - new Date(stored.used_at).getTime()
        : Infinity; // παλιές γραμμες χωρίς used_at θεωρούνται reused

      if (msSinceUse < GRACE_MS) {
        //Αθώα διπλή κλήση: 401 χωρίς revoke και χωρίς να σβηστεί το cookie
        const err = createError(401, "Refresh already in progress");
        err.keepCookie = true;
        throw err;
      }

      //Πραγματικό reuse: ακύρωση οικογένειας και COMMIT πριν το throw
      await client.query(
        `
        UPDATE refresh_tokens SET revoked = true WHERE family_id = $1
        `,
        [stored.family_id],
      );
      await client.query("COMMIT");
      inTransaction = false;
      throw createError(401, "Refresh token reuse detected");
    }

    //Έλεγχος εάν το token έχει λήξη
    if (new Date(stored.expires_at) < new Date()) {
      throw createError(401, "Refresh token expired");
    }

    //5.1 Ατομικό κατανάλωμα του παλιού token
    const marked = await client.query(
      `
        UPDATE refresh_tokens
        SET used = true, used_at = now()
        WHERE id = $1 AND used = false
        RETURNING id
      `,
      [stored.id],
    );

    if (marked.rowCount === 0) {
      throw createError(401, "Refresh token already used");
    }

    //5.2 Νέο refresh token (με ίδιο family id)
    const newRefreshToken = generateRefreshToken();
    const newTokenHash = hashToken(newRefreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    //αίτημα στην βάση και εισαγωγή του καινούριου refresh token
    await client.query(
      `
      INSERT INTO refresh_tokens (user_id, family_id, token_hash, expires_at) 
      VALUES ($1,$2,$3,$4)
    `,
      [stored.user_id, stored.family_id, newTokenHash, expiresAt],
    );

    await client.query("COMMIT");

    const accessToken = generateAccessToken({
      id: stored.user_id,
      email: stored.email,
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
      user: { id: stored.user_id, email: stored.email },
    };
  } catch (err) {
    if (inTransaction) await client.query("ROLLBACK");
    throw err;
  } finally {
    await client.release();
  }
}
export { getDBResponse, registerUser, refreshUser };
