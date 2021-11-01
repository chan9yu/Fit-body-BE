import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import mongoURI from './config/key'
import userRouter from './router/user'
import productRouter from './router/product'

const app = express()
const port = 3000
const origin = 'http://localhost:8080'

app.use(morgan('dev'))
app.use(cors({ origin, credentials: true }))
app.use('/', express.static('uploads'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

const server = async () => {
	try {
		await mongoose.connect(mongoURI)
		console.log('mongoose 연결 성공!')
		app.use('/user', userRouter)
		app.use('/product', productRouter)
		app.listen(port, () => console.log(`express 서버 시작 ${port}`))
	} catch (error) {
		console.error(error)
	}
}

server()
