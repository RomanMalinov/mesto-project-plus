import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Card from '../models/card';
import { IRequest } from '../types/types';
import NotFoundError from '../errors/NotFoundError';
import InvalidDataError from '../errors/InvalidDataError';
import UnauthorizedError from '../errors/UnauthorizedError';

export const getCards = (req: IRequest, res: Response, next: NextFunction) => Card.find({})
  .then((cards) => res.status(200).send({ data: cards }))
  .catch(next);

export const deleteCardById = (req: IRequest, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = req.user && req.user._id;
  Card.findById(cardId)
    .orFail(() => new NotFoundError('Карточка с указанным _id не найдена'))
    .then((card) => {
      if (card.owner.toString() !== userId) {
        throw new UnauthorizedError('У вас нет прав на удаление этой карточки');
      }
      return Card.findByIdAndDelete(cardId);
    })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new InvalidDataError('Переданы некорректные данные для удаления карточки'));
      } else {
        next(err);
      }
    });
};

export const createCard = (req: IRequest, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user?._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new InvalidDataError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

export const likeCard = (req: IRequest, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user?._id } }, { new: true })
    .orFail(() => new NotFoundError('Передан несуществующий _id карточки'))
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Передан несуществующий _id карточки'));
      } else {
        next(err);
      }
    });
};

export const dislikeCard = (req: IRequest, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  return Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user?._id } },
    { new: true },
  )
    .orFail(() => new NotFoundError('Передан несуществующий _id карточки'))
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Передан несуществующий _id карточки'));
      } else {
        next(err);
      }
    });
};
