const express = require('express')
const mongoose = require('mongoose')
const { mongoURI } = require('./config/key')

const { User } = require('./models/User')

const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

mongoose
	.connect(mongoURI)
	.then(() => console.log('몽구스 연결 완료!'))
	.catch(err => console.error(err))

app.get('/', (req, res) => res.send('예아'))

app.post('/register', (req, res) => {
	const user = new User(req.body)
	user.save((err, userInfo) => {
		if (err) return res.json({ success: false, err })
		return res.status(200).json({ success: true })
	})
})

app.listen(port, () => console.log(`express port ${port} 으로 시작!`))
