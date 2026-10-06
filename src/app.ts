import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import quizRoutes from "./routes/quiz.routes.js";
import gameRoutes from "./routes/game.routes.js";
import userRoutes from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import { allowedOrigins } from "./config/cors.js";
import mongoose from "mongoose";

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.get("/health", (_req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ status: "starting" });
  }

  return res.status(200).json({ status: "ready" });
});

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/quiz", quizRoutes);
app.use("/game", gameRoutes);
app.use("/user", userRoutes);

export default app;
