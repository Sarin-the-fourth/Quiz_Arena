import { Server } from "socket.io";
import { verifyAccessToken } from "../utils/jwt";

let io: Server;

export function initSocket(server: any) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Authentication token missing"));
      }

      const decoded = verifyAccessToken(token);
      console.log("Authenticated User: ", decoded); //remove later

      next();
    } catch (error) {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    console.log("Player Connected: ", socket.id);

    socket.on("disconnect", () => {
      console.log("Player Disconnected: ", socket.id);
    });
  });

  return io;
}

export function getIO() {
  if (!io) throw new Error("Socket.IO has not been initialized");

  return io;
}
