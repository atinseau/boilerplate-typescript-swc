import puppeteer from 'puppeteer'
import { deleteWord, getAllWord, insertWord, updateWord, Word } from '../model/word';

let browser: puppeteer.Browser | null = null
let page: puppeteer.Page | null = null

export const getSynonym = async (word: String): Promise<String []> => {

	if (!browser)
		browser = await puppeteer.launch();
	if (!page)
		page = await browser.newPage();
		
	await page.goto('http://www.synonymo.fr/syno/' + word);
	const body = await page.$$("body .fiche .synos li a")

	let res: unknown[]
	
	if (body)
		res = await Promise.all(body.map(async e => (await e.getProperty('textContent')).jsonValue()))
	
	return res as String[]
}

export const injectSynonym = async () => {

	let words = (await getAllWord()).filter(e => e.synonym_ids == null)

	let stop = false

	console.log("Loading...")

	while(!stop) {
		for (const entry of words) {
			let synonyms = await getSynonym(entry.word)
			if (synonyms.length > 5) {
				const synonym_ids = []
				for (const synonym of synonyms) {
					const search = words.filter(e => e.word.toLocaleLowerCase() == synonym.toLocaleLowerCase()).map(e => e.id)
					if (!search.length) {
						if (synonym.split(' ').length == 1) {
							const insert = await insertWord({word: synonym})
							if (insert != null)
								synonym_ids.push(insert.id)
						}
					}
					else
						synonym_ids.push(...search)
				}
				await updateWord(entry.id, synonym_ids)
			} else {
				await deleteWord(entry.id)
			}
		}
		words = (await getAllWord()).filter(e => e.synonym_ids == null)
		if (words.length < 1000)
			stop = true
	}

	console.log("db seeded !")

	if (browser != null)
		await browser.close();
}

