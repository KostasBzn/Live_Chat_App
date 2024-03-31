import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

import axios from "../config/axios.js";
import { UserContext } from "./userContext.jsx";

export const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [chatsForUser, setChatsForUser] = useState(null);
  const [selectedChat, setSelectedChat] = useState();
  const [messagesForChat, setMessagesForChat] = useState();
  const [newSentMessage, setNewSentMessage] = useState();
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  //intial socket
  useEffect(() => {
    const newSocket = io(baseURL);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // Add the 'user' state variable to the dependency array
  useEffect(() => {
    if (socket === null || !user) return;

    // Emit the 'addNewUser' event with the user ID
    socket.emit("addNewUser", user?._id);

    // Listen for 'getOnlineUsers' event and update the state
    socket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res);
    });

    // Clean up event listener when component unmounts
    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket, user]); // Include 'user' in the dependency array

  //send message
  useEffect(() => {
    if (socket === null) return;
    const receiver = selectedChat?.participants?.find(
      (participant) => participant._id !== user?._id
    );
    const receiverId = receiver._id;
    //console.log("receiver", receiver);

    socket.emit("sendMessage", { ...newSentMessage, receiverId });
  }, [newSentMessage]);

  //receive message
  useEffect(() => {
    if (socket === null) return;

    socket.on("getMessage", (res) => {
      if (selectedChat?._id !== res.chat) return;

      setMessagesForChat((prev) => [...prev, res]);
      //console.log("response", res);
    });
    //console.log("messages", messagesForChat);
    return () => {
      socket.off("getMessage");
    };
  }, [socket, messagesForChat]);

  const baseURL = import.meta.env.VITE_BASE_URL;

  //logged user
  const loggedUser = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const response = await axios.get(baseURL + `/users/api/auth/me`);
        if (response.data.success) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error("Error logged user", error);
        localStorage.removeItem("token");
        setUser(null);
      }
    }
  };
  useEffect(() => {
    loggedUser();
  }, []);

  //New Chat
  const createNewChat = async (senderId, receiverId) => {
    const body = { senderId, receiverId };
    try {
      const response = await axios.post(baseURL + `/chats/api/new`, body);

      if (response.data.success) {
        if (chatsForUser) {
          setChatsForUser([...chatsForUser, response.data.chat]);
          console.log("chats context spread", chatsForUser);
        } else {
          setChatsForUser([response.data.chat]);
          console.log("chats context first", chatsForUser);
        }
      }
    } catch (error) {
      console.error("Error creating new chat", error);
    }
  };

  //get user Chat
  const getUserChats = async (userId) => {
    try {
      const response = await axios.get(baseURL + `/chats/api/user/${userId}`);

      if (response.data.success) {
        setChatsForUser(response.data.userChats);
      }
    } catch (error) {
      console.error("Error finding chats for the User", error.message);
    }
  };

  //find chat
  const findChat = async (senderId, receiverId) => {
    try {
      const response = await axios.get(
        baseURL + `/chats/api/chat/${senderId}/${receiverId}`
      );

      if (response.data.success) {
        setSelectedChat(response.data.chat);
      }
    } catch (error) {
      console.error("Error finding the selected chat", error.message);
    }
  };

  //New Message
  const createNewMessage = async (chat, sender, text) => {
    const body = { chat, sender, text };
    try {
      const response = await axios.post(baseURL + `/messages/api/new`, body);
      if (response.data.success) {
        setNewSentMessage(response.data.newMessage);
        if (messagesForChat) {
          setMessagesForChat([...messagesForChat, response.data.newMessage]);
        } else {
          setMessagesForChat([response.data.newMessage]);
        }
      }
    } catch (error) {
      console.error("Error creating new message", error);
    }
  };

  //find messages for chat
  const getMessagesForChat = async (chatId) => {
    try {
      const response = await axios.get(
        baseURL + `/messages/api/chat/${chatId}`
      );

      if (response.data.success) {
        setMessagesForChat(response.data.allMessages);
      }
    } catch (error) {
      console.error("Error finding the selected chat", error.message);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chatsForUser,
        selectedChat,
        messagesForChat,
        onlineUsers,
        setSelectedChat,
        createNewChat,
        findChat,
        getUserChats,
        createNewMessage,
        getMessagesForChat,
        setSelectedChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
