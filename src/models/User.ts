import { Document, model, Schema } from 'mongoose'

export interface UserTypes extends Document {
	id?: string
	name: string
	email: string
	password: string
	role: number
	cart: Array<any>
	purchase: Array<any>
}


const userSchema = new Schema({
	name: { type: String, maxlength: 50, required: true },
	email: { type: String, trim: true, unique: true, required: true },
	password: { type: String, minlength: 5, required: true },
	role: { type: Number, default: 0 },
	cart: { type: Array, default: [] },
	purchase: { type: Array, default: [] }
})

export default model<UserTypes>('user', userSchema)
