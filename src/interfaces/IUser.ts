import { VirtualType } from "mongoose";

export interface IUser {
	_id: any
    firstName: string
    lastName?: string
    email: string
    age?: number
    password: string
    tokens: any // Subdocument array, but doesn't seem to be supported in @types/mongoose
    tasks?: VirtualType
}