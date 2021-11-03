import express from 'express'
import multer from 'multer'
import path from 'path'
import { Product } from '../models/Product'

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
		const { message } = error
		console.error(message)
		return res.status(500).json({ message })
	}
})

// 상품 데이터 보여주기
router.post('/products', async (req, res) => {
	// 더보기 기능
	const skip = req.body.skip ? parseInt(req.body.skip) : 0
	const limit = req.body.limit ? parseInt(req.body.limit) : 20
	// 카테고리 분류 기능 구현
	const { categorys, subCategorys } = req.body
	try {
		const products = await Product.find(categorys ? { categorys } : undefined)
			.find(subCategorys ? { subCategorys } : undefined)
			.skip(skip)
			.limit(limit)
		return res.status(200).json({ products, postSize: products.length })
	} catch (error) {
		const { message } = error
		console.error(message)
		return res.status(500).json({ message })
	}
})

// 상세 상품 데이터 보여주기
router.get('/:id', async (req, res) => {
	try {
		const { id } = req.params
		const { type } = req.query
		// type 분기 처리 (카트에 담길 상품들)
		if (type === 'array') {
			let ids = id.split(',')
			id = ids.map(item => {
				return item
			})
		}
		// 해당 id의 상품 찾기
		const products = await Product.find({ _id: { $in: id } })
		return res.status(200).send(products)
	} catch (error) {
		const { message } = error
		console.error(message)
		return res.status(500).json({ message })
	}
})

// 상세 페이지에서 해당 카테고리 상품 보여주기 (최대 4개만 보내주기)
router.post('/with', async (req, res) => {
	try {
		const products = await Product.aggregate([{ $sample: { size: 4 } }])
		return res.status(200).json({ products })
	} catch (error) {
		const { message } = error
		console.error(message)
		return res.status(500).json({ message })
	}
})

export default router
