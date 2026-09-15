import type { Server } from "socket.io";
import { registerGameSocket } from "./game.socket.js";

export function registerSocketHandlers(io: Server) {
  io.on("connection", (socket) => {
    console.log("Player Connected:", socket.id);

    registerGameSocket(io, socket);

    socket.on("disconnect", () => {
      console.log("Player Disconnected:", socket.id);
    });
  });
}
