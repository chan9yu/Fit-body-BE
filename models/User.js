import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
	name: { type: String, maxlength: 50, required: true },
	email: { type: String, trim: true, unique: true, required: true },
	password: { type: String, minlength: 5, required: true },
	role: { type: Number, default: 0 },
	cart: { type: Array, default: [] },
	purchase: { type: Array, default: [] }
})

export const User = mongoose.model('User', userSchema)
