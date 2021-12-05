import { Document, model, Schema, Types } from 'mongoose'

interface CommentTypes {
	content: string
	user: any
	product: any
}

export interface CommentTypesModel extends CommentTypes, Document {}

const commentSchema = new Schema(
	{
		content: { type: String, required: true },
		user: { type: Types.ObjectId, ref: 'user' },
		product: { type: Types.ObjectId, ref: 'board' }
	},
	{ timestamps: true }
)

export default model<CommentTypesModel>('comment', commentSchema)
