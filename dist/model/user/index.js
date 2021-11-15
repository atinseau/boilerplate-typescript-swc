import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getUserByUsername, insertUser, updateUser, userById, userByToken } from './query';
export const formattedUser = (user)=>{
    if (user) {
        delete user['id'];
        delete user['token'];
        delete user['password'];
        return user;
    }
    return null;
};
/*
**
** METHODS WHO REQUEST GRAPHQL HASURA
**
**
*/ export const isAuth = async (token)=>{
    const user = await userByToken(token);
    try {
        if (user) {
            const status = jwt.verify(user.token, process.env.TOKEN_KEY, {
                complete: true
            });
            const verifiedUser = await userById(status.payload['id']);
            if (verifiedUser && token == verifiedUser.token) return verifiedUser;
        }
    } catch (e) {
        if (process.env.DEBUG == "true") console.log(e);
    }
    return false;
};
export const register = async (email, username, password)=>{
    if (email && username && password) {
        return await new Promise((resolve)=>{
            bcrypt.hash(password, 10, async (err, hash)=>{
                resolve(await insertUser(email, username, hash));
            });
        });
    } else {
        console.log("User cannot created");
        return null;
    }
};
export const login = async (username, password)=>{
    let auth = await getUserByUsername(username);
    if (auth) {
        return new Promise((resolve)=>{
            bcrypt.compare(password, auth.password, async (err, eq)=>{
                if (eq) {
                    const token = jwt.sign({
                        id: auth.id,
                        email: auth.email
                    }, process.env.TOKEN_KEY, {
                        expiresIn: '7d'
                    });
                    auth.token = token;
                    resolve(await updateUser(auth));
                }
                resolve(eq);
            });
        });
    }
    return null;
};
export const logout = async (token)=>{
    const user = await isAuth(token);
    if (user != false) {
        user.token = null;
        const res = await updateUser(user);
        return res;
    }
    console.log("Is not auth");
    return null;
};
