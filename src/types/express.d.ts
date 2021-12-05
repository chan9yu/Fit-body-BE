import { UserTypes } from "../models/User";

declare global {
	namespace Express {
		interface User extends UserTypes {}
	}
}
