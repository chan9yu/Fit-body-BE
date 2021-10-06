const { Schema, model } = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const saltRounds = 10

const userSchema = new Schema({
	name: { type: String, maxlength: 50 },
	email: { type: String, trim: true, unique: 1 },
	password: { type: String, minlength: 5 },
	lastname: { type: String, maxlength: 50 },
	role: { type: Number, default: 0 },
	image: { type: String },
	token: { type: String },
	tokenExp: { type: Number }
})

// user 모델을 저장하기 전에 password 암호화 설정
userSchema.pre('save', function (next) {
	const user = this
	// 유저정보중 password만 변환될때만
	if (user.isModified('password')) {
		// salt를 이용해서 암호화 진행
		bcrypt.genSalt(saltRounds, function (err, salt) {
			if (err) return next(err) // 에러 처리
			// hash(암호화할 비밀번호, salt) 만들기
			bcrypt.hash(user.password, salt, function (err, hash) {
				if (err) return next(err) // 에러 처리
				user.password = hash // password를 암호화된 hash로 교채
				next()
			})
		})
	} else {
		next()
	}
})

// 로그인 요청시, 비밀번호를 검사하는 메소드
userSchema.methods.comparePassword = function (plainPassword, cb) {
	// 입력받은 비밀번호를 암호화해서 데이터베이스에 암호화된 비밀번호와 같은지 비교
	bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
		if (err) return cb(err)
		cb(null, isMatch)
	})
}

// token 발급하는 메소드
userSchema.methods.generateToken = function (cb) {
	const user = this
	// jsonwebtoken을 이용해서 token을 생성
	const token = jwt.sign(user._id.toHexString(), 'secretToken')
	user.token = token
	user.save(function (err, user) {
		if (err) return cb(err)
		cb(null, user)
	})
}

// 해당유저의 token으로 인증하는 메소드
userSchema.statics.findByToken = function (token, cb) {
	const user = this
	// token decode
	jwt.verify(token, 'secretToken', function (err, decoded) {
		// 유저 아이디를 이용해서 유저를 찾은 다음에
		// 클라이언트에서 가져온 token과 db에 보관된 token이 일치하는지 확인
		user.findOne({ _id: decoded, token }, function (err, user) {
			if (err) return cb(err)
			cb(null, user)
		})
	})
}

const User = model('User', userSchema)

module.exports = { User }
