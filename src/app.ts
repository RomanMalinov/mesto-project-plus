import express, { Response, Request } from "express";
import mongoose from "mongoose";
import userRouter from "./routes/user";
import cardsRouter from "./routes/card";
import { MONGO_URL, PORT } from "./constants/constants"
import { IRequest } from "types/types";

const app = express();
app.use(express.json());
mongoose.connect(MONGO_URL)
  .then(() => {
    console.log("База данных MongoDB подключена")
  })
  .catch((err) => {
    console.log(err)
  });

app.use((req: IRequest, res, next) => {
  req.user = { _id: "6645d218622adfe094e388e8" };
  next();
});

app.use(userRouter);
app.use(cardsRouter);

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту: ${PORT}`);
});
