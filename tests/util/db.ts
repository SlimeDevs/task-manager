import mongoose, { Types } from "mongoose";
import jwt from "jsonwebtoken";
import { IUser } from "../../src/interfaces/IUser";
import dotenv from "dotenv"
import { User } from "../../src/models/user";
import { ITodo } from "../../src/interfaces/ITodo";
import { Todo } from "../../src/models/todo";
dotenv.config()

let {
	JWT_SECRET
}: NodeJS.ProcessEnv = process.env
if (!JWT_SECRET) throw new Error('No jwt secret provided...');

const userOneID: Types.ObjectId = new mongoose.Types.ObjectId();
const userOne: IUser = {
	_id: userOneID,
	username: 'Mike',
	email: 'Mike@example.com',
	password: 'mikeTHE123Best',
	tokens: [{
		token: jwt.sign({ _id: userOneID }, JWT_SECRET)
	}]
}

const userTwoID: Types.ObjectId = new mongoose.Types.ObjectId();
const userTwo: IUser = {
	_id: userTwoID,
	username: 'Jeff',
	email: 'Jffthebest@yahoo.org',
	password: '123jeffdaduck',
	tokens: [{
		token: jwt.sign({ _id: userTwoID }, JWT_SECRET)
	}]
}

const todoOne: ITodo = {
	_id: new mongoose.Types.ObjectId(),
	title: 'First todo',
	completed: false,
	author: userOne._id
}

const todoTwo: ITodo = {
	_id: new mongoose.Types.ObjectId(),
	title: 'Second todo',
	completed: true,
	author: userOne._id
}

const todoThree: ITodo = {
	_id: new mongoose.Types.ObjectId(),
	title: 'Third todo',
	completed: true,
	author: userTwo._id
}

async function setupDb(): Promise<void> {
	await User.deleteMany({})
	await Todo.deleteMany({})
	await new User(userOne).save()
	await new User(userTwo).save()
	await new Todo(todoOne).save()
	await new Todo(todoTwo).save()
	await new Todo(todoThree).save()
}

async function closeDb(): Promise<void> {
	await mongoose.disconnect()
}

export {
	userOneID,
	userTwoID,
	userOne,
	userTwo,
	todoOne,
	todoTwo,
	todoThree,
	setupDb,
	closeDb,
}