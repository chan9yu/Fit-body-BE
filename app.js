const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const { mongoURI } = require('./config/key')
const userRouter = require('./router/user')
const morgan = require('morgan')

const app = express()
const port = 3000
const origin = 'http://localhost:8080'

app.use(morgan('dev'))
app.use(cors({ origin, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

const server = async () => {
	try {
		await mongoose.connect(mongoURI)
		console.log('mongoose 연결 성공!')
		app.use('/user', userRouter)
		app.listen(port, () => console.log(`express 서버 시작 ${port}`))
	} catch (error) {
		console.error(error)
	}
}

server()
