import { Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/user";
import { IRequest } from "types/types";

export const getUsers = (req: Request, res: Response) => {
  return User.find({})
    .then((users) => {
      if (!users || users.length === 0) {
        return res.status(404).send({ message: "Пользователи не найдены" });
      }
      return res.status(200).send({ data: users });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: "Переданы некорректные данные" });
      }
      return res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};

export const getUserById = (req: Request, res: Response) => {
  User.findById(req.params.userId).orFail()
    .then((user) => {
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(404).send({ message: "Пользователь с указанным _id не найден" });
      } else if (err instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: "Переданы некорректные данные" });
      }
      return res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};


export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "Пользователь не создан" });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: "Переданы некорректные данные при создании пользователя" });
      }
      return res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};

export const updateUsers = (req: IRequest, res: Response) => {
  const { name, about } = req.body;
  const userId = req.user?._id;

  User.findByIdAndUpdate(userId, { name, about }, { new: true }).orFail()
    .then((user) => {
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(404).send({ message: "Пользователь с указанным _id не найден" });
      } else if (err instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: "Переданы некорректные данные при обновлении профиля" });
      }
      return res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};


export const updateAvatar = (req: IRequest, res: Response) => {
  const { avatar } = req.body;
  const userId = req.user?._id;

  User.findByIdAndUpdate(userId, { avatar }, { new: true }).orFail()
    .then((user) => {
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(404).send({ message: "Пользователь с указанным _id не найден" });
      } else if (err instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: "Переданы некорректные данные при обновлении аватара" });
      }
      return res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};