import { Server } from "socket.io";
import type { Server as HttpServer } from "http";
import { socketAuth } from "../socket/socket.middleware.js";
import { registerSocketHandlers } from "../socket/socket.handler.js";
import { allowedOrigins } from "./cors.js";

let io: Server;

export function initSocket(server: HttpServer) {
  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
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
