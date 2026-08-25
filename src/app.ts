import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.ts";
import quizRoutes from "./routes/quiz.routes.ts";
import cookieParser from "cookie-parser";

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/quiz", quizRoutes);

export default app;
