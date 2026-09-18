import mongoose, { Document } from "mongoose";

export interface IGamePlayer {
  userId: mongoose.Types.ObjectId;
  score: number;
  timeTaken?: number;
  finished: boolean;
}

export interface IGame extends Document {
  quizId: mongoose.Types.ObjectId;
  hostId: mongoose.Types.ObjectId;
  roomCode: string;
  gameVisibility: "PUBLIC" | "PRIVATE";
  gameMode: "SINGLE" | "MULTIPLAYER";
  players: IGamePlayer[];
  status: "WAITING" | "IN_PROGRESS" | "FINISHED";
  startedAt?: Date;
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

    gameVisibility: {
      type: String,
      enum: ["PUBLIC", "PRIVATE"],
      default: "PUBLIC",
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
        timeTaken: {
          type: Number,
          default: 0,
        },
        finished: {
          type: Boolean,
          default: false,
        },
      },
    ],

    startedAt: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["WAITING", "IN_PROGRESS", "FINISHED"],
      default: "WAITING",
    },
  },
  { timestamps: true }
);

export const Game = mongoose.model<IGame>("game", gameSchema);
