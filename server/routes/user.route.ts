import express from "express";
import {
  activateUser,
  getUserInfo,
  loginUser,
  logoutUser,
  registrationUser,
  socialAuth,
  updateAccessToken
} from "./../controllers/user.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

const userRouter = express.Router();

userRouter.post("/register", registrationUser);

userRouter.post("/active-users", activateUser);

userRouter.post("/login", loginUser);

userRouter.get("/logout", isAuthenticated, logoutUser);

userRouter.get("/refresh-token", updateAccessToken);

userRouter.get("/get-user-info", isAuthenticated, getUserInfo);

userRouter.post("/social-auth", socialAuth);

export default userRouter;
