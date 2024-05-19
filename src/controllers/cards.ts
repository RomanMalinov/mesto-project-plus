import { Request, Response } from "express";
import mongoose from "mongoose";
import Card from "../models/card";
import { IRequest } from "types/types";

export const getCards = (req: IRequest, res: Response) => {
  return Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка: ${err}` }));
};

export const deleteCardById = (req: IRequest, res: Response) => {
  const { cardId } = req.params;
  Card.findByIdAndDelete(cardId).orFail()
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(404).send({ message: "Карточка с указанным _id не найдена" });
      }
      return res.status(500).send({ message: `Произошла ошибка: ${err.message}` });
    });
};

export const createCard = (req: IRequest, res: Response) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user?._id })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).send({ message: "Переданы некорректные данные при создании карточки" });
      } else {
        res.status(500).send({ message: "Ошибка по умолчанию" });
      }
    });
};

export const likeCard = (req: IRequest, res: Response) => {
  const cardId = req.params.cardId;
  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    return res.status(400).send({ message: "Переданы некорректные данные для постановки лайка" });
  }
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user?._id } }, { new: true }).orFail()
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(404).send({ message: "Передан несуществующий _id карточки" });
      }
      return res.status(500).send({ message: `Произошла ошибка: ${err.message}` });
    });
};

export const dislikeCard = (req: IRequest, res: Response) => {
  const cardId = req.params.cardId;
  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    return res.status(400).send({ message: "Переданы некорректные данные для снятия лайка" });
  }
  Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user?._id } }, { new: true }).orFail()
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(404).send({ message: "Передан несуществующий _id карточки" });
      }
      return res.status(500).send({ message: `Произошла ошибка: ${err.message}` });
    });
};