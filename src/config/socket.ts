import { Server } from "socket.io";
import type { Server as HttpServer } from "http";
import { verifyAccessToken } from "../utils/jwt";
import { socketAuth } from "../socket/socket.middleware";
import { registerSocketHandlers } from "../socket/socket.handler";

let io: Server;

export function initSocket(server: HttpServer) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.use(socketAuth);
  registerSocketHandlers(io);
  return io;
}

export function getIO() {
  if (!io) throw new Error("Socket.IO has not been initialized");

  return io;
}
