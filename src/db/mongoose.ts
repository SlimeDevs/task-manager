import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()

let {
    MONGODB_URI
}: NodeJS.ProcessEnv = process.env

if (!MONGODB_URI) {
    MONGODB_URI = "mongodb://127.0.0.1:27017/todos"
}

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});