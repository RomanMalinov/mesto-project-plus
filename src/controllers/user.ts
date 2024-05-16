import { Request, Response } from "express";
import User from "../models/user";

export const getUsers = (req: Request, res: Response) => { //async
  return User.find({})
    .then(user => res.status(200).send({ data: user })) //здесь закончил
    .catch(err => res.status(500).send({ message: `Произошла ошибка: ${err}` })); //поправить ошибку
}

export const getUserById = (req: Request, res: Response) => {
  User.findById(req.params.userId)
    .then(user => res.status(200).send({ data: user })) //здесь закончил
    .catch(err => res.status(500).send({ message: `Произошла ошибка: ${err}` })); //поправить ошибку
}

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
  .then(user => res.status(200).send({ data: user })) //здесь закончил
  .catch(err => res.status(500).send({ message: `Произошла ошибка: ${err}` })); //поправить ошибку
}
