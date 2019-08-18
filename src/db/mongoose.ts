import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()

let {
    connectURL = process.env.MONGODB_URI
}: NodeJS.ProcessEnv = process.env

if (!connectURL) {
    connectURL = "mongodb://127.0.0.1:27017/todos"
}

mongoose.connect(connectURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});