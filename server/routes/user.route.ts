import express from "express";
import {
  activateUser,
  registrationUser
} from "./../controllers/user.controller";

const userRouter = express.Router();

userRouter.post("/register-user", registrationUser);

userRouter.post("/active-users", activateUser);

export default userRouter;
