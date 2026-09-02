import { Quiz } from "../model/quiz.model";
import type { CreateQuizDTO, UpdateQuizDTO } from "../schema/quiz.schema";

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
    return await Quiz.findById(quizId);
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

    return quiz;
  }
}

export const crudQuiz = new CrudQuiz();
