import express from "express";
import path from "path";
import cors from "cors";
import helmet from 'helmet';
import userRouter from "./routes/user";
import todoRouter from "./routes/todo";
import "./db/mongoose";
const app = express();

let {
    WhitelistURI
}: NodeJS.ProcessEnv = process.env

const whitelist: (string | undefined)[] = [WhitelistURI]
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
app.use(cors(corsOptions))
app.options('*', cors(corsOptions))
app.use(userRouter);
app.use(todoRouter)

export default app;