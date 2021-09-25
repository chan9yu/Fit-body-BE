const { Schema, model } = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const saltRounds = 10
const moment = require("moment");

const userSchema = Schema({
	name: { type: String, maxlength: 50 },
	email: { type: String, trim: true, unique: 1 },
	password: { type: String, minlength: 4 },
	lastname: { type: String, maxlength: 50 },
	role: { type: Number, default: 0 }, // 관리자 여부
	image: { type: String },
	token: { type: String },
	tokenExp: { type: Number }
})

// user 모델을 저장하기 전에 password 암호화
userSchema.pre('save', function (next) {
	const user = this
	// 유저정보중 비밀번호만 변경될 때 암호화 실행
	if (user.isModified('password')) {
		bcrypt.genSalt(saltRounds, function (err, salt) {
			if (err) return next(err)
			bcrypt.hash(user.password, salt, function (err, hash) {
				if (err) return next(err)
				user.password = hash
				next()
			})
		})
	} else {
		next()
	}
})

// 유저 로그인 메소드
userSchema.methods.comparePassword = function (plainPassword, cb) {
	const user = this
	// 입력된 비밀번호와 암호화된 비밀번호를 비교
	bcrypt.compare(plainPassword, user.password, function (err, isMatch) {
		if (err) return cb(err)
		cb(null, isMatch)
	})
}

// 로그인 성공시 토큰 생성하는 메소드
userSchema.methods.generateToken = function (cb) {
	const user = this
	const token = jwt.sign(user._id.toHexString(), 'secretToken')
	const twoHour = moment().add(2, 'hour').valueOf();
	user.token = token
	user.tokenExp = twoHour
	user.save(function (err, user) {
		if (err) return cb(err)
		cb(null, user)
	})
}

userSchema.statics.findByToken = function (token, cb) {
	const user = this
	// token decode
	jwt.verify(token, 'secretToken', function (err, decode) {
		user.findOne({ "_id": decode, "token": token }, (err, user) => {
			if (err) return cb(err)
			cb(null, user)
		})
	})
}

const User = model('User', userSchema)

module.exports = { User }
