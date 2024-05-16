import { Router } from "express";
import {getUsers, getUserById, createUser} from "../controllers/user";

const userRouter = Router();

userRouter.get("/users", getUsers);
userRouter.get("/users/:userId", getUserById);
userRouter.post("/users", createUser);

export default userRouter;