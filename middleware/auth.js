const { User } = require('../models/User')

let auth = (req, res, next) => {
	// 클라이언트 쿠키에서 토큰을 가져온다
	let token = req.cookies.auth
	// 토큰을 복호화
	User.findByToken(token, (err, user) => {
		if (err) throw err
		if (!user) return res.status(400).json({ isAuth: false, error: true })
		req.token = token
		req.user = user
		next()
	})
}

module.exports = { auth }
