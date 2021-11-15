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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByUsername = exports.updateUserByToken = exports.updateUser = exports.insertUser = exports.userById = exports.usernameIsTaken = exports.emailIsTaken = exports.userByToken = void 0;
const graphql_request_1 = require("graphql-request");
const _1 = require(".");
const instance_1 = require("../../database/instance");
const userReq = `
	email
	id
	password
	token
	username
	saved_word
`;
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
				${userReq}
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
				${userReq}
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
					${userReq}
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
				${userReq}
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
const updateUserByToken = (token, user) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token)
        return null;
    const old = yield (0, exports.userByToken)(token);
    if (!old)
        return null;
    const oldUser = (0, _1.formattedUser)(old);
    const changeProperty = [];
    Object.keys(oldUser).forEach((key) => {
        if (typeof user[key] != 'undefined' && oldUser[key] != user[key]) {
            changeProperty.push({
                key: key,
                value: user[key]
            });
        }
    });
    let query = "";
    changeProperty.map((props, index) => {
        query += props.key + ":" + JSON.stringify(props.value);
        if (index + 1 < changeProperty.length - 1)
            query += ',';
    });
    const customUpdate = (yield (0, instance_1.qfetch)((0, graphql_request_1.gql) `
		mutation MyMutation($_eq: String) {
			update_users(where: {token: {_eq: $_eq}}, _set: {${query}}) {
				returning {
					${userReq}
				}
			}
		}
	`, { _eq: token }));
    if (!customUpdate)
        return null;
    return customUpdate.update_users.returning[0];
});
exports.updateUserByToken = updateUserByToken;
const getUserByUsername = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, instance_1.qfetch)((0, graphql_request_1.gql) `
		query MyQuery($_eq: String = "") {
			users(where: {username: {_eq: $_eq}}) {
				${userReq}
			}
		}
	`, { _eq: username });
    if (user)
        return user.users[0];
    return user;
});
exports.getUserByUsername = getUserByUsername;
//# sourceMappingURL=query.js.map