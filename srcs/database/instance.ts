
import { request } from 'graphql-request'
import { RequestDocument } from 'graphql-request/dist/types'
import '../config'

export const qfetch = async (req: RequestDocument, body: Object = {}) => {
	try {
		const url = process.env.ENDPOINT
		const data = await request ("http://localhost:8080/v1/graphql" , req, body, {
			"x-hasura-admin-secret": process.env.SECRET
		})
		return data
	} catch (e) {
		if (process.env.DEBUG == "true")
			console.log(e)
		return null
	}
}