import { Router } from "express";
const router = Router();
import {
  getDBResponse,
  registerUser,
  refreshUser,
} from "../services/authService.js";

//ορισμός του post endpoint για την αποστολή αιτήματος
router.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    //αναμένουμε την απάντηση από το response
    const { accessToken, refreshToken, user } = await getDBResponse(
      email,
      password,
    );

    //στέλνουμε το refresh token στο HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, //η Javascript δεν μπορεί να το διαβάσει (προστασία από XSS)
      secure: process.env.NODE_ENV === "production", //Στέλνεται μόνο μέσω HTTPS σε production
      sameSite: "strict", //δεν στέλνετα ισε cross-site request (προστασία από CSRF)
      maxAge: 7 * 24 * 60 * 60 * 1000, //Ζει για 7 ημέρες
    });

    return res.status(200).json({
      message: "Connection succeeded",
      accessToken: accessToken,
      user: user,
    });
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ message: err.message });
    }
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/api/register", async (req, res) => {
  const { email, password, first_name, last_name, company_name, location } =
    req.body;
  try {
    const newUser = await registerUser(
      email,
      password,
      first_name,
      last_name,
      company_name,
      location,
    );
    return res.status(201).json({
      message: "Created",
      token: newUser,
    });
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ message: err.message });
    }
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

//μέθοδος που καλέιται κατά την ανανέωση του token
router.post("/api/refresh", async (req, res) => {
  try {
    const refToken = req.cookies.refreshToken; // παίρνουμε το refresh token από το body
    if (!refToken) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    const { accessToken, refreshToken } = await refreshUser(refToken);

    //ανανεώνουμε το refresh token στο HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, //η Javascript δεν μπορεί να το διαβάσει (προστασία από XSS)
      secure: process.env.NODE_ENV === "production", //Στέλνεται μόνο μέσω HTTPS σε production
      sameSite: "strict", //δεν στέλνετα ισε cross-site request (προστασία από CSRF)
      maxAge: 7 * 24 * 60 * 60 * 1000, //Ζει για 7 ημέρες
    });

    //επιστρέφουμε το νέο access token
    return res.status(200).json({
      message: "Connection succeeded",
      accessToken: accessToken,
    });
  } catch (err) {
    if (err.status) {
      if (err.status === 401) {
        res.clearCookie("refreshToken", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
      }

      return res.status(err.status).json({ message: err.message });
    }
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

export { router };
