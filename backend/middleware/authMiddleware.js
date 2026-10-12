import { verifyAccessToken } from "../utils/token.js";
function auth(req, res, next) {
  const token = (req.headers.authorization || "").split(" ")[1];
  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    return res.status(401).json({ error: "Expired or outdated token" });
  }
}

export { auth };
