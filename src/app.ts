import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import userRouter from './routes/user';
import cardsRouter from './routes/card';
import { MONGO_URL, PORT } from './constants/constants';
import { IRequest } from './types/types';
import { login, createUser } from './controllers/user';
import userAuth from './middlewares/auth';

const app = express();

app.use(helmet());
app.use(express.json());

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log('База данных MongoDB подключена');
  })
  .catch((err) => {
    console.log(err);
  });

app.use(userRouter);
app.use(cardsRouter);
app.post('/signin', login);
app.post('/signup', createUser);
app.use(userAuth);
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту: ${PORT}`);
});
