import express from "express";

import "dotenv/config";
import cors from "cors";
import connectDB from "./config/mongo-db.js";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import { io, app, server } from "./socket/socket.js";

const port = process.env.PORT;
const clientURL = process.env.CLIENT_URL;

app.use(express.json());

const corsOptions = {
  origin: clientURL,
  credentials: true,
};
//
app.use(cors(corsOptions));

connectDB();

app.use("/users", userRoutes);
app.use("/messages", messageRoutes);
app.use("/chats", chatRoutes);

io.attach(server);

server.listen(port, () => {
  console.log(`The server is running in port ${port}`);
});
