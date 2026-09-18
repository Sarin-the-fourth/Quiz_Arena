import { z } from "zod";

export const createGameSchema = z.object({
  quizId: z.string().min(1, "Quiz ID required"),
  gameMode: z.enum(["SINGLE", "MULTIPLAYER"]),
  gameVisibility: z.enum(["PUBLIC", "PRIVATE"]),
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
  roomCode: z
    .string()
    .min(1, "Room Code is Required")
    .max(6, "Invalid Room Code"),
});

export const startGameSchema = getOneGameSchema;
