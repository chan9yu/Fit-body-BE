import express from 'express'
import { User } from '../models/User'
import { auth } from '../middleware/auth'
import { Product } from '../models/Product'

const router = express.Router()

// 카트 아이템 추가 api
router.post('/add', auth, async (req, res) => {
	const { id } = req.body
	try {
		// 해당 유저 정보
		const userInfo = await User.findOne({ _id: req.user._id })
		// 해당 상품이 카트에 이미 있는지 검사
		let overlap = false
		userInfo.cart.forEach(item => {
			if (item.id === id) overlap = true
		})
		// 카트에 이미 상품이 있을 때 갯수를 1 증가
		if (overlap) {
			await User.findOneAndUpdate(
				{ _id: req.user._id, 'cart.id': id },
				{ $inc: { 'cart.$.quantity': 1 } },
				{ new: true }
			)
			return res.status(200).send(userInfo.cart)
		} else {
			await User.findOneAndUpdate(
				{ _id: req.user._id },
				{
					$push: {
						cart: { id, quantity: 1, date: Date.now() }
					}
				},
				{ new: true }
			)
			return res.status(200).send(userInfo.cart)
		}
	} catch (error) {
		const { message } = error
		console.error(message)
		return res.status(500).json({ message })
	}
})

// 카트 아이템 삭제 api
router.get('/remove', auth, async (req, res) => {
	try {
		const { _id } = req.user
		// cart에 해당 상품 제거
		const userInfo = await User.findByIdAndUpdate(
			{ _id },
			{ $pull: { cart: { id: req.query.id } } },
			{ new: true }
		)
		// 제거하고 남아있는 상품들의 정보 가져오기
		const { cart } = userInfo
		const array = cart.map(item => item.id)
		const productInfo = await Product.find({ _id: { $in: array } })
		return res.status(200).json({ productInfo, cart })
	} catch (error) {
		const { message } = error
		console.log(message)
		return res.status(500).json({ message })
	}
})

export default router
