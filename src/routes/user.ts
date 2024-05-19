import { Router } from "express";
import { getUsers, getUserById, createUser, updateUsers, updateAvatar } from "../controllers/user";

const userRouter = Router();

userRouter.get("/users", getUsers);
userRouter.get("/users/:userId", getUserById);
userRouter.post("/users", createUser);
userRouter.patch("/users/me", updateUsers);
userRouter.patch("/users/me/avatar", updateAvatar);

export default userRouter;