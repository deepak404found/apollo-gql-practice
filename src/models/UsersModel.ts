import mongoose, {Schema} from "mongoose";
import {v4} from "uuid";
import argon2 from 'argon2'

export interface UserDoc extends mongoose.Document {
    uid: string
    fullName: string
    username: string
    password: string
    createdAt: Date
    refreshToken: string
}

interface Methods {
    comparePassword: (password: string) => Promise<boolean>
}

const UserSchema = new Schema<UserDoc, unknown, Methods>({
    uid: {type: String, required: true, unique: true, default: v4},
    fullName: {type: String},
    username: {type: String, unique: true},
    password: {type: String},
    createdAt: {type: Date, default: Date.now},
    refreshToken: {type: String}
})

UserSchema.pre<UserDoc>('save', async function (next) {
    if (!this.isModified('password')) next()
    this.password = await argon2.hash(this.password)
    next()
})

UserSchema.methods.comparePassword = async function (password) {
    if (!this.password) return false
    return await argon2.verify(this.password, password)
}

export default mongoose.model('User', UserSchema)