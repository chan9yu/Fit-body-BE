const express = require('express')
const multer = require('multer')
const path = require('path')
const { Product } = require('../models/Product')

const router = express.Router()

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

router.post('/images', (req, res) => {
	upload(req, res, err => {
		if (err) res.json({ success: false, err })
		return res.json({
			fileName: res.req.file.filename
		})
	})
})

// 상품 등록 api
router.post('/', async (req, res) => {
	try {
		const product = await new Product(req.body)
		product.save(err => {
			if (err) return res.status(400).json({ success: false, err })
			return res.status(200).json({ success: true })
		})
	} catch (error) {
		console.error(error)
		return res.status(500).send({ error })
	}
})

router.post('/products', async (req, res) => {
	// 더보기 기능
	const skip = req.body.skip ? parseInt(req.body.skip) : 0
	const limit = req.body.limit ? parseInt(req.body.limit) : 20
	// 카테고리 분류 기능 구현
	const { categorys, subCategorys } = req.body
	console.log(categorys)
	console.log(subCategorys)
	try {
		const products = await Product.find(categorys ? { categorys } : undefined)
			.find(subCategorys ? { subCategorys } : undefined)
			.skip(skip)
			.limit(limit)
		return res.status(200).json({ products, postSize: products.length })
	} catch (error) {
		console.error(error)
		return res.status(500).send({ error })
	}
})

module.exports = router
