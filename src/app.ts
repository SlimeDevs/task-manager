import express from "express";
import path from "path";
import userRouter from "./routes/user";
import todoRouter from "./routes/todo";
import "./db/mongoose";
const app = express();

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")
app.use(express.json())
app.use(userRouter);
app.use(todoRouter)

export default app;