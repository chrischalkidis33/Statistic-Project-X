import "./config/env.js";
import express from "express";
import cookieParser from "cookie-parser";
import { router } from "./routes/auth.js";
import { auth } from "./middleware/authMiddleware.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(router);

app.get("/api/me", auth, (req, res) => {
  res.json({ userId: req.user.userId }); //πρέπει να δω λίγο τα πεδία που πρέπει να βάλω εάν είναι σωστά
});
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ error: "Σφάλμα server" });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server runing on port ${PORT}`);
});
