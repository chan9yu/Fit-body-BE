import { NextFunction, Request, Response } from 'express'

const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
	if (req.isAuthenticated()) {
		next()
	} else {
		return res.status(400).json({ message: '로그인이 필요한 서비스 입니다!' })
	}
}

const isNotLoggedIn = (req: Request, res: Response, next: NextFunction) => {
	if (!req.isAuthenticated()) {
		next()
	} else {
		return res
			.status(400)
			.json({ message: '로그인 하지 않은 사용자만 접근 가능합니다!' })
	}
}

export { isLoggedIn, isNotLoggedIn }
