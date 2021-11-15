import { isAuth } from '../model/user';
export const authMiddleware = async (req, res, routes)=>{
    const { token  } = req.body;
    if (routes.includes(req.path)) {
        const status = await isAuth(token);
        if (typeof status.token != 'undefined' && status.token == token) return true;
        res.send({
            status: 307,
            msg: "Already logout or no token provided"
        });
        return false;
    }
    return true;
};
