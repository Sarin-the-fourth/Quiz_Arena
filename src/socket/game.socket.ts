import type { Server, Socket } from "socket.io";

export function registerGameSocket(io: Server, socket: Socket) {
  socket.on("joinGame", (roomCode) => {
    console.log("joinGame received:", socket.user.userId, roomCode);

    if (socket.rooms.has(roomCode)) {
      console.log("Already in room:", roomCode);
      return;
    }

    socket.join(roomCode);

    console.log(`User ${socket.user.userId} joined room ${roomCode}`);

    socket.to(roomCode).emit("playerJoined", {
      userId: socket.user.userId,
    });

    console.log("playerJoined emitted:", roomCode);
  });

  socket.on("leaveGame", (roomCode) => {
    if (!socket.rooms.has(roomCode)) {
      return;
    }
    socket.leave(roomCode);
    console.log(`User ${socket.user.userId} left room ${roomCode}`);
    socket.to(roomCode).emit("playerLeft", {
      userId: socket.user.userId,
    });
  });
}
