import { Document, Schema, Model, model } from "mongoose";
import { IUser } from "../interfaces/IUser";
import { Todo } from "./todo"
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"
import dotenv from "dotenv";
import { NextFunction } from "express";
import { MongoError } from "mongodb";
if (process.env.NODE_ENV !== 'production') dotenv.config()

let {
    JWT_SECRET
}: NodeJS.ProcessEnv = process.env;

export interface IUserModel extends IUser, Document {
    fullName(): string,
    toJSON(): object,
    generateAuthToken(): Promise<string>
}

function validatePassword(value: string) {
    return !value.toLowerCase().includes('password' || 123)
}

export const userSchema: Schema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    email: {
        type: String,
        required: false,
        trim: true,
        lowercase: false,
        unique: true,
        validate: {
            validator(value: string): boolean {
                return validator.isEmail(value)
            },
            // @ts-ignore
            message: 'Email is not valid'
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: [7, 'Password must be at least 7 characters long'],
        validate: {
            validator(value: string) {
                return !value.toLowerCase().includes('password' || 123)
            },
            // @ts-ignore
            message: 'Password is too insecure'
        }
    },
    tokens: [{
        token: {
            type: String,
            required: false,
            unique: true
        }
    }]
});

userSchema.virtual('todos', {
    ref: 'Todo',
    localField: '_id',
    foreignField: 'author'
});

userSchema.methods.toJSON = function(): object {
    const user: any = this;
    const userObject: IUserModel = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject
};

userSchema.methods.generateAuthToken = async function(): Promise<string> {
    if (!JWT_SECRET) throw new Error("JWT Secret not found.")
    
    const user: any = this;
    const token: string = jwt.sign({ _id: user._id.toString() }, JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token;
}

userSchema.pre('save', async function(next: NextFunction): Promise<void> {
    const user: any = this;

    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
});

userSchema.pre('remove', async function(next: NextFunction): Promise<void> {
    const user: any = this;
    await Todo.deleteMany({ author: user._id })
    next()
});

userSchema.post('save', function(error: MongoError, doc: IUserModel, next: NextFunction) {
    if (error.name === 'MongoError' && error.code === 11000) {
        let duplicateError = new Error('The username and/or email already exist. Please use a different one.');
        duplicateError.name = "ValidationError"
        next(duplicateError);
    } else {
        next();
    }
})

userSchema.methods.fullName = function(): string {
    return (this.firstName.trim() + " " + this.lastName.trim());
};

export const User: Model<IUserModel> = model<IUserModel>("User", userSchema);

