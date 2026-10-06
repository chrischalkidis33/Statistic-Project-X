import jwt from "jsonwebtoken";
import crypto from "crypto";
function generateAccessToken(user, JWT_SECRET) {
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
export { generateAccessToken, generateRefreshToken, hashToken };
