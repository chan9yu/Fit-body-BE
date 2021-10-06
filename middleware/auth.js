const { User } = require('../models/User')

let auth = (req, res, next) => {
	// 클라이언트 cookie에서 token을 가져옴
	let token = req.cookies.auth
	// token을 복호화
	User.findByToken(token, (err, user) => {
		if (err) throw err
		if (!user)
			return res
				.status(400)
				.json({ isAuth: false, message: '유저가 없습니다.' })
		req.token = token
		req.user = user
		next()
	})
}

module.exports = { auth }
