import { Schema, model, ObjectId } from 'mongoose'

const userSchema = new Schema({
	name: { type: String, maxlength: 50, required: true },
	email: { type: String, trim: true, unique: true, required: true },
	password: { type: String, minlength: 5, required: true },
	role: { type: Number, default: 0 },
	cart: { type: Array, default: [] }
})

export const User = model('User', userSchema)
