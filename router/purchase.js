import express from 'express'
import { isValidObjectId } from 'mongoose'
import { isLoggedIn } from '../middleware/auth'
import { User } from '../models/User'

const router = express.Router()

// GET /purchase
// 구매 목록 정보 API
router.get('/', isLoggedIn, async (req, res) => {
	try {
		const { id } = req.user
		const user = await User.findById(id)
		return res.status(200).json(user.purchase)
	} catch (error) {
		console.error(error.message)
		return res.status(500).json(error)
	}
})

// POST /purchase/:productId
// 개별 상품 구매 API
router.post('/:productId', isLoggedIn, async (req, res) => {
	try {
		const { id } = req.user
		const { productId } = req.params
		if (!isValidObjectId(productId))
			return res.status(400).json({ message: '잘못된 상품 정보입니다.' })
		const user = await User.findById(id)
		await User.findByIdAndUpdate(
			id,
			{ $push: { purchase: { item: productId } } },
			{ new: true }
		)
		return res.status(200).json(user.purchase)
	} catch (error) {
		console.error(error.message)
		return res.status(500).json(error)
	}
})

// PATCH /purchase
// 장바구니 상품 구매 API
router.patch('/', isLoggedIn, async (req, res) => {
	try {
		const { id } = req.user
		const user = await User.findById(id)
		const cartItems = user.cart.map(v => v.id)
		if (user.cart.length === 0)
			return res.status(400).json({ message: '장바구니가 비어있습니다.' })
		// 구매목록 저장
		await User.findByIdAndUpdate(
			id,
			{ $push: { purchase: { item: cartItems } } },
			{ new: true }
		)
		// 장바구니 비우기
		await User.findByIdAndUpdate(id, { $set: { cart: [] } }, { new: true })
		return res.status(200).json(user.purchase)
	} catch (error) {
		console.error(error.message)
		return res.status(500).json(error)
	}
})

export default router
