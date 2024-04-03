import express from "express";
import auth from "../middlewares/user-auth.js";
import {
  findByUsername,
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
userRoutes.get("/find/:username", findByUsername);

export default userRoutes;
