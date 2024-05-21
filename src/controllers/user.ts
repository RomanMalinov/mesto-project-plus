import { Request, Response } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { IRequest } from '../types/types';

export const getUsers = (req: Request, res: Response) => User.find({})
  .then((users) => {
    if (!users || users.length === 0) {
      return res.status(404).send({ message: 'Пользователи не найдены' });
    }
    return res.status(200).send({ data: users });
  })
  .catch((err) => {
    if (err instanceof mongoose.Error.CastError) {
      return res.status(400).send({ message: 'Переданы некорректные данные' });
    }
    return res.status(500).send({ message: `Произошла ошибка: ${err}` });
  });

export const getUserById = (req: Request, res: Response) => User.findById(req.params.userId)
  .orFail()
  .then((user) => {
    res.status(200).send({ data: user });
  })
  .catch((err) => {
    if (err instanceof mongoose.Error.DocumentNotFoundError) {
      res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
    } else if (err instanceof mongoose.Error.CastError) {
      res.status(400).send({ message: 'Переданы некорректные данные' });
    }
    return res.status(500).send({ message: `Произошла ошибка: ${err}` });
  });

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar, email, password } = req.body;
  return bcrypt.hash(password, 10)
    .then((hash) => User.create({ name, about, avatar, email, password: hash }))
    .then((user) => res.status(201).send({ email: user.email, id: user._id }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(500).send({ message: `Произошла ошибка: ${err.message}` });
    });
};

export const updateUsers = (req: IRequest, res: Response) => {
  const { name, about } = req.body;
  const userId = req.user?._id;
  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true }).orFail()
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
      } else if (err instanceof mongoose.Error.ValidationError
        || err instanceof mongoose.Error.CastError) {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};

export const updateAvatar = (req: IRequest, res: Response) => {
  const { avatar } = req.body;
  const userId = req.user?._id;
  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true }).orFail()
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
      } else if (err instanceof mongoose.Error.ValidationError
        || err instanceof mongoose.Error.CastError) {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }
      res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};

export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secret_code', { expiresIn: '7d' });
      res.cookie('token', token, { httpOnly: true });
      res.send({ message: 'Успешная авторизация' });
    })
    .catch(() => {
      res.status(401).send({ message: 'Неправильные почта или пароль' });
    });
};
