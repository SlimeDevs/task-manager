import mongoose, { Types } from "mongoose";
import jwt from "jsonwebtoken";
import { IUser } from "../../src/interfaces/IUser";
import dotenv from "dotenv"
import { User } from "../../src/models/user";
import { ITask } from "../../src/interfaces/ITask";
import { Task } from "../../src/models/task";
dotenv.config()

let {
	JWT_SECRET
}: NodeJS.ProcessEnv = process.env
if (!JWT_SECRET) throw new Error('No jwt secret provided...');

const userOneID: Types.ObjectId = new mongoose.Types.ObjectId();
const userOne: IUser = {
	_id: userOneID,
	firstName: 'Mike',
	email: 'Mike@example.com',
	password: 'mikeTHE123Best',
	tokens: [{
		token: jwt.sign({ _id: userOneID }, JWT_SECRET)
	}]
}

const userTwoID: Types.ObjectId = new mongoose.Types.ObjectId();
const userTwo: IUser = {
	_id: userTwoID,
	firstName: 'Jeff',
	email: 'Jffthebest@yahoo.org',
	password: '123jeffdaduck',
	tokens: [{
		token: jwt.sign({ _id: userTwoID }, JWT_SECRET)
	}]
}

const taskOne: ITask = {
	_id: new mongoose.Types.ObjectId(),
	description: 'First task',
	completed: false,
	author: userOne._id
}

const taskTwo: ITask = {
	_id: new mongoose.Types.ObjectId(),
	description: 'Second task',
	completed: true,
	author: userOne._id
}

const taskThree: ITask = {
	_id: new mongoose.Types.ObjectId(),
	description: 'Third task',
	completed: true,
	author: userTwo._id
}

async function setupDb(): Promise<void> {
	await User.deleteMany({})
	await Task.deleteMany({})
	await new User(userOne).save()
	await new User(userTwo).save()
	await new Task(taskOne).save()
	await new Task(taskTwo).save()
	await new Task(taskThree).save()
}

async function closeDb(): Promise<void> {
	await mongoose.disconnect()
}

export {
	userOneID,
	userTwoID,
	userOne,
	userTwo,
	taskOne,
	taskTwo,
	taskThree,
	setupDb,
	closeDb,
}