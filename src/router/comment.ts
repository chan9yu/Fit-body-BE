import express from 'express'
import { isValidObjectId } from 'mongoose'
import { isLoggedIn } from '../middleware/auth'
import Comment from '../models/Comment'
import Product from '../models/Product'
import User from '../models/User'

const router = express.Router()

// GET /comment/:productId
// 댓글 정보 API
router.get('/:productId', async (req, res) => {
	try {
		const { productId } = req.params
		if (!isValidObjectId(productId))
			return res.status(400).json({ message: '존재하지 않는 상품입니다.' })
		const comments = await Comment.find({ product: productId })
		interface IDatas {
			_id: string
			content: string
			createdAt: string
			user?: string
		}
		let datas: IDatas[] = []
		async function asyncForEach(array: Array<any>) {
			for (let i = 0; i < array.length; i += 1) {
				const data: IDatas = {
					_id: array[i]._id,
					content: array[i].content,
					createdAt: array[i].createdAt
				}
				const user = await User.findById(array[i].user)
				if (!user)
					return res.status(400).json({ message: '유저 정보가 없습니다.' })
				data.user = user.name
				datas.unshift(data)
			}
		}
		await asyncForEach(comments)
		return res.status(200).json(datas)
	} catch (error: any) {
		console.error(error.message)
		return res.status(500).json(error)
	}
})

// POST /comment/:productId
// 댓글 등록 API
router.post('/:productId', isLoggedIn, async (req: any, res) => {
	try {
		const { id } = req.user!
		const { productId } = req.params
		const { content } = req.body
		if (!isValidObjectId(productId))
			return res.status(400).json({ message: '존재하지 않는 상품입니다.' })
		const user = await User.findById(id)
		const product = await Product.findById(productId)
		const comment = await Comment.create({ content, user, product })
		await comment.save()
		return res.status(200).json(comment)
	} catch (error: any) {
		console.error(error.message)
		return res.status(500).json(error)
	}
})

// DELETE /comment/:productId
// 댓글 삭제 API
router.delete('/:commentId', isLoggedIn, async (req: any, res) => {
	try {
		const { id } = req.user!
		const { commentId } = req.params
		if (!isValidObjectId(commentId))
			return res.status(400).json({ message: '존재하지 않는 상품입니다.' })
		const comment = await Comment.findById(commentId)
		if (!comment)
			return res.status(400).json({ message: '댓글 정보가 없습니다.' })
		if (comment.user.toString() !== id)
			return res
				.status(400)
				.json({ message: '다른 유저의 댓글은 삭제할 수 없습니다.' })
		await Comment.findByIdAndDelete(commentId)
		return res.status(200).json({ message: '삭제하였습니다.' })
	} catch (error: any) {
		console.error(error.message)
		return res.status(500).json(error)
	}
})

export default router
