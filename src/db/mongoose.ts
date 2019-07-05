import mongoose from "mongoose";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== 'production') {
	dotenv.config()
}

const env: string | undefined = process.env.NODE_ENV;
if (!env) {
	throw new Error('Environment variables not found')
}
const envString: string = env.toUpperCase();

const connectURL: string | undefined = process.env['MONGODB_URI_' + envString]

if (!connectURL) {
	throw new Error('Environment variables not found')
}

mongoose.connect(connectURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});