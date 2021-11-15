import Express from 'express'
import { getOneWordByOffset, getWordById, getWordCount, searchWordLike, Word } from '../model/word';
import { authMiddleware } from '../middleware/auth'

const router = Express.Router()

router.use(async (req, res, next) => {
	if (!await authMiddleware(req, res, [
		'/random',
		'/by-id',
		'/definition',
		'/search'
	]))
		return;
	next()
})

router.post('/random', async (req, res) => {

	const { token } = req.body
	const max: number = (await getWordCount()).count
	const rand = Math.round(Math.random() * max)
	let word: Word = await getOneWordByOffset(rand)

	// SAVE WORD IN USER HISTORICS
	// const user = formattedUser(await userByToken(token))
	// await updateUserByToken(token, {
	// 	word_seen: [...user.word_seen, word.id]
	// })

	res.send(word)
})


router.post('/by-id', async (req, res) => {
	const { id } = req.body

	if (!id) {
		res.send({
			status: 307,
			msg: "There is not id provided for word"
		})
		return;
	}

	const word = await getWordById(id)

	res.send((!word) ? {status: 307, msg: "No word found"} : word)
})

router.post('/search', async (req, res) => {
	const { query } = req.body

	if (!query) {
		res.send({
			status: 307,
			msg: "There is not query for searching word"
		})
		return;
	}

	res.send(await searchWordLike(query)) 
})

export { router as wordRouter }