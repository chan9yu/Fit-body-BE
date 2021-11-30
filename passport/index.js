import passport from 'passport'
import local from './local'
import { User } from '../models/User'

export default () => {
	passport.serializeUser((user, done) => {
		done(null, user._id)
	})

	passport.deserializeUser(async (id, done) => {
		try {
			const user = await User.findById(id)
			done(null, user)
		} catch (error) {
			console.error(error)
			done(error)
		}
	})

	local()
}
