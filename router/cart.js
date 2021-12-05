import express from 'express'
import { isValidObjectId } from 'mongoose'
import { isLoggedIn } from '../middleware/auth.js'
import { User } from '../models/User.js'

const router = express.Router()

// GET /cart
// 장바구니 정보 API
router.get('/', isLoggedIn, async (req, res) => {
	try {
		const { id } = req.user
		const user = await User.findById(id)
		const { cart } = user
		return res.status(200).json(cart)
	} catch (error) {
		console.error(error.message)
		return res.status(500).json(error)
	}
})

// PATCH /cart/:productId
// 장바구니 담기 API
router.patch('/:productId', isLoggedIn, async (req, res) => {
	try {
		const { id } = req.user
		const { productId } = req.params
		if (!isValidObjectId(productId))
			return res.status(400).json({ message: '잘못된 상품 정보입니다.' })
		const user = await User.findById(id)
		// 상품 중복 검사
		let overlap = false
		user.cart.forEach(item => {
			if (item.id === productId) overlap = true
		})
		// 이미 같은 상품이 있을 때 분기처리
		if (overlap) {
			await User.findOneAndUpdate(
				{ _id: id, 'cart.id': productId },
				{ $inc: { 'cart.$.count': 1 } },
				{ new: true }
			)
			return res.status(200).send(user.cart)
		} else {
			await User.findByIdAndUpdate(
				id,
				{ $push: { cart: { id: productId, count: 1, date: Date.now() } } },
				{ new: true }
			)
			return res.status(200).send(user.cart)
		}
	} catch (error) {
		console.error(error.message)
		return res.status(500).json(error)
	}
})

// DELETE /cart/:productId
// 장바구니 삭제 API
router.delete('/:productId', isLoggedIn, async (req, res) => {
	try {
		const { id } = req.user
		const { productId } = req.params
		if (!isValidObjectId(productId))
			return res.status(400).json({ message: '잘못된 상품 정보입니다.' })
		// cart에 해당 상품 제거
		const user = await User.findByIdAndUpdate(
			id,
			{ $pull: { cart: { id: productId } } },
			{ new: true }
		)
		return res.status(200).json(user.cart)
	} catch (error) {
		console.error(error.message)
		return res.status(500).json(error)
	}
})

export default router
