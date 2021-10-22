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
exports.getUserByUsername = exports.updateUser = exports.insertUser = exports.userById = exports.usernameIsTaken = exports.emailIsTaken = exports.userByToken = exports.isAuth = exports.logout = exports.login = exports.register = void 0;
const graphql_request_1 = require("graphql-request");
const instance_1 = require("../database/instance");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const formattedUser = (user) => {
    delete user['id'];
    delete user['token'];
    delete user['password'];
    return user;
};
/*
**
** METHODS WHO REQUEST GRAPHQL HASURA
**
**
*/
const register = (email, username, password) => __awaiter(void 0, void 0, void 0, function* () {
    if (email && username && password) {
        return yield new Promise((resolve) => {
            bcrypt_1.default.hash(password, 10, (err, hash) => __awaiter(void 0, void 0, void 0, function* () {
                resolve(yield (0, exports.insertUser)(email, username, hash));
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
    let auth = yield (0, exports.getUserByUsername)(username);
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
                    resolve(yield (0, exports.updateUser)(auth));
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
        const res = yield (0, exports.updateUser)(user);
        return res;
    }
    console.log("Is not auth");
    return null;
});
exports.logout = logout;
const isAuth = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, exports.userByToken)(token);
    try {
        if (user) {
            const status = jsonwebtoken_1.default.verify(user.token, process.env.TOKEN_KEY, { complete: true });
            const verifiedUser = yield (0, exports.userById)(status.payload['id']);
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
/*
** QUERY GRAPHQL
**
**
*/
const userByToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token)
        return null;
    const user = yield (0, instance_1.qfetch)((0, graphql_request_1.gql) `
		query MyQuery($_eq: String) {
			users(where: {token: {_eq: $_eq}}) {
				email
				id
				password
				token
				username
			}
		}
	`, { _eq: token });
    if (user)
        return user.users[0];
    return user;
});
exports.userByToken = userByToken;
const emailIsTaken = (email) => __awaiter(void 0, void 0, void 0, function* () {
    if (!email)
        return null;
    const user = yield (0, instance_1.qfetch)((0, graphql_request_1.gql) `
		query MyQuery($_eq: String) {
			users(where: {email: {_eq: $_eq}}) {
				email
			}
		}
	`, { _eq: email });
    if (user)
        return user.users.length != 0;
    return false;
});
exports.emailIsTaken = emailIsTaken;
const usernameIsTaken = (username) => __awaiter(void 0, void 0, void 0, function* () {
    if (!username)
        return null;
    const user = yield (0, instance_1.qfetch)((0, graphql_request_1.gql) `
		query MyQuery($_eq: String) {
			users(where: {username: {_eq: $_eq}}) {
				username
			}
		}
	`, { _eq: username });
    if (user)
        return user.users.length != 0;
    return false;
});
exports.usernameIsTaken = usernameIsTaken;
const userById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id)
        return null;
    const user = yield (0, instance_1.qfetch)((0, graphql_request_1.gql) `
		query MyQuery($_eq: uuid) {
			users(where: {id: {_eq: $_eq}}) {
				email
				id
				password
				token
				username
			}
		}
	`, { _eq: id });
    if (user)
        return user.users[0];
    return user;
});
exports.userById = userById;
const insertUser = (email, username, password) => __awaiter(void 0, void 0, void 0, function* () {
    if (!email || !username || !password)
        return null;
    const user = yield (0, instance_1.qfetch)((0, graphql_request_1.gql) `
		mutation MyMutation($email: String, $password: String, $username: String) {
			insert_users(objects: {email: $email, password: $password, username: $username}) {
				returning {
					email
					id
					token
					password
					username
				}
			}
		}
	`, { email, username, password });
    if (user)
        return user.insert_users.returning[0];
    return user;
});
exports.insertUser = insertUser;
const updateUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    if (!user)
        return null;
    const update = yield (0, instance_1.qfetch)((0, graphql_request_1.gql) `
		mutation MyMutation($id: uuid!, $email: String, $password: String, $username: String, $token: String) {
			update_users_by_pk(pk_columns: {id: $id}, _set: {token: $token, email: $email, username: $username, password: $password}) {
				email
				id
				token
				password
				username
			}
		}
	`, {
        id: user.id,
        email: user.email,
        password: user.password,
        username: user.username,
        token: user.token
    });
    if (update)
        return update.update_users_by_pk;
    return update;
});
exports.updateUser = updateUser;
const getUserByUsername = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, instance_1.qfetch)((0, graphql_request_1.gql) `
		query MyQuery($_eq: String = "") {
			users(where: {username: {_eq: $_eq}}) {
				password
				id
				token
				username
				email
			}
		}
	`, { _eq: username });
    if (user)
        return user.users[0];
    return user;
});
exports.getUserByUsername = getUserByUsername;
//# sourceMappingURL=user.js.map