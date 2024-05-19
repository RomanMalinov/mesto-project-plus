import { Router } from "express";
import { getCards, deleteCardById, createCard, likeCard, dislikeCard } from "../controllers/cards";

const cardsRouter = Router();

cardsRouter.get("/cards", getCards);
cardsRouter.delete("/cards/:cardId", deleteCardById);
cardsRouter.post("/cards", createCard);
cardsRouter.put("/cards/:cardId/likes", likeCard);
cardsRouter.delete("/cards/:cardId/likes", dislikeCard);

export default cardsRouter;