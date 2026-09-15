import { getIO } from "../config/socket.js";
import { Game } from "../model/game.model.js";
import { Quiz } from "../model/quiz.model.js";
import type {
  CreateQuizDTO,
  SubmitDTO,
  UpdateQuizDTO,
} from "../schema/quiz.schema.js";

class CrudQuiz {
  async createQuiz(data: CreateQuizDTO, userId: string) {
    return await Quiz.create({
      ...data,
      createdBy: userId,
    });
  }

  async getQuiz() {
    return await Quiz.find().select("_id title description category createdBy");
  }

  // returns questions
  async getOneQuiz(quizId: string) {
    return await Quiz.findById(quizId).select("-questions.correctAnswer");
  }

  async getQuestionsAnswer(quizId: string) {
    return await Quiz.findById(quizId).select("questions");
  }

  async getMyQuiz(userId: string) {
    return await Quiz.find({ createdBy: userId }).select(
      "_id title description category"
    );
  }

  async updateQuiz(userId: string, quizId: string, data: UpdateQuizDTO) {
    const quiz = await Quiz.findOneAndUpdate(
      { _id: quizId, createdBy: userId },
      { $set: data },
      { returnDocument: "after" }
    );

    if (quiz?.createdBy.toString() !== userId)
      throw new Error("User not authorized");

    if (!quiz) throw new Error("Quiz not found!");

    return quiz;
  }

  async deleteQuiz(quizId: string, userId: string) {
    const quiz = await Quiz.findOneAndDelete({
      _id: quizId,
      createdBy: userId,
    });

    if (!quiz) throw new Error("Quiz not found!");

    await Game.deleteMany({
      quizId: quiz._id,
    });

    return quiz;
  }

  async submitQuiz(roomCode: string, userId: string, submitData: SubmitDTO) {
    const game = await Game.findOne({ roomCode });

    if (!game) {
      throw new Error("Game not found!");
    }

    const isPlayer = game.players.find(
      (player) => player.userId.toString() === userId
    );

    if (!isPlayer) {
      throw new Error("You are not a player in this game!");
    }

    const quiz = await Quiz.findById(game.quizId).select("questions");

    if (!quiz) {
      throw new Error("Quiz not found!");
    }

    if (!game.startedAt) throw new Error("Game has not yet started!");

    const timeTaken = Math.floor(
      (Date.now() - game.startedAt.getTime()) / 1000
    );

    let correctCount = 0;

    for (const answer of submitData.answers) {
      const question = quiz.questions.find(
        (question) => question._id.toString() === answer.questionId
      );

      const isCorrectAnswer = question?.correctAnswer === answer.answer;

      if (isCorrectAnswer) {
        correctCount++;
      }
    }

    const updatedGame = await Game.findOneAndUpdate(
      {
        roomCode,
        "players.userId": userId,
      },
      {
        $inc: {
          "players.$.score": correctCount,
        },
        $set: {
          "players.$.timeTaken": timeTaken,
          "players.$.finished": true,
        },
      },
      {
        returnDocument: "after",
      }
    );

    if (!updatedGame) {
      throw new Error("Player not found in this game!");
    }

    const allPlayersFinsihed = updatedGame.players.every(
      (player) => player.finished
    );

    if (allPlayersFinsihed) {
      updatedGame.status = "FINISHED";
      await updatedGame.save();
      getIO().to(roomCode).emit("allPlayersFinished");
    }
    return {
      correctAnswers: correctCount,
      totalAnswers: submitData.answers.length,
      scoreAdded: correctCount,
      timeTaken,
    };
  }
}

export const crudQuiz = new CrudQuiz();
