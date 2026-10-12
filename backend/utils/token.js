import jwt from "jsonwebtoken";
import crypto from "crypto";

//κλειδί για την υπογραφή του jwt (το κτρατάμε κρυφό στο .env)
const JWT_SECRET = process.env.JWT_SECRET;

function generateAccessToken(user) {
  //4. Έκδοση JWT Authentication Token
  const payload = {
    userId: user.id,
    email: user.email,
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
  return accessToken;
}
function generateRefreshToken() {
  return crypto.randomBytes(64).toString("hex");
}
function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function verifyAccessToken(token) {
  const user = jwt.verify(token, JWT_SECRET);
  return user;
}
export {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  verifyAccessToken,
};
