import express from "express";
import {
  createNewChat,
  findChat,
  getUserChats,
} from "../controllers/chatController.js";

const chatRoutes = express.Router();

chatRoutes.post("/api/new", createNewChat);

chatRoutes.get("/api/user/:userId", getUserChats);

chatRoutes.get("/api/chat/:senderId/:receiverId", findChat);

export default chatRoutes;
