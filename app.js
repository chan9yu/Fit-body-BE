const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const { mongoURI } = require('./config/key')
const { auth } = require('./middleware/auth')
const { User } = require('./models/User')

const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

mongoose
	.connect(mongoURI)
	.then(() => console.log('mongoose 연결 완료!'))
	.catch(err => console.error(err))

app.get('/', (req, res) => res.send('예아'))

app.post('/api/user/register', (req, res) => {
	const user = new User(req.body)
	user.save((err, userInfo) => {
		if (err) return res.status(400).json({ success: false, err })
		return res.status(200).json({ success: true })
	})
})

app.post('/api/user/login', (req, res) => {
	// DB에 이메일 있는지 확인
	User.findOne({ email: req.body.email }, (err, user) => {
		if (!user) {
			return res.status(400).json({
				loginSuccess: false,
				messsage: '해당 이메일은 존재하지 않습니다.'
			})
		}
		// 해당 이메일과 비밀번호가 일치하는지 확인
		user.comparePassword(req.body.password, (err, isMatch) => {
			if (!isMatch)
				return res.status(400).json({
					loginSuccess: false,
					message: '비밀번호가 틀렸습니다.'
				})
			// 로그인 성공 후 토큰 생성
			user.generateToken((err, user) => {
				if (err) return res.status(400).send(err)
				res
					.cookie('auth', user.token)
					.status(200)
					.json({ loginSuccess: true, userId: user._id })
			})
		})
	})
})

app.get('/api/user/auth', auth, (req, res) => {
	res.status(200).json({
		_id: req.user._id,
		isAdmin: req.user.role === 0 ? false : true,
		isAuth: true,
		email: req.user.email,
		name: req.user.name,
		lastname: req.user.lasename,
		role: req.user.role,
		image: req.user.image
	})
})

app.get('/api/user/logout', auth, (req, res) => {
	User.findOneAndUpdate({ _id: req.user._id }, { token: '' }, (err, user) => {
		if (err) return res.json({ success: false, err })
		return res.status(200).send({
			success: true
		})
	})
})

app.listen(port, () => console.log(`express port ${port} 으로 시작!`))
