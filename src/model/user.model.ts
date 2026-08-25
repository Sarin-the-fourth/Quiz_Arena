import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    email: { type: String, lowercase: true, unique: true, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export const User = mongoose.model("user", userSchema);
