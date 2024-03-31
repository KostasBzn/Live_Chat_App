import express from "express";
import {
  createMessage,
  getMessages,
} from "../controllers/messageController.js";

const messageRoutes = express.Router();

messageRoutes.post("/api/new", createMessage);

messageRoutes.get("/api/chat/:chatId", getMessages);

export default messageRoutes;
