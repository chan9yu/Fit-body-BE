import express from 'express'
import cors from 'cors'
import hpp from 'hpp'
import helmet from 'helmet'
import mongoose from 'mongoose'
import passport from 'passport'
import session from 'express-session'
import cookieParser from 'cookie-parser'

import { MONGO_URI, COOKIE_SECRET, ORIGIN } from './config/index.js'
import passportConfig from './passport/index.js'
import userRouter from './router/user.js'
import productRouter from './router/product.js'
import commentRouter from './router/comment.js'
import cartRouter from './router/cart.js'
import purchaseRouter from './router/purchase.js'

const app = express()
const sessionOption = {
	saveUninitialized: false,
	resave: false,
	secret: COOKIE_SECRET
}

app.use(hpp())
app.use(helmet())
app.use(cors({ origin: ORIGIN, credentials: true }))
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
		passportConfig()
		app.use('/user', userRouter)
		app.use('/product', productRouter)
		app.use('/comment', commentRouter)
		app.use('/cart', cartRouter)
		app.use('/purchase', purchaseRouter)
		app.listen(process.env.PORT || 3000, () =>
			console.log(`express 서버 시작 ${process.env.PORT || 3000}`)
		)
	} catch (error) {
		console.error(error.message)
	}
}

server()
