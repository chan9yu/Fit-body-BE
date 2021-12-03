import { Schema, model, Types } from 'mongoose'

const commentSchema = new Schema(
	{
		content: { type: String, required: true },
		user: { type: Types.ObjectId, ref: 'user' },
		product: { type: Types.ObjectId, ref: 'board' }
	},
	{ timestamps: true }
)

export const Comment = model('comment', commentSchema)
