import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/user";

const app = express();
app.use(express.json());
const PORT = 3000;

mongoose.connect("mongodb://localhost:27017/mestodb");



app.get("/", (req, res) => {
  res.status(200).json("test")
});


app.use(userRouter);

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});