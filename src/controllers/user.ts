import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { IRequest } from '../types/types';
import NotFoundError from '../errors/NotFoundError';
import InvalidDataError from '../errors/InvalidDataError';
import UnauthorizedError from '../errors/UnauthorizedError';
import DuplicateError from '../errors/DuplicateError';

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(next);
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.params.userId)
    .orFail(new NotFoundError('Пользователь с указанным _id не найден'))
    .then((user) => res.status(200).send({ data: user }))
    .catch(next);
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({ name, about, avatar, email, password: hash }))
    .then((user) => res.status(201).send({ email: user.email, id: user._id }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InvalidDataError('Переданы некорректные данные при создании пользователя'));
      } else if (err.code === 11000) {
        next(new DuplicateError('Пользователь с таким email уже существует'));
      } else {
        next(err);
      }
    });
};

export const updateUsers = (req: IRequest, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  const userId = req.user?._id;
  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .orFail(() => new NotFoundError('Пользователь с указанным _id не найден'))
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError
        || err instanceof mongoose.Error.CastError) {
        next(new InvalidDataError('Переданы некорректные данные при обновлении профиля'));
      } else {
        next(err);
      }
    });
};

export const updateAvatar = (req: IRequest, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  const userId = req.user?._id;
  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .orFail(() => new NotFoundError('Пользователь с указанным _id не найден'))
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError
        || err instanceof mongoose.Error.CastError) {
        next(new InvalidDataError('Переданы некорректные данные при обновлении аватара'));
      } else {
        next(err);
      }
    });
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secret_code', { expiresIn: '7d' });
      res.cookie('token', token, { httpOnly: true }).send({ message: 'Успешная авторизация' });
    })
    .catch(() => next(new UnauthorizedError('Неправильные почта или пароль')));
};

export const getUserInfo = (req: IRequest, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  User.findById(userId)
    .orFail(() => new NotFoundError('Пользователь не найден'))
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new InvalidDataError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
