const express = require('express')
const cors = require('cors')
const path = require('path')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const { mongoURI } = require('./config/key')

const app = express()
const port = 5000
// const origin = 'http://localhost:3000'

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use('/uploads', express.static('uploads'))
// routes
app.use('/api/users', require('./routes/users'))

mongoose
	.connect(mongoURI)
	.then(() => console.log('mongoose 연결 완료!'))
	.catch(err => console.error(err))

app.get('/', (req, res) => res.send('예아'))

app.listen(port, () => console.log(`express port ${port} 으로 시작!`))
