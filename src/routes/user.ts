import { Router } from 'express';
import { getUsers, getUserById, createUser, updateUsers, updateAvatar, getUserInfo } from '../controllers/user';
import { userIdValidator, userUpdateValidator, cardIdValidator } from '../validator/validator';

const userRouter = Router();

userRouter.get('/users', getUsers);
userRouter.get('/users/:userId', userIdValidator, getUserById);
userRouter.get('/users/me', getUserInfo);
userRouter.patch('/users/me', userUpdateValidator, updateUsers);
userRouter.patch('/users/me/avatar', userUpdateValidator, updateAvatar);

export default userRouter;
