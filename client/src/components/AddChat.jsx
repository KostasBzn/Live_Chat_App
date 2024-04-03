import React, { useContext, useState } from "react";
import { UserContext } from "../context/userContext";
import { ChatContext } from "../context/chatContext";

const AddChat = ({ setAddChat, membersTalkedTo, handleSelectedUser }) => {
  const {
    user,
    findByUsername,
    usersResultByUsername,
    setUsersResultByUsername,
  } = useContext(UserContext);
  const { createNewChat } = useContext(ChatContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [chatButtonLoading, setChatButtonLoading] = useState(false);
  const [searchButtonLoading, setSearchButtonLoading] = useState(false);
  const [createButtonLoading, setCreateButtonLoading] = useState(false);

  // Find user by username
  const handleSearchByUsername = () => {
    try {
      if (!username) {
        alert("Please type a username");
      } else {
        setSearchButtonLoading(true);
        findByUsername(username);
      }
      setUsername("");
    } catch (error) {
      console.error("Error finding users", error);
    } finally {
      setSearchButtonLoading(false);
    }
  };

  //create new chat by email
  const handleCreateByEmail = () => {
    try {
      setCreateButtonLoading(true);
    } catch (error) {
      console.error("Error creating new chat", error);
    } finally {
      setCreateButtonLoading(false);
    }
    console.log("Searching by email:", email);
  };

  // Create a chat with a new user
  const handleNewChat = async (receiverId) => {
    try {
      setChatButtonLoading(true);
      createNewChat(user?._id, receiverId);
      handleSelectedUser(receiverId);
      setAddChat(false);
    } catch (error) {
      console.error("Error creating new chat:", error);
    } finally {
      setChatButtonLoading(false);
      setUsersResultByUsername([]);
    }
  };

  //Open chat if the user has already a conversation
  const handleOpenChat = (userId) => {
    try {
      setChatButtonLoading(true);
      handleSelectedUser(userId);
    } catch (error) {
      console.error("Error oppening the chat:", error);
    } finally {
      setAddChat(false);
      setChatButtonLoading(false);
      setUsersResultByUsername([]);
    }
  };

  return (
    <>
      <div className="add-chat-container">
        <div className="add-chat-box">
          {/* Close button */}
          <div className="add-chat-header">
            <button
              type="button"
              className="close-button"
              onClick={() => {
                setAddChat(false);
              }}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          {/* Search area */}
          <div className="new-chat-title">
            <h2>Create new chat</h2>
          </div>
          {/* Inputs */}
          <div className="add-chat-inputs">
            {/* Search by email */}
            <div className="add-search-by-email">
              <p>Give users email to create a new chat</p>
              <input
                type="text"
                placeholder="Create by email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button onClick={handleCreateByEmail}>Create</button>
            </div>
            {/* Search by username */}
            <div className="add-search-by-username">
              <p>Search user by username to create a new chat</p>
              <input
                type="text"
                placeholder="Search by username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {searchButtonLoading ? (
                <button className="search-loading-button" disabled>
                  <i className="fa-solid fa-hourglass-half"></i>
                </button>
              ) : (
                <button onClick={handleSearchByUsername}>
                  <i className="fa-solid fa-magnifying-glass"></i>
                </button>
              )}
            </div>
          </div>
          {/* Search results */}
          <div className="add-search-results">
            {usersResultByUsername?.length === 0 ? (
              <p>No results</p>
            ) : (
              <ul className="user-result-list">
                {usersResultByUsername?.map((user) => (
                  <li className="user-result-item" key={user._id}>
                    <span>{user.username}</span>
                    {/* Determine whether to render Open Chat, Chat, or the search button */}
                    {membersTalkedTo.some(
                      (member) => member._id === user._id
                    ) ? (
                      chatButtonLoading ? (
                        <button className="new-chat-loading-button" disabled>
                          <i className="fa-solid fa-hourglass-half"></i>
                        </button>
                      ) : (
                        <button
                          className="result-open-chat-button"
                          onClick={() => handleOpenChat(user._id)}
                        >
                          Open Chat
                        </button>
                      )
                    ) : chatButtonLoading ? (
                      <button className="new-chat-loading-button" disabled>
                        <i className="fa-solid fa-hourglass-half"></i>
                      </button>
                    ) : (
                      <button
                        className={`result-new-chat-button ${
                          searchButtonLoading ? "loading" : ""
                        }`}
                        onClick={() => handleNewChat(user._id)}
                        disabled={searchButtonLoading}
                      >
                        {searchButtonLoading ? "Loading..." : "Chat"}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AddChat;
