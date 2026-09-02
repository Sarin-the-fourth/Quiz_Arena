import mongoose, { Document } from "mongoose";

export interface IGame extends Document {
  quizId: mongoose.Types.ObjectId;
  hostId: mongoose.Types.ObjectId;
  roomCode: string;
  gameMode: "SINGLE" | "MULTIPLAYER";
  players: mongoose.Types.ObjectId[];
  status: "WAITING" | "IN_PROGRESS" | "FINISHED";
}

const gameSchema = new mongoose.Schema<IGame>(
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

    gameMode: {
      type: String,
      enum: ["SINGLE", "MULTIPLAYER"],
      required: true,
    },

    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
    ],

    status: {
      type: String,
      enum: ["WAITING", "IN_PROGRESS", "FINISHED"],
      default: "WAITING",
    },
  },
  { timestamps: true }
);

export const Game = mongoose.model<IGame>("game", gameSchema);
