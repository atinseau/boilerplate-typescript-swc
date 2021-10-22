
import { gql } from 'graphql-request'
import { qfetch } from '../database/instance'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

interface BasicUser {
	email: String,
	username: String,
	password: String
}

interface User extends BasicUser {
	id: String,
	token: String
}

const formattedUser = (user: User) : BasicUser => {
	delete user['id']
	delete user['token']
	delete user['password']
	return user
}

/*
**
** METHODS WHO REQUEST GRAPHQL HASURA
**
**
*/

export const register = async (email: string, username: string, password: string): Promise<User | null> => {
	if (email && username && password) {
		return await new Promise((resolve) => {
			bcrypt.hash(password, 10, async (err, hash) => {
				resolve(await insertUser(email, username, hash))
			})
		})
	} else {
		console.log("User cannot created")
		return null;
	}
}



export const login  = async (username: string, password: string) => {
	let auth = await getUserByUsername(username)

	if (auth) {
		return new Promise((resolve) => {
			bcrypt.compare(password, auth.password as string, async (err, eq) => {
				if (eq) {
					const token = jwt.sign({
						id: auth.id, email: auth.email
					}, process.env.TOKEN_KEY, {
						expiresIn: '7d'
					})
					auth.token = token
					resolve(await updateUser(auth))
				}
				resolve(eq)
			})
		})
	}
	return null
}


export const logout = async (token: string): Promise<User | null> => {

	const user = await isAuth(token)

	if (user != false) {
		(user as User).token = null
		const res = await updateUser(user as User)

		return res
	}

	console.log("Is not auth")
	return null
}

export const isAuth = async (token: string): Promise<User | boolean> => {
	const user = await userByToken(token)
	
	try {
		if (user) {
			const status = jwt.verify(user.token as string, process.env.TOKEN_KEY, { complete: true })
			const verifiedUser = await userById((status as jwt.Jwt).payload['id'])
			if (verifiedUser && token == verifiedUser.token)
				return verifiedUser
		}
	} catch (e) {
		if (process.env.DEBUG == "true")
			console.log(e)
	}
	return false
}


/*
** QUERY GRAPHQL
** 
**
*/

export const userByToken = async (token: string) : Promise<User | null> => {
	if (!token)
		return null
	const user = await qfetch (gql`
		query MyQuery($_eq: String) {
			users(where: {token: {_eq: $_eq}}) {
				email
				id
				password
				token
				username
			}
		}
	`, { _eq: token})
	if (user)
		return user.users[0]
	return user
}

export const emailIsTaken = async (email: string) : Promise<boolean | null> => {
	if (!email)
		return null
	const user = await qfetch (gql`
		query MyQuery($_eq: String) {
			users(where: {email: {_eq: $_eq}}) {
				email
			}
		}
	`, { _eq: email})
	if (user)
		return user.users.length != 0;
	return false
}

export const usernameIsTaken = async (username: string) : Promise<boolean | null> => {
	if (!username)
		return null
	const user = await qfetch (gql`
		query MyQuery($_eq: String) {
			users(where: {username: {_eq: $_eq}}) {
				username
			}
		}
	`, { _eq: username})
	if (user)
		return user.users.length != 0;
	return false
}

export const userById = async (id: string) : Promise<User | null> => {
	if (!id)
		return null
	const user = await qfetch (gql`
		query MyQuery($_eq: uuid) {
			users(where: {id: {_eq: $_eq}}) {
				email
				id
				password
				token
				username
			}
		}
	`, { _eq: id})
	if (user)
		return user.users[0]
	return user
}

export const insertUser = async (email: String, username: String, password: String) : Promise<User | null> => {
	
	if (!email || !username || !password)
		return null
	
	const user = await qfetch(gql`
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
	`, { email, username, password })
	
	if (user)
		return user.insert_users.returning[0]
	return user
}


export const updateUser = async (user: User) : Promise<User | null>  => {
	
	if (!user)
		return null
	
	const update = await qfetch(gql`
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
	})
	
	if (update)
		return update.update_users_by_pk
	return update
}

export const getUserByUsername = async (username: String) : Promise<User | null>  => {
	const user = await qfetch(gql`
		query MyQuery($_eq: String = "") {
			users(where: {username: {_eq: $_eq}}) {
				password
				id
				token
				username
				email
			}
		}
	`, { _eq: username })
	if (user)
		return user.users[0]
	return user
}

