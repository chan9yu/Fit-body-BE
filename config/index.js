import dotenv from 'dotenv'

dotenv.config()

const MONGO_URI = process.env.MONGO_URI
const JWT_SECRET = process.env.JWT_SECRET
const PORT = process.env.PORT
const ORIGIN = process.env.ORIGIN

export { MONGO_URI, JWT_SECRET, PORT, ORIGIN }
