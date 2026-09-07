import type { Request, Response } from "express";
import { loginSchema, signupSchema } from "../schema/user.schema";
import { authService } from "../services/auth.services";

export async function signup(req: Request, res: Response) {
  try {
    const result = signupSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues,
      });
    }

    const user = await authService.signup(result.data);

    res.cookie("refreshToken", user.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Signup successful",
      accessToken: user.accessToken,
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

export async function login(req: Request, res: Response) {
  try {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation Error",
        errors: result.error.issues,
      });
    }

    const user = await authService.login(result.data);

    res.cookie("refreshToken", user.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { refreshToken: _, user: safeUser, accessToken } = user;

    return res.status(200).json({
      message: "Login successful",
      accessToken,
      user: safeUser,
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

export async function logout(req: Request, res: Response) {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.status(200).json({
      message: "Logged out successfully",
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

export async function refresh(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies["refreshToken"];
    if (!refreshToken) {
      return res.status(404).json({
        message: "Refresh token unavailable",
      });
    }

    const accessToken = await authService.refresh(refreshToken);

    return res.status(200).json({
      message: "Refreshed!",
      accessToken,
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
