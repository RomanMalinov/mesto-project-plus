import { Router } from 'express';
import { getCards, deleteCardById, createCard, likeCard, dislikeCard } from '../controllers/cards';
import { cardCreationValidator, cardIdValidator } from '../validator/validator';

const cardsRouter = Router();

cardsRouter.get('/cards', getCards);
cardsRouter.delete('/cards/:cardId', cardIdValidator, deleteCardById);
cardsRouter.post('/cards', cardCreationValidator, createCard);
cardsRouter.put('/cards/:cardId/likes', likeCard);
cardsRouter.delete('/cards/:cardId/likes', dislikeCard);

export default cardsRouter;
