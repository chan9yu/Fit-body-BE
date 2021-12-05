import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema(
	{
		content: { type: String, required: true },
		user: { type: mongoose.Types.ObjectId, ref: 'user' },
		product: { type: mongoose.Types.ObjectId, ref: 'board' }
	},
	{ timestamps: true }
)

export const Comment = mongoose.model('comment', commentSchema)
