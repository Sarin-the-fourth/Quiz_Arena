import type { Socket } from "socket.io";
import { verifyAccessToken } from "../utils/jwt";

export function socketAuth(socket: Socket, next: (err?: Error) => void) {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication token missing"));
    }

    const decoded = verifyAccessToken(token);

    socket.user = decoded;

    next();
  } catch {
    next(new Error("Invalid or expired token"));
  }
}
