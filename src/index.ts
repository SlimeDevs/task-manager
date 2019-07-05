import dotenv from "dotenv";
import app from "./app";
if (process.env.NODE_ENV !== 'production') {
	dotenv.config()
}

const env: string | undefined = process.env.NODE_ENV;
if (!env) {
	throw new Error('Environment variables not found')
}
const envString: string = env.toUpperCase();

const port = process.env['PORT_' + envString] || 3000;

app.listen(port, function() {
    console.log(`Task app listening on port ${port}`)
});