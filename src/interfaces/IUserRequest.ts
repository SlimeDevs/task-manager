import { Request } from "express";
import { IUserModel } from "../models/user";

export interface IUserRequest extends Request {
    password?: string
    token?: string,
    user?: IUserModel
}