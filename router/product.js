import express from 'express'
import { isValidObjectId } from 'mongoose'
import multer from 'multer'
import path from 'path'

import { isLoggedIn } from '../middleware/auth'
import { Product } from '../models/Product'
import { User } from '../models/User'

const router = express.Router()

// multer setting
const upload = multer({
	storage: multer.diskStorage({
		destination(req, file, done) {
			done(null, 'uploads')
		},
		filename(req, file, done) {
			const ext = path.extname(file.originalname)
			const basename = path.basename(file.originalname, ext)
			done(null, basename + Date.now() + ext)
		}
	}),
	limit: { fileSize: 20 * 1024 * 1024 }
}).single('file')

// POST /product/images
// 이미지 업로드 API
router.post('/images', (req, res) => {
	upload(req, res, err => {
		if (err) res.json({ success: false, err })
		return res.json({
			fileName: res.req.file.filename
		})
	})
})

// POST /product
// 상품 등록 API
router.post('/', isLoggedIn, async (req, res) => {
	const { id } = req.user
	const user = await User.findById(id)
	if (user.role === 0)
		return res.status(400).json({ message: '권한이 없습니다.' })
	try {
		const { images, title, description, price, categorys, subCategorys } =
			req.body
		if (
			!images ||
			!title ||
			!description ||
			!price ||
			!categorys ||
			!subCategorys
		) {
			return res.status(400).json({ message: '빈 값이 있으면 안됩니다.' })
		}
		const product = await Product.create(req.body)
		await product.save()
		return res.status(200).json({ message: '상품을 등록했습니다.' })
	} catch (error) {
		console.error(error.message)
		return res.status(500).json(error)
	}
})

// POST /product/products
// 상품 정보 API
router.post('/products', async (req, res) => {
	const skip = req.body.skip ? parseInt(req.body.skip) : 0
	const limit = req.body.limit ? parseInt(req.body.limit) : 20
	const { categorys, subCategorys } = req.body
	try {
		const products = await Product.find(categorys ? { categorys } : undefined)
			.find(subCategorys ? { subCategorys } : undefined)
			.skip(skip)
			.limit(limit)
		return res.status(200).json({ products, postSize: products.length })
	} catch (error) {
		console.error(error.message)
		return res.status(500).json(error)
	}
})

// GET /product/with
// 랜덤 4개 상품 정보 API
router.get('/with', async (req, res) => {
	try {
		const products = await Product.aggregate([{ $sample: { size: 4 } }])
		return res.status(200).json({ products })
	} catch (error) {
		console.error(error.message)
		return res.status(500).json(error)
	}
})

// GET /product/:productId
// 상세 상품 정보 API
router.get('/:productId', async (req, res) => {
	try {
		let { productId } = req.params
		const { type } = req.query
		if (type === 'array') {
			const ids = productId.split(',')
			productId = ids.map(item => item)
		}
		// 해당 id의 상품 찾기
		const products = await Product.find(
			{ _id: { $in: productId } },
			{
				categorys: 1,
				description: 1,
				images: 1,
				price: 1,
				title: 1,
				subCategorys: 1
			}
		).sort({ _id: -1 })
		return res.status(200).send(products)
	} catch (error) {
		console.error(error.message)
		return res.status(500).json(error)
	}
})

export default router
