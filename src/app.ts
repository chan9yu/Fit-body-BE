import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import expressSession from 'express-session'
import helmet from 'helmet'
import hpp from 'hpp'
import mongoose from 'mongoose'
import morgan from 'morgan'
import passport from 'passport'
import { COOKIE_SECRET, MONGO_URI, ORIGIN } from './config'
import passportConfig from './passport'
import cartRouter from './router/cart'
import commentRouter from './router/comment'
import productRouter from './router/product'
import purchaseRouter from './router/purchase'
import userRouter from './router/user'

const app = express()
const prod: boolean = process.env.NODE_ENV === 'production'
const sessionOption = {
	resave: false,
	saveUninitialized: false,
	secret: process.env.COOKIE_SECRET!,
	cookie: {
		httpOnly: true,
		secure: false, // https -> true
		domain: prod ? ORIGIN : undefined
	}
}

app.set('port', prod ? process.env.ROPT : 3000)

if (prod) {
	app.use(hpp())
	app.use(helmet())
	app.use(morgan('combined'))
} else {
	app.use(morgan('dev'))
}

app.use(cors({ origin: ORIGIN, credentials: true }))
app.use('/', express.static('uploads'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(COOKIE_SECRET))
app.use(expressSession(sessionOption))
app.use(passport.initialize())
app.use(passport.session())

const server = async () => {
	try {
		await mongoose.connect(MONGO_URI!)
		console.log('mongoose 연결 성공!')
		passportConfig()
		app.use('/user', userRouter)
		app.use('/product', productRouter)
		app.use('/comment', commentRouter)
		app.use('/cart', cartRouter)
		app.use('/purchase', purchaseRouter)
		app.listen(app.get('port'), () =>
			console.log(`express 서버 시작 ${app.get('port')}`)
		)
	} catch (error: any) {
		console.error(error.message)
	}
}

server()
