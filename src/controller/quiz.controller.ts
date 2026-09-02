import type { Request, Response } from "express";
import { z_quizSchema } from "../schema/quiz.schema";
import { crudQuiz } from "../services/quiz.services";
import { QuizCategory } from "../model/quiz.model";

type QuizParam = {
  quizId: string;
};

export async function createQuiz(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const result = z_quizSchema.safeParse(req.body);
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized! Login to create a quiz",
      });
    }

    if (!result.success) {
      return res.status(400).json({
        message: "Validation Error",
        errors: result.error.issues,
      });
    }

    const quiz = await crudQuiz.createQuiz(result.data, userId);

    return res.status(200).json({
      message: "Quiz created successfully",
      quiz,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        message: error.message,
      });
    }
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}

export async function getQuiz(req: Request, res: Response) {
  try {
    const quiz = await crudQuiz.getQuiz();
    if (!quiz) {
      throw new Error("No Quiz Available");
    }

    return res.status(200).json({
      quiz,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        message: error.message,
      });
    }
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}

export async function getOneQuiz(req: Request<QuizParam>, res: Response) {
  try {
    const { quizId } = req.params;
    const quiz = await crudQuiz.getOneQuiz(quizId);

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz unavailable",
      });
    }

    return res.status(200).json({
      quiz,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        message: error.message,
      });
    }
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}

export async function getMyQuiz(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;

    const quiz = await crudQuiz.getMyQuiz(userId);

    return res.status(200).json({
      quiz,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        message: error.message,
      });
    }
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}

export async function updateQuiz(req: Request<QuizParam>, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const { quizId } = req.params;
    const data = req.body;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized! Cannot update Quiz",
      });
    }

    const quiz = await crudQuiz.updateQuiz(userId, quizId, data);

    return res.status(200).json({
      message: "Quiz updated successfully",
      quiz,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        message: error.message,
      });
    }
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}

export async function deleteQuiz(req: Request<QuizParam>, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const { quizId } = req.params;

    await crudQuiz.deleteQuiz(quizId, userId);

    return res.status(200).json({
      message: "Quiz Deleted",
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        message: error.message,
      });
    }
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}

export async function getCategory(req: Request, res: Response) {
  return res.status(200).json({
    categories: Object.values(QuizCategory),
  });
}
