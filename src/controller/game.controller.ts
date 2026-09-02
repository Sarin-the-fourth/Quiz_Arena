import type { Request, Response } from "express";
import { gameService } from "../services/game.services";
import {
  createGameSchema,
  getOneGameSchema,
  joinGameSchema,
  startGameSchema,
} from "../schema/game.schema";

export async function createGame(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const result = createGameSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: result.error.issues,
      });
    }

    const game = await gameService.createGame(
      result.data.quizId,
      userId,
      result.data.gameMode
    );

    return res.status(200).json({
      message: "New game created",
      game,
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

export async function joinGame(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const result = joinGameSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: result.error.issues,
      });
    }

    const game = await gameService.joinGame(result.data.roomCode, userId);

    return res.status(200).json({
      message: `Joined Room ${result.data.roomCode}`,
      game,
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

export async function getGame(req: Request, res: Response) {
  try {
    const games = await gameService.getGame();

    return res.status(200).json({
      games,
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

export async function getOneGame(req: Request, res: Response) {
  try {
    const result = getOneGameSchema.safeParse(req.params);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation Error",
        errors: result.error.issues,
      });
    }

    const game = await gameService.getOneGame(result.data.gameId);

    return res.status(200).json({
      game,
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

export async function startGame(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const result = startGameSchema.safeParse(req.params);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation Error",
        errors: result.error.issues,
      });
    }

    const game = await gameService.startGame(result.data.gameId, userId);

    return res.status(200).json({
      message: "Game started",
      game,
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
