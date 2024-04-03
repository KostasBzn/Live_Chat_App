import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "../config/axios.js";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [usersResultByUsername, setUsersResultByUsername] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const navigate = useNavigate();

  const baseURL = import.meta.env.VITE_BASE_URL;

  //Login
  const loginUser = async (email, password) => {
    const body = {
      email,
      password,
    };

    try {
      const response = await axios.post(
        baseURL + "/users/api/auth/login",
        body
      );

      if (response.data.success) {
        setUser(response.data.user);
        localStorage.setItem("token", response.data.token);
        navigate("/chat");
      }
    } catch (error) {
      console.error("Error login user", error);
    }
  };

  //Register user
  const registerUser = async (username, email, password) => {
    const body = { username, email, password };
    try {
      const response = await axios.post(
        baseURL + `/users/api/auth/register`,
        body
      );

      if (response.data.success) {
        navigate("/");
      }
    } catch (error) {
      console.error("Error register user", error);
    }
  };

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

  //get by username
  const findByUsername = async (username) => {
    try {
      const response = await axios.get(baseURL + `/users/find/${username}`);
      if (response.data.success) {
        const filteredUsers = response.data.users.filter(
          (item) => item._id !== user._id
        );
        setUsersResultByUsername(filteredUsers);

        console.log("users by username", filteredUsers);
      }
    } catch (error) {
      console.error("Failed to find users by username:", error);
      setUsersResultByUsername([]);
    }
  };

  //logout user
  const logoutUser = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  //find User
  const findUser = async (userId) => {
    try {
      const response = await axios.get(baseURL + `/users/api/user/${userId}`);

      if (response.data.success) {
        setSelectedUser(response.data.user);
      }
    } catch (error) {
      console.error("Error finding the User", error.message);
    }
  };
  return (
    <UserContext.Provider
      value={{
        user,
        usersResultByUsername,
        setUsersResultByUsername,
        selectedUser,
        loginUser,
        registerUser,
        findByUsername,
        logoutUser,
        findUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
