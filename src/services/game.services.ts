import mongoose from "mongoose";
import { Game, type IGame } from "../model/game.model.js";
import { Quiz } from "../model/quiz.model.js";
import { generateRoomCode } from "../utils/generateRoomCode.js";

class GameService {
  async createGame(
    quizId: string,
    userId: string,
    gameMode: IGame["gameMode"]
  ) {
    const quiz = await Quiz.findById(quizId);

    if (!quiz) throw new Error("Quiz not found!");

    let roomCode: string;

    do {
      roomCode = generateRoomCode();
    } while (await Game.exists({ roomCode }));

    const game = await Game.create({
      quizId: new mongoose.Types.ObjectId(quizId),
      hostId: new mongoose.Types.ObjectId(userId),
      roomCode,
      gameMode,

      players: [
        {
          userId: new mongoose.Types.ObjectId(userId),
          score: 0,
        },
      ],

      status: "WAITING",
    });

    return game;
  }

  async joinGame(roomCode: string, userId: string) {
    const game = await Game.findOne({ roomCode });

    if (!game) {
      throw new Error("Game not found!");
    }

    if (game.gameMode === "SINGLE") {
      throw new Error("Game not found!");
    }

    if (game.status !== "WAITING") {
      throw new Error("Game has already started");
    }

    if (game.players.some((player) => player.userId.toString() === userId)) {
      throw new Error("You are already in this game");
    }

    if (game.players.length >= 6) {
      throw new Error("Room full");
    }

    game.players.push({
      userId: new mongoose.Types.ObjectId(userId),
      score: 0,
      timeTaken: 0,
      finished: false,
    });

    await game.save();

    return game;
  }

  async leaveGame(roomCode: string, userId: string) {
    const result = await Game.findOneAndUpdate(
      { roomCode: roomCode, "players.userId": userId },
      {
        $pull: {
          players: { userId: userId },
        },
      },
      { returnDocument: "after" }
    );

    if (!result) {
      throw new Error("You are not in a game");
    }

    if (result.players.length === 0) {
      await this.removeGame(roomCode);
      return result;
    }

    if (userId === result.hostId.toString()) {
      result.hostId = result.players[0]!.userId;
      await result.save();
    }

    return result;
  }

  async getGame() {
    return await Game.find({ gameMode: "MULTIPLAYER", status: "WAITING" })
      .populate("quizId", "title category")
      .populate("hostId", "name");
  }

  async getOneGame(roomCode: string) {
    const game = await Game.findOne({ roomCode })
      .populate("quizId", "title category")
      .populate("hostId", "name")
      .populate("players.userId", "name");

    if (!game) {
      throw new Error("Game not found");
    }

    return game;
  }

  async startGame(roomCode: string, userId: string) {
    const game = await Game.findOne({ roomCode });

    if (!game) throw new Error("Game unavailable");

    if (game.hostId.toString() !== userId)
      throw new Error("Unauthorized (Only Host can start the game)");

    if (game.status !== "WAITING") throw new Error("Game has already started");

    if (game.gameMode === "MULTIPLAYER") {
      if (game.players.length < 2)
        throw new Error("Atleast 2 players required");
    }

    game.status = "IN_PROGRESS";
    game.startedAt = new Date();

    await game.save();

    return game;
  }

  async removeGame(roomCode: string) {
    await Game.findOneAndDelete({
      roomCode,
      players: { $size: 0 },
    });
  }
}

export const gameService = new GameService();
