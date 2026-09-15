import type { Socket } from "socket.io";
import { verifyAccessToken } from "../utils/jwt.js";
import { User } from "../model/user.model.js";

export async function socketAuth(socket: Socket, next: (err?: Error) => void) {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication token missing"));
    }

    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.userId).select("name");

    if (!user) {
      throw new Error("User not found!");
    }

    socket.user = {
      userId: decoded.userId,
      email: decoded.email,
      name: user.name,
    };

    next();
  } catch {
    next(new Error("Invalid or expired token"));
  }
}
