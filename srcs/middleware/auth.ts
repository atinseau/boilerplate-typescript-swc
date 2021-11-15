import { Request, Response } from 'express';
import { isAuth, User } from '../model/user';

export const authMiddleware = async (req: Request, res: Response, routes: String[]) => {

	const { token } = req.body

	if (routes.includes(req.path)) {
		const status = await isAuth(token)

		if (typeof (status as User).token != 'undefined' && (status as User).token == token)
			return true;
		res.send({
			status: 307,
			msg: "Already logout or no token provided"
		})
		return false;
	}

	return true;
}