import express from "express";
import mongoose from "mongoose";

const app = express();

mongoose.connect("mongodb://localhost:27017/mydb");
const PORT = 3000;

app.get("/", (req, res) => {
  res.status(200).json("test")
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
