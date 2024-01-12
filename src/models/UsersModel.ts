import mongoose from "mongoose";
import {v4} from "uuid";

export type User = {
    uid: string
    fullName: string
    username: string
    password: string
    createdAt: Date
}

const UserSchema = new mongoose.Schema<User>({
    uid: {type: String, required: true, unique: true, default: v4},
    fullName: {type: String},
    username: {type: String, unique: true},
    password: {type: String},
    createdAt: {type: Date, default: Date.now}
})

export default mongoose.model('User', UserSchema)