import express from "express";
import path from "path";
import cors from "cors";
import helmet from 'helmet';
import userRouter from "./routes/user";
import todoRouter from "./routes/todo";
import "./db/mongoose";
const app = express();

const whitelist = ['http://localhost:8080', 'http://192.168.10.115', 'http://localhost:3000']
const corsOptions = {
    origin: function(origin: any, callback: any) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

app.use(helmet())
app.use(helmet.referrerPolicy({ policy: 'same-origin' }))
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")
app.use(express.json())
app.options('*', cors())
app.use(cors())
app.use(userRouter);
app.use(todoRouter)

export default app;