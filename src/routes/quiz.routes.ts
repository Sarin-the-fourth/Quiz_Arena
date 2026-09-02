import { Router } from "express";
import {
  createQuiz,
  deleteQuiz,
  getCategory,
  getMyQuiz,
  getOneQuiz,
  getQuiz,
  updateQuiz,
} from "../controller/quiz.controller";
import { requireUser } from "../middleware/auth.middleware";

const router = Router();

router.post("/create", requireUser, createQuiz);
router.get("/", getQuiz);
router.get("/my", requireUser, getMyQuiz);
router.get("/category", getCategory);

// routes needing data in params (always keep below normal routes)
router.get("/:quizId", getOneQuiz);
router.put("/update/:quizId", requireUser, updateQuiz);
router.delete("/:quizId", requireUser, deleteQuiz);

export default router;
