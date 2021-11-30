import express from 'express'
import cors from 'cors'
import hpp from 'hpp'
import helmet from 'helmet'
import mongoose from 'mongoose'
import passport from 'passport'
import morgan from 'morgan'
import session from 'express-session'
import cookieParser from 'cookie-parser'

import { MONGO_URI, COOKIE_SECRET } from './config'
import passportConfig from './passport'
import userRouter from './router/user'
import productRouter from './router/product'
// import cartRouter from './router/cart'

const app = express()
const port = 3000
const origin = 'http://localhost:8080'
const sessionOption = {
	saveUninitialized: false,
	resave: false,
	secret: COOKIE_SECRET
}

app.use(hpp())
app.use(helmet())
app.use(morgan('dev'))
app.use(cors({ origin, credentials: true }))
app.use('/', express.static('uploads'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(COOKIE_SECRET))
app.use(session(sessionOption))
app.use(passport.initialize())
app.use(passport.session())

const server = async () => {
	try {
		await mongoose.connect(MONGO_URI)
		console.log('mongoose 연결 성공!')
		passportConfig()
		app.use('/user', userRouter)
		app.use('/product', productRouter)
		// app.use('/cart', cartRouter)
		app.listen(port, () => console.log(`express 서버 시작 ${port}`))
	} catch (error) {
		console.error(error.message)
	}
}

server()
