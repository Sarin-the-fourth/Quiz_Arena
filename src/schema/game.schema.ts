import { z } from "zod";

export const createGameSchema = z.object({
  quizId: z.string().min(1, "Quiz ID required"),
});

export type CreateGameDTO = z.infer<typeof createGameSchema>;

export const joinGameSchema = z.object({
  roomCode: z
    .string()
    .trim()
    .min(1, "Room code is required")
    .max(6, "Room code invalid"),
});

export const getOneGameSchema = z.object({
  gameId: z.string().trim().min(1, "Game ID required"),
});

export const startGameSchema = getOneGameSchema;
