import type { Server, Socket } from "socket.io";

export function registerGameSocket(io: Server, socket: Socket) {
  socket.on("joinGame", async (roomCode) => {
    console.log("joinGame received:", socket.user.name, roomCode);

    if (socket.rooms.has(roomCode)) {
      console.log("Already in room:", roomCode);
      return;
    }

    socket.join(roomCode);
    socket.to(roomCode).emit("playerJoined", {
      userId: socket.user.userId,
      name: socket.user.name,
    });
  });

  socket.on("leaveGame", (roomCode) => {
    if (!socket.rooms.has(roomCode)) {
      return;
    }
    socket.leave(roomCode);
    console.log(`User ${socket.user.name} left room ${roomCode}`);
    socket.to(roomCode).emit("playerLeft", {
      userId: socket.user.userId,
      name: socket.user.name,
    });
  });
}
