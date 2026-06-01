import express from "express";
import { verifyToken } from "../middleware/authmiddleware.js";
import { getallmessage } from "../controller/messagecontroller.js";

const messageRoutes = express.Router();

messageRoutes.get("/allmessages/:id", verifyToken, getallmessage);

export default messageRoutes;
