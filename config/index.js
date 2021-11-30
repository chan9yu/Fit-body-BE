import dotenv from 'dotenv'

dotenv.config()

const MONGO_URI = process.env.MONGO_URI
const COOKIE_SECRET = process.env.COOKIE_SECRET

export { MONGO_URI, COOKIE_SECRET }
