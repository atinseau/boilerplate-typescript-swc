import Express from "express";
import { getDefinitionByWordId, insertDefinition } from "../model/definitions";
import { authMiddleware } from "../middleware/auth";

const router = Express.Router()

router.use(async (req, res, next) => {
	if (!await authMiddleware(req, res, [
		'/by-word-id',
		'/insert'
	]))
		return;
	next()
})

router.post('/insert', async (req, res) => {
	const {
		catgram,
		origin_def,
		defs,
		word_id
	} = req.body

	if(!catgram || !origin_def || !defs || !word_id) {
		res.send({
			msg: "Some parameter is missing or invalide",
			status: 307
		})
		return;
	}
	const data = await insertDefinition(catgram, defs, origin_def, word_id)
	if (!data) {
		res.send({
			msg: "Fail to inserting new definition",
			status: 307
		})
		return;
	}
	res.send(data)
})

router.post('/by-word-id', async (req, res) => {
	const { id } = req.body 
	if (!id) {
		res.send({
			msg: "There is no word id provided",
			status: 307
		})
		return;
	}
	const data = await getDefinitionByWordId(id)
	if (!data) {
		res.send({
			msg: "There is no definition for this word",
			status: 307
		})
		return;
	}
	res.send(data)
})

export { router as definitionRouter }