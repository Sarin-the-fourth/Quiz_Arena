import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.ts";
import quizRoutes from "./routes/quiz.routes.ts";
import gameRoutes from "./routes/game.routes.ts";
import userRoutes from "./routes/user.routes.ts";
import cookieParser from "cookie-parser";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/quiz", quizRoutes);
app.use("/game", gameRoutes);
app.use("/user", userRoutes);

export default app;
