import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const clientURL = process.env.CLIENT_URL;

const io = new Server({
  cors: clientURL,
});

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("Socket.io new connection...", socket.id);
  // listen o a connection
  socket.on("addNewUser", (userId) => {
    !onlineUsers.some((user) => user.userId === userId) &&
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });
    console.log("online users:", onlineUsers);

    io.emit("getOnlineUsers", onlineUsers);
  });

  //add message
  socket.on("sendMessage", (message) => {
    const receiver = onlineUsers.find(
      (user) => user.userId === message.receiverId
    );

    if (receiver) {
      io.to(receiver.socketId).emit("getMessage", message);
    }
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);

    io.emit("getOnlineUsers", onlineUsers);
  });
});

io.listen(3000);
