import mongoose, { Document, Schema, Model, model } from "mongoose";
import { ITodo } from "../interfaces/ITodo";

export interface ITodoModel extends ITodo, Document {}

export const todoSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: false,
        trim: false
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

export const Todo: Model<ITodoModel> = model<ITodoModel>("Todo", todoSchema)