import "./config/env.js";
import express from "express";
import cookieParser from "cookie-parser";
import { router } from "./routes/auth.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server runing on port ${PORT}`);
});
