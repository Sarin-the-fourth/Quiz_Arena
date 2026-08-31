import "dotenv/config";
import app from "./app";
import { connectDB } from "./config/db";
import http from "http";
import { initSocket } from "./config/socket";

connectDB();

const server = http.createServer(app);
initSocket(server);

server.listen(3000, () => {
  console.log("Server running on PORT: 3000");
});
