import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt";

export async function requireUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "User not logged in" });
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(400).json({
      message: "Invalid Authorization Header",
    });
  }

  try {
    const decoded = verifyAccessToken(token);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}
