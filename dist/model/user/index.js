"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.register = exports.isAuth = exports.formattedUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const query_1 = require("./query");
const formattedUser = (user) => {
    if (user) {
        delete user['id'];
        delete user['token'];
        delete user['password'];
        return user;
    }
    return null;
};
exports.formattedUser = formattedUser;
/*
**
** METHODS WHO REQUEST GRAPHQL HASURA
**
**
*/
const isAuth = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, query_1.userByToken)(token);
    try {
        if (user) {
            const status = jsonwebtoken_1.default.verify(user.token, process.env.TOKEN_KEY, { complete: true });
            const verifiedUser = yield (0, query_1.userById)(status.payload['id']);
            if (verifiedUser && token == verifiedUser.token)
                return verifiedUser;
        }
    }
    catch (e) {
        if (process.env.DEBUG == "true")
            console.log(e);
    }
    return false;
});
exports.isAuth = isAuth;
const register = (email, username, password) => __awaiter(void 0, void 0, void 0, function* () {
    if (email && username && password) {
        return yield new Promise((resolve) => {
            bcrypt_1.default.hash(password, 10, (err, hash) => __awaiter(void 0, void 0, void 0, function* () {
                resolve(yield (0, query_1.insertUser)(email, username, hash));
            }));
        });
    }
    else {
        console.log("User cannot created");
        return null;
    }
});
exports.register = register;
const login = (username, password) => __awaiter(void 0, void 0, void 0, function* () {
    let auth = yield (0, query_1.getUserByUsername)(username);
    if (auth) {
        return new Promise((resolve) => {
            bcrypt_1.default.compare(password, auth.password, (err, eq) => __awaiter(void 0, void 0, void 0, function* () {
                if (eq) {
                    const token = jsonwebtoken_1.default.sign({
                        id: auth.id, email: auth.email
                    }, process.env.TOKEN_KEY, {
                        expiresIn: '7d'
                    });
                    auth.token = token;
                    resolve(yield (0, query_1.updateUser)(auth));
                }
                resolve(eq);
            }));
        });
    }
    return null;
});
exports.login = login;
const logout = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, exports.isAuth)(token);
    if (user != false) {
        user.token = null;
        const res = yield (0, query_1.updateUser)(user);
        return res;
    }
    console.log("Is not auth");
    return null;
});
exports.logout = logout;
//# sourceMappingURL=index.js.map