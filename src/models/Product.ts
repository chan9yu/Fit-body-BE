import { Document, model, Schema } from 'mongoose'

interface ProductTypes extends Document {
	title: string
	description: string
	price: number
	images: Array<any>
	sold: number
	categorys: string
	subCategorys: string
}

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

export default model<ProductTypes>('Product', productSchema)
