import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "quiz",
      required: true,
    },
    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    roomCode: {
      type: String,
      required: true,
      unique: true,
    },
    players: [
      { types: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    ],

    status: {
      type: String,
      enum: ["WAITING", "IN_PROGRESS", "FINISHED"],
      default: "WAITING",
    },
  },
  { timestamps: true }
);

export const Game = mongoose.model("game", gameSchema);
