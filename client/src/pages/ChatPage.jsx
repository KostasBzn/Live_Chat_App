import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/userContext";
import { ChatContext } from "../context/chatContext";

const ChatPage = () => {
  const { allUsers, fetchUsers, user, logoutUser } = useContext(UserContext);
  const {
    chatsForUser,
    selectedChat,
    messagesForChat,
    createNewChat,
    findChat,
    getUserChats,
    createNewMessage,
    getMessagesForChat,
    setSelectedChat,
    onlineUsers,
  } = useContext(ChatContext);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [membersTalkedTo, setMembersTalkedTo] = useState();
  const [userSelected, setUserSelected] = useState(null);

  //first i get the chats for the logged user
  useEffect(() => {
    if (user?._id) {
      getUserChats(user._id);
    }
  }, [user]);

  //The function too find the participants of my chats
  const getMembersTalkedTo = (chats) => {
    const members = [];

    chats?.forEach((chat) => {
      chat?.participants.forEach((participant) => {
        if (participant._id !== user._id) {
          // Exclude the logged-in user
          members.push(participant);
        }
      });
    });

    return members;
  };

  //then i get the members i talked to from inside the chat
  //which  i render to see the names on the left
  useEffect(() => {
    if (chatsForUser) {
      const members = getMembersTalkedTo(chatsForUser);
      setMembersTalkedTo(members);
    }
  }, [chatsForUser]);

  //once i click on the user i find the chat happened
  const handleSelectedUser = async (userId) => {
    try {
      setUserSelected(userId);
      await findChat(user?._id, userId);
    } catch (error) {
      console.error("Error finding chat:", error);
    }
  };

  //having the selected chat  use the id to fetch the messages for this chat
  useEffect(() => {
    if (selectedChat?._id) {
      getMessagesForChat(selectedChat?._id);
    }
  }, [selectedChat]);

  //send new message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!newMessage) {
        alert("Please type a message");
        return;
      }
      if (!selectedChat) {
        alert("Please select someone to talk");
      }
      await createNewMessage(selectedChat._id, user._id, newMessage);

      setNewMessage("");
    } catch (error) {
      console.error("Error sending the message", error);
    } finally {
      setIsLoading(false);
    }
  };

  //fetch all the users
  useEffect(() => {
    fetchUsers();
  }, [user]);

  //create a chat with a new user
  const handleNewChat = async (receiverId) => {
    try {
      // Check if the chat already exists
      const existingChat = chatsForUser?.find((chat) =>
        chat.participants.some((participant) => participant._id === receiverId)
      );

      if (existingChat) {
        // If the chat exists, set it as the selected chat
        setUserSelected(receiverId);
        setSelectedChat(existingChat);
        // Fetch messages for the existing chat
        getMessagesForChat(existingChat._id);
      } else {
        // If the chat doesn't exist, create a new chat
        createNewChat(user?._id, receiverId);
      }
    } catch (error) {
      console.error("Error crating new chat:", error);
    }
  };

  const handleLogout = () => {
    logoutUser();
  };

  // Function to check if a user is online
  const isUserOnline = (userId) =>
    onlineUsers.some((user) => user.userId === userId);

  return (
    <div className="chat-container">
      {/* Existing chat list section */}
      <div className="user-list">
        <div>
          <button
            className="chat-logout-button"
            onClick={() => {
              handleLogout();
            }}
          >
            Logout
          </button>
          <div className="welcome-message">
            <p>Welcome {user?.username}</p>
          </div>
        </div>
        <section className="chat-users-section">
          <div className="chat-users">
            <h3 className="user-list-title">Existing Chats</h3>
            <div className="users-list-map">
              <ul>
                {/* Render existing chats */}
                {user &&
                  membersTalkedTo?.map((item) => {
                    if (user?._id !== item._id) {
                      return (
                        <li
                          className={`chat-username ${
                            userSelected === item._id ? "selected-user" : ""
                          }`}
                          key={item._id}
                          onClick={() => handleSelectedUser(item._id)}
                        >
                          {/* Render green dot if user is online, red dot if offline */}
                          {isUserOnline(item._id) ? (
                            <span style={{ color: "green" }}> ● </span>
                          ) : (
                            <span style={{ color: "red" }}> ● </span>
                          )}{" "}
                          {item.username}
                        </li>
                      );
                    }
                    return null; // Exclude the current user from rendering
                  })}
              </ul>
            </div>
          </div>

          {/* New section for all users */}
          <div className="all-users">
            <h3 className="user-list-title">All Users</h3>
            <div className="users-list-map">
              <ul>
                {/* Render all users */}
                {user &&
                  allUsers?.map((item) => {
                    if (user?._id !== item._id) {
                      return (
                        <li
                          className="all-users-username"
                          key={item._id}
                          onClick={() => handleNewChat(item._id)}
                        >
                          {/* Render green dot if user is online, red dot if offline */}
                          {isUserOnline(item._id) ? (
                            <span style={{ color: "green" }}> ● </span>
                          ) : (
                            <span style={{ color: "red" }}> ● </span>
                          )}
                          {item.username}
                        </li>
                      );
                    }
                    return null; // Exclude the current user from rendering
                  })}
              </ul>
            </div>
          </div>
        </section>
      </div>

      {/* Chat Area */}
      <div className="chat-area">
        {/* Placeholder for rendering messages */}
        <div className="messages">
          {messagesForChat?.map((message) => (
            <div
              className={`message ${
                message?.sender._id === user?._id ? "sent" : "received"
              }`}
              key={message._id}
            >
              <div className="message-text">{message.text}</div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div>
          <form onSubmit={handleSendMessage} className="input-area">
            <textarea
              className="message-input"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
              }}
            ></textarea>
            {isLoading ? (
              <button disabled className="send-button-loading">
                <i className="fa-solid fa-hourglass-half"></i>
              </button>
            ) : (
              <button type="submit" className="send-button">
                <i className="fa-regular fa-paper-plane"></i>
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
