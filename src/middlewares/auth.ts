import { Response, NextFunction } from "express";
import { IUserRequest } from "../interfaces/IUserRequest";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/user";
if (process.env.NODE_ENV !== 'production') {
	dotenv.config()
}

const env: string | undefined = process.env.NODE_ENV;
if (!env) {
	throw new Error('Environment variables not found')
}

const envString: string = env.toUpperCase();
const jwtSecret: string | undefined = process.env["JWT_SECRET_" + envString]
if (!jwtSecret) {
	throw new Error('Environment variables not found')
}

interface objID {
	[_id: string]: string
}

export const auth = async function(req: IUserRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        if (!jwtSecret) throw new Error('No secret provided')
        const reqHeader: string | undefined = req.header('Authorization');
        if (!reqHeader) throw new Error('User is not logged in');

        const token: string = await reqHeader.replace('Bearer ', '');
        const decoded: objID = await jwt.verify(token, jwtSecret) as objID

        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token})
        if (!user) throw new Error('No user found') 

        req.token = token;
        req.user = user;
        next()
    } catch(error) {
        res.status(401).send({ error: 'Please authenticate.' })
    }
}