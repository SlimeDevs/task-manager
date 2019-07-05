import mongoose from "mongoose";

export interface ITask {
	_id: any
    description: string,
    completed?: boolean,
    author?: mongoose.Schema.Types.ObjectId
}