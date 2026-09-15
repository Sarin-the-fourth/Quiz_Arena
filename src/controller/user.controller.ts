import type { Request, Response } from "express";
import { userService } from "../services/user.services.js";

type UserIdType = {
  userId: string;
};

export async function getOneUser(req: Request<UserIdType>, res: Response) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        message: "UserID required",
      });
    }
    const user = await userService.getOneUser(userId);

    return res.status(200).json({
      user,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        message: error.message,
      });
    }
    return res.status(500).json({
      message: "Something went wrong!",
    });
  }
}

export async function getMe(req: Request<UserIdType>, res: Response) {
  try {
    const userId = (req as any).user.userId;

    const user = await userService.getMe(userId);

    return res.status(200).json({
      user,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        message: error.message,
      });
    }
    return res.status(500).json({
      message: "Something went wrong!",
    });
  }
}
