import { Document, model, Schema } from 'mongoose'

interface UserTypes {
	name: string
	email: string
	password: string
	role: number
	cart: {
		id: string
		count: number
		date: number
	}[]
	purchase: {
		title: string
		description: string
		price: number
		images: any
	}[]
}

export interface UserTypesModel extends UserTypes, Document {}

const userSchema = new Schema({
	name: { type: String, maxlength: 50, required: true },
	email: { type: String, trim: true, unique: true, required: true },
	password: { type: String, minlength: 5, required: true },
	role: { type: Number, default: 0 },
	cart: { type: Array, default: [] },
	purchase: { type: Array, default: [] }
})

export default model<UserTypesModel>('user', userSchema)
