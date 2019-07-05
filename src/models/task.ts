import mongoose, { Document, Schema, Model, model } from "mongoose";
import { ITask } from "../interfaces/ITask";

export interface ITaskModel extends ITask, Document {}

export const taskSchema: Schema = new Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

export const Task: Model<ITaskModel> = model<ITaskModel>("Task", taskSchema)