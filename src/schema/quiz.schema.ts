import { z } from "zod";
import { QuizCategory } from "../model/quiz.model";

export const z_questionSchema = z
  .object({
    question: z.string().trim().min(1, "Question is required"),
    options: z
      .array(
        z.object({
          id: z.string(),
          option: z.string().trim().min(1, "Option cannot be empty"),
        })
      )
      .min(2, "Atleast 2 options are required")
      .max(4, "Only 4 options are allowed"),
    correctAnswer: z.string().trim().min(1, "Correct Answer is required"),
    timeLimit: z.number().min(5).max(15).default(15),
  })
  .superRefine((data, ctx) => {
    const optionIds = data.options.map((option) => option.id);
    if (!optionIds.includes(data.correctAnswer)) {
      ctx.addIssue({
        code: "custom",
        path: ["correctAnswer"],
        message: "Correct answer must be one of the options",
      });
    }
  });

export const z_quizSchema = z.object({
  title: z.string().trim().min(1, "Title required"),
  description: z.string().trim().min(1, "Description required"),
  category: z.enum(QuizCategory),
  questions: z.array(z_questionSchema).min(1, "Atleast 1 question required"),
});

export type CreateQuizDTO = z.infer<typeof z_quizSchema>;

export const z_updateQuizSchema = z_quizSchema.partial();
export type UpdateQuizDTO = z.infer<typeof z_updateQuizSchema>;
