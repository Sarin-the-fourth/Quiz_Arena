import mongoose from "mongoose";
import env from "./env.js";

export async function connectDB() {
  try {
    if (!env.DB_URI) throw new Error("Connection failed!");
    await mongoose.connect(env.DB_URI);
    console.log("DB connected successfully!");
  } catch (error) {
    console.log("DB connection failed!", error);
  }
}
