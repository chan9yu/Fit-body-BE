import express from 'express'
import cors from 'cors'
import hpp from 'hpp'
import helmet from 'helmet'
import mongoose from 'mongoose'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import { MONGO_URI, PORT, ORIGIN } from './config'
import userRouter from './router/user'
import productRouter from './router/product'
import cartRouter from './router/cart'

const app = express()

app.use(hpp())
app.use(helmet())
app.use(morgan('dev'))
app.use(cors({ ORIGIN, credentials: true }))
app.use('/', express.static('uploads'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

const server = async () => {
	try {
		await mongoose.connect(MONGO_URI)
		console.log('mongoose 연결 성공!')
		app.use('/user', userRouter)
		app.use('/product', productRouter)
		app.use('/cart', cartRouter)
		app.listen(PORT, () => console.log(`express 서버 시작 ${PORT}`))
	} catch (error) {
		console.log(mongoURI)
		console.error(error)
	}
}

server()
