import { gql } from "graphql-request";
import { formattedUser } from ".";
import { qfetch } from "../../database/instance";
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
*/ export const userByToken = async (token)=>{
    if (!token) return null;
    const user = await qfetch(gql`
		query MyQuery($_eq: String) {
			users(where: {token: {_eq: $_eq}}) {
				${userReq}
			}
		}
	`, {
        _eq: token
    });
    if (user) return user.users[0];
    return user;
};
export const emailIsTaken = async (email)=>{
    if (!email) return null;
    const user = await qfetch(gql`
		query MyQuery($_eq: String) {
			users(where: {email: {_eq: $_eq}}) {
				email
			}
		}
	`, {
        _eq: email
    });
    if (user) return user.users.length != 0;
    return false;
};
export const usernameIsTaken = async (username)=>{
    if (!username) return null;
    const user = await qfetch(gql`
		query MyQuery($_eq: String) {
			users(where: {username: {_eq: $_eq}}) {
				username
			}
		}
	`, {
        _eq: username
    });
    if (user) return user.users.length != 0;
    return false;
};
export const userById = async (id)=>{
    if (!id) return null;
    const user = await qfetch(gql`
		query MyQuery($_eq: uuid) {
			users(where: {id: {_eq: $_eq}}) {
				${userReq}
			}
		}
	`, {
        _eq: id
    });
    if (user) return user.users[0];
    return user;
};
export const insertUser = async (email, username, password)=>{
    if (!email || !username || !password) return null;
    const user = await qfetch(gql`
		mutation MyMutation($email: String, $password: String, $username: String) {
			insert_users(objects: {email: $email, password: $password, username: $username}) {
				returning {
					${userReq}
				}
			}
		}
	`, {
        email,
        username,
        password
    });
    if (user) return user.insert_users.returning[0];
    return user;
};
export const updateUser = async (user)=>{
    if (!user) return null;
    const update = await qfetch(gql`
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
    if (update) return update.update_users_by_pk;
    return update;
};
export const updateUserByToken = async (token, user)=>{
    if (!token) return null;
    const old = await userByToken(token);
    if (!old) return null;
    const oldUser = formattedUser(old);
    const changeProperty = [];
    Object.keys(oldUser).forEach((key)=>{
        if (typeof user[key] != 'undefined' && oldUser[key] != user[key]) {
            changeProperty.push({
                key: key,
                value: user[key]
            });
        }
    });
    let query = "";
    changeProperty.map((props, index)=>{
        query += props.key + ":" + JSON.stringify(props.value);
        if (index + 1 < changeProperty.length - 1) query += ',';
    });
    const customUpdate = await qfetch(gql`
		mutation MyMutation($_eq: String) {
			update_users(where: {token: {_eq: $_eq}}, _set: {${query}}) {
				returning {
					${userReq}
				}
			}
		}
	`, {
        _eq: token
    });
    if (!customUpdate) return null;
    return customUpdate.update_users.returning[0];
};
export const getUserByUsername = async (username)=>{
    const user = await qfetch(gql`
		query MyQuery($_eq: String = "") {
			users(where: {username: {_eq: $_eq}}) {
				${userReq}
			}
		}
	`, {
        _eq: username
    });
    if (user) return user.users[0];
    return user;
};
