import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import http from "http";
import { initSocket } from "./config/socket.js";

connectDB();

const PORT = Number(process.env.PORT) || 3000;

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on: ${PORT}`);
});
