import mongoose from "mongoose";

export interface ITodo {
    _id: any
    title: string;
    description?: string;
    completed?: boolean;
    priority?: number;
    due: Date;
    author?: mongoose.Schema.Types.ObjectId;
}