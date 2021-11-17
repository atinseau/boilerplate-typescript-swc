import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { getUserByUsername, insertUser, updateUser, userById, userByToken } from './query'

export interface BasicUser {
	email?: String,
	username?: String,
	saved_word?: String[],
	[key: string]: String | String[] | undefined
}

export interface User extends BasicUser {
	id: String,
	token: String,
	password: String
}

export const formattedUser = (user: User) : BasicUser => {
	if (user) {
		delete user['id']
		delete user['password']
		return user
	}
	return null
}

/*
**
** METHODS WHO REQUEST GRAPHQL HASURA
**
**
*/

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

export const register = async (email: string, username: string, password: string): Promise<User | null> => {
	if (email && username && password) {
		return await new Promise((resolve) => {
			bcrypt.hash(password, 10, async (err, hash) => {
				console.log("hash")
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





