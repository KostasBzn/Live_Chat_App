import express from "express";
import auth from "../middlewares/user-auth.js";
import {
  findAllUsers,
  findUser,
  loggedUser,
  loginUser,
  registerUser,
} from "../controllers/userContollers.js";

const userRoutes = express.Router();

userRoutes.post("/api/auth/register", registerUser);
userRoutes.post("/api/auth/login", loginUser);
userRoutes.get("/api/auth/me", auth, loggedUser);
userRoutes.get("/api/user/:userId", findUser);
userRoutes.get("/api/users/all", findAllUsers);

export default userRoutes;
