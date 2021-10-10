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
			success: true,
			filePath: res.req.file.path,
			fileName: res.req.file.filename
		})
	})
})

module.exports = router
