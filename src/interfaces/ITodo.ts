import mongoose from "mongoose";

export interface ITodo {
    _id: any
    title: string,
    description?: string,
    completed?: boolean,
    author?: mongoose.Schema.Types.ObjectId
}