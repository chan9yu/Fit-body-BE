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
		if (err) {
			return req.json({ success: false, err })
		}
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

module.exports = router
