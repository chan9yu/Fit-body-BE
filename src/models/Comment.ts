import { Document, model, Schema, Types } from 'mongoose'

interface CommentTypes extends Document {
	content: string
	user: Types.ObjectId
	product: Types.ObjectId
}

const commentSchema = new Schema(
	{
		content: { type: String, required: true },
		user: { type: Types.ObjectId, ref: 'user' },
		product: { type: Types.ObjectId, ref: 'board' }
	},
	{ timestamps: true }
)

export default model<CommentTypes>('comment', commentSchema)
