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
    due: {
        type: Date,
        required: false,
        default: new Date()
    },
    priority: {
        type: Number,
        default: 1,
        min: [1, 'Priority must be at least 1 (lowest)'],
        max: [3, 'Priority must be at most 3 (highest)'],
        required: false
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

export const Todo: Model<ITodoModel> = model<ITodoModel>("Todo", todoSchema)