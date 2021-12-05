import passport from 'passport'
import User from '../models/User'
import local from './local'

export default () => {
	passport.serializeUser((user: any, done) => {
		done(null, user._id)
	})
	passport.deserializeUser(async (id, done) => {
		try {
			done(null, await User.findById(id))
		} catch (error) {
			console.error(error)
			done(error)
		}
	})

	local()
}
