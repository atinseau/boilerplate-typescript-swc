import Express from 'express';
import { emailIsTaken, usernameIsTaken, userByToken } from '../model/user/query';
import { register, login, logout, formattedUser, isAuth } from '../model/user/index';
import { authMiddleware } from '../middleware/auth';
const router = Express.Router();
router.use(async (req, res, next)=>{
    if (!await authMiddleware(req, res, [
        '/user'
    ])) return;
    next();
});
router.post('/register', async (req, res)=>{
    const { email , username , password  } = req.body;
    const user = await register(email, username, password);
    if (user) {
        res.send(user);
    } else {
        res.send({
            status: 307,
            msg: "User already exists"
        });
    }
});
router.post('/login', async (req, res)=>{
    const { username , password  } = req.body;
    const auth = await login(username, password);
    if (auth) {
        res.send(auth);
    } else {
        res.send({
            status: 307,
            msg: "User crediential is invalid"
        });
    }
});
router.post('/logout', async (req, res)=>{
    const { token  } = req.body;
    const status = await logout(token);
    if (status) {
        res.send(status);
    } else {
        res.send({
            status: 307,
            msg: "Already logout or no token provided"
        });
    }
});
router.post('/verify-token', async (req, res)=>{
    const { token  } = req.body;
    const status = await isAuth(token);
    res.send(!status ? {
        status: 307,
        msg: "Invalid token"
    } : status);
});
router.post('/email-is-taken', async (req, res)=>{
    const { email  } = req.body;
    const status = await emailIsTaken(email);
    console.log(status);
    if (status == null) {
        res.send({
            status: 307,
            msg: "Invalid email"
        });
        return;
    }
    if (!status) res.send({
        taken: status
    });
    else {
        res.send({
            status: 307,
            msg: "Email already used"
        });
    }
});
router.post('/username-is-taken', async (req, res)=>{
    const { username  } = req.body;
    const status = await usernameIsTaken(username);
    if (status == null) {
        res.send({
            status: 307,
            msg: "Invalid username"
        });
        return;
    }
    if (!status) res.send({
        taken: status
    });
    else {
        res.send({
            status: 307,
            msg: "Username already used"
        });
    }
});
router.post('/user', async (req, res)=>{
    const { token  } = req.body;
    res.send(formattedUser(await userByToken(token)));
});
export { router as authRouter };
