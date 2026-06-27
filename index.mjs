import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import socketAuth from "./middleware/socketAuth.js";
import connectDB from "./config/db.js";
import chatSocket from "./sockets/chatSocket.js";
import Message from "./models/Message.js";
import messageRoutes from "./routes/messageRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import friendRoutes from "./routes/friendRoutes.js";
import dmRoutes from "./routes/dmRoutes.js";

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/messages", messageRoutes);

app.use("/api/users", userRoutes);

app.use("/api/friends", friendRoutes);

app.use("/api/dms", dmRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin:
      "http://localhost:5173",
  },
});

io.use(socketAuth);

chatSocket(io);

server.listen(3000, () => {
  console.log("Server running");
});