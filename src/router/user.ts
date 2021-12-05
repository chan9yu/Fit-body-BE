import bcrypt from 'bcrypt'
import express from 'express'
import passport from 'passport'
import { isLoggedIn, isNotLoggedIn } from '../middleware/auth'
import User from '../models/User'

const router = express.Router()

// GET /user
// 유저정보 API
router.get('/', async (req, res) => {
	try {
		if (req.user) {
			const { id } = req.user!
			const user = await User.findById(id)
			return res.status(200).json(user)
		} else {
			return res.status(200).json(null)
		}
	} catch (error: any) {
		console.error(error.message)
		return res.status(500).json(error)
	}
})

// POST /user/signup
// 회원가입 API
router.post('/signup', isNotLoggedIn, async (req, res) => {
	try {
		const { name, email, password } = req.body
		if (!name || !email || !password)
			return res.status(400).json({ message: '빈 값이 있으면 안됩니다.' })
		const exUser = await User.findOne({ email })
		if (exUser)
			return res.status(400).json({ message: '이미 사용중인 이메일 입니다.' })
		if (password.length < 5)
			return res
				.status(400)
				.json({ message: '비밀번호는 5자리 이상이여야 합니다.' })
		const hashedPassword = await bcrypt.hash(password, 12)
		const newUser = await User.create({ email, name, password: hashedPassword })
		await newUser.save()
		return res.status(200).json({ message: '회원가입에 성공했습니다.' })
	} catch (error: any) {
		console.error(error.message)
		return res.status(500).json(error)
	}
})

// POST /user/login
// 로그인 API
router.post('/login', isNotLoggedIn, (req, res) => {
	passport.authenticate('local', (err, user, info) => {
		if (err) return res.status(500).json(err) // server error
		if (info) return res.status(400).json(info) // client error
		return req.login(user, loginErr => {
			if (loginErr) return res.status(500).json(loginErr) // passport error
			return res.status(200).json(user) // login success
		})
	})(req, res)
})

// POST /user/logout
// 로그아웃 API
router.get('/logout', isLoggedIn, (req, res) => {
	req.logout()
	req.session!.destroy(() => {
		return res.status(200).json({ message: '로그아웃 되었습니다.' })
	})
})

export default router
