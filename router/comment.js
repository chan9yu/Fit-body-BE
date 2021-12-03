import express from 'express'
import { isValidObjectId } from 'mongoose'
import { isLoggedIn } from '../middleware/auth'
import { Comment } from '../models/Comment'
import { Product } from '../models/Product'
import { User } from '../models/User'

const router = express.Router()

// GET /comment/:productId
// 댓글 정보 API
router.get('/:productId', async (req, res) => {
	try {
		const { productId } = req.params
		if (!isValidObjectId(productId))
			return res.status(400).json({ message: '존재하지 않는 상품입니다.' })
		const comment = await Comment.find({ product: productId })
		return res.status(200).json(comment)
	} catch (error) {
		console.error(error.message)
		return res.status(500).json(error)
	}
})

// POST /comment/:productId
// 댓글 등록 API
router.post('/:productId', isLoggedIn, async (req, res) => {
	try {
		const { id } = req.user
		const { productId } = req.params
		const { content } = req.body
		if (!isValidObjectId(productId))
			return res.status(400).json({ message: '존재하지 않는 상품입니다.' })
		const user = await User.findById(id)
		const product = await Product.findById(productId)
		const comment = await Comment.create({ content, user, product })
		await comment.save()
		return res.status(200).json(comment)
	} catch (error) {
		console.error(error.message)
		return res.status(500).json(error)
	}
})

// DELETE /comment/:productId
// 댓글 삭제 API
router.delete('/:commentId', isLoggedIn, async (req, res) => {
	try {
		const { id } = req.user
		const { commentId } = req.params
		if (!isValidObjectId(commentId))
			return res.status(400).json({ message: '존재하지 않는 상품입니다.' })
		const comment = await Comment.findById(commentId)
		if (comment.user !== id)
			return res
				.status(400)
				.json({ message: '다른 유저의 댓글은 삭제할 수 없습니다.' })
		await Comment.findByIdAndDelete(productId)
		return res.status(200).json({ message: '삭제하였습니다.' })
	} catch (error) {
		console.error(error.message)
		return res.status(500).json(error)
	}
})

export default router
