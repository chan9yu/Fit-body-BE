const { Schema, model } = require('mongoose')

const productSchema = new Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		price: { type: Number, required: true },
		images: { type: Array, required: true },
		sold: { type: Number, default: 0 },
		categorys: { type: String, required: true },
		subCategorys: { type: String, required: true }
	},
	{ timestamps: true }
)

const Product = model('Product', productSchema)
module.exports = { Product }