import mongoose, { Document, Schema } from "mongoose";
import { v4 } from "uuid";

export interface UserDoc extends mongoose.Document {
    uid: string
    fullName: string
    username: string
    password: string
    createdAt: Date
    refreshToken: string
}

const UserSchema = new Schema<UserDoc>({
    uid: { type: String, required: true, unique: true, default: v4 },
    fullName: { type: String },
    username: { type: String, unique: true },
    password: { type: String },
    createdAt: { type: Date, default: Date.now },
    refreshToken: { type: String }
})

export default mongoose.model<UserDoc>("User", UserSchema);