import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { sockethandler } from "./controller/socketcontroller.js";
import { connectionDB } from "./config/dbConnection.js";
import authRouter from "./Routes/authRoutes.js";
import messageRoutes from "./Routes/messageRoutes.js";
dotenv.config();

const app = express();
const server = createServer(app);
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/message", messageRoutes);
connectionDB();

const io = new Server(server, { cors: { origin: "http://localhost:3000" } });
const port = process.env.PORT || 3005;

sockethandler(io);

server.listen(port, () => {
  console.log(`server running in ${port}`);
});
