import express from "express";
import {
    activateUser,
    deleteUser,
    forgotPassword,
    getAllUsersAdmin,
    getUserInfo,
    loginUser,
    logoutUser,
    registrationUser,
    resetPassword,
    updateAccessToken,
    updatePassword,
    updateProfilePicture,
    updateUserInfo,
    updateUserRole, updateUserStatus
} from "../controllers/user.controller";
import {authorizeRoles, isAuthenticated} from "../middleware/auth";

const userRouter = express.Router();

userRouter.post("/register", registrationUser);

userRouter.post("/active-users", activateUser);

userRouter.post("/login", loginUser);

userRouter.get("/logout", logoutUser);

userRouter.get(
    "/get-user-info",
    isAuthenticated,
    getUserInfo
);

userRouter.put(
    "/update-user-info",
    isAuthenticated,
    updateUserInfo
);

userRouter.put(
    "/update-user-password",
    isAuthenticated,
    updatePassword
);

userRouter.put(
    "/update-user-avatar",
    isAuthenticated,
    updateProfilePicture
);

userRouter.get(
    "/get-all-users-admin",
    isAuthenticated,
    authorizeRoles("admin"),
    getAllUsersAdmin
);

userRouter.put(
    "/update-user-role",
    isAuthenticated,
    authorizeRoles("admin"),
    updateUserRole
);

userRouter.delete(
    "/delete-user/:id",
    isAuthenticated,
    authorizeRoles("admin"),
    deleteUser
);

userRouter.post("/forget-password", forgotPassword);

userRouter.patch("/reset-password/:token", resetPassword);

userRouter.post(
    "/update-user-status",
    isAuthenticated,
    authorizeRoles("admin"),
    updateUserStatus
);

export default userRouter;
