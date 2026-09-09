import mongoose, { Document } from "mongoose";

export interface IGamePlayer {
  userId: mongoose.Types.ObjectId;
  score: number;
}

export interface IGame extends Document {
  quizId: mongoose.Types.ObjectId;
  hostId: mongoose.Types.ObjectId;
  roomCode: string;
  gameMode: "SINGLE" | "MULTIPLAYER";
  players: IGamePlayer[];
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
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          required: true,
        },
        score: {
          type: Number,
          default: 0,
        },
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
