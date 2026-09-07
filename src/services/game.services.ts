import mongoose from "mongoose";
import { Game, type IGame } from "../model/game.model";
import { Quiz } from "../model/quiz.model";
import { generateRoomCode } from "../utils/generateRoomCode";

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
      players: [new mongoose.Types.ObjectId(userId)],
      status: "WAITING",
    });

    return game;
  }

  async joinGame(roomCode: string, userId: string) {
    const game = await Game.findOne({ roomCode });

    if (game?.gameMode === "SINGLE") {
      throw new Error("Cannot join single player game");
    }

    if (!game) {
      throw new Error("Game not found!");
    }

    if (game.status !== "WAITING") {
      throw new Error("Game has already started");
    }

    if (game.players.some((player) => player.toString() === userId)) {
      throw new Error("You are already in this game");
    }

    if (game.players.length >= 6) {
      throw new Error("Room full");
    }

    game.players.push(new mongoose.Types.ObjectId(userId));

    await game.save();

    return game;
  }

  async leaveGame(roomCode: string, userId: string) {
    const result = await Game.findOneAndUpdate(
      { players: userId, roomCode: roomCode },
      {
        $pull: {
          players: userId,
        },
      },
      { returnDocument: "after" }
    );

    if (!result) {
      throw new Error("You are not in a game");
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
      .populate("players", "name");

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

    if (game.players.length < 2) throw new Error("Atleast 2 players required");

    game.status = "IN_PROGRESS";

    await game.save();

    return game;
  }
}

export const gameService = new GameService();
