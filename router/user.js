import express from 'express'
import { User } from '../models/User'
import { auth } from '../middleware/auth'

const router = express.Router()

// 회원가입 api
router.post('/signup', async (req, res) => {
	try {
		const { email } = req.body
		// 입력된 정보를 가져옴
		const user = await new User(req.body)
		if (req.body.password.length < 5)
			return res.status(400).json({
				success: false,
				message: '비밀번호는 5자리 이상이여야 합니다.'
			})
		// 아이디 중복 검사
		const oldUser = await User.findOne({ email })
		if (oldUser)
			return res
				.status(400)
				.json({ success: false, message: '이미 가입된 이메일 입니다.' })
		// db에 저장
		user.save((err, userInfo) => {
			if (err) return res.status(400).json({ success: false, err })
			return res.status(200).json({
				success: true
			})
		})
	} catch (error) {
		console.error(error)
		return res.status(500).send({ error })
	}
})

// 로그인 api
router.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body
		// DB에 이메일 있는지 확인
		const user = await User.findOne({ email })
		if (!user)
			return res.status(400).json({
				loginSuccess: false,
				message: '해당 이메일은 존재하지 않습니다.'
			})
		// 해당 이메일과 비밀번호가 일치하는지 확인
		user.comparePassword(password, (err, isMatch) => {
			if (!isMatch)
				return res.status(400).json({
					loginSuccess: false,
					message: '비밀번호가 틀렸습니다.'
				})
			// 로그인 성공 후 토큰 생성
			user.generateToken((err, user) => {
				const { token } = user
				if (err) return res.status(400).send(err)
				// 토큰을 쿠키에 저장
				return res.cookie('auth', token).status(200).send(token)
			})
		})
	} catch (error) {
		console.error(error)
		return res.status(500).send({ error })
	}
})

// 로그아웃 api
router.get('/logout', auth, async (req, res) => {
	try {
		const { _id } = req.user
		// 해당 아이디의 토큰값 지우기
		await User.findOneAndUpdate({ _id }, { token: '' })
		return res.status(200).send({ success: true })
	} catch (error) {
		console.error(error)
		return res.status(500).send({ error })
	}
})

// 회원정보 api
router.get('/', auth, (req, res) => {
	const { _id, role, email, name, cart, history } = req.user
	const isAdmin = role === 1 ? true : false
	res.status(200).json({
		_id,
		role,
		email,
		name,
		cart,
		history,
		isAdmin,
		isAuth: true
	})
})

export default router
