import dotenv from "dotenv";
import app from "./app";
dotenv.config()

let {
    PORT
}: NodeJS.ProcessEnv = process.env;

app.listen(PORT, function() {
    console.log(`Task app listening on port ${PORT}`)
});