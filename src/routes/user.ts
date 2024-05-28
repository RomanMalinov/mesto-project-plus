import { Router } from 'express';
import { getUsers, getUserById, updateUsers, updateAvatar, getUserInfo } from '../controllers/user';
import { userIdValidator, userUpdateValidator, avatarUpdateValidator } from '../validator/validator';

const userRouter = Router();

userRouter.get('/users', getUsers);
userRouter.get('/users/me', getUserInfo);
userRouter.get('/users/:userId', userIdValidator, getUserById);
userRouter.patch('/users/me', userUpdateValidator, updateUsers);
userRouter.patch('/users/me/avatar', avatarUpdateValidator, updateAvatar);

export default userRouter;
