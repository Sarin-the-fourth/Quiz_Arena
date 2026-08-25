import { z } from "zod";

export const createGameSchema = z.object({
  quizId: z.string().min(1, "Quiz ID required"),
});

export type CreateGameDTO = z.infer<typeof createGameSchema>;
