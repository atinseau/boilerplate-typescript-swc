
import { gql } from 'graphql-request'
import { qfetch } from '../database/instance'

export interface Word {
	word: String
	id?: String
	synonym_ids?: String[]
}

export const getWordById = async (id: String): Promise<Word> => {
	const words = await qfetch(gql`
		query MyQuery($_eq: uuid) {
			words(where: {id: {_eq: $_eq}}) {
				word
				id
				synonym_ids
			}
		}
	`, { _eq: id })
	return words
}

export const getAllWord = async (): Promise<Word[]> => {
	const words = await qfetch(gql`
		query MyQuery {
			words {
				id
				synonym_ids
				word
			}
		}
	`)
	if (words == null)
		return null
	return words[Object.keys(words)[0]]
}

export const insertWord = async (word: Word): Promise<Word | null> => {
	const words = await qfetch(gql`
		mutation MyMutation($word: String) {
			insert_words(objects: {word: $word}) {
				returning {
					id
					synonym_ids
					word
				}
			}
		}
	`, { word: word.word })
	if (words != null) {
		console.log("insert word")
		return words.insert_words.returning[0]
	}
	return null
}

export const updateWord = async (id: String, synonym_ids: String[]): Promise<Word> =>  {
	const update = qfetch (gql`
		mutation MyMutation($_eq: uuid, $synonym_ids: json) {
			update_words(where: {id: {_eq: $_eq}}, _set: {synonym_ids: $synonym_ids}) {
				affected_rows
				returning {
					id
					synonym_ids
					word
				}
			}
		}
	`, { _eq: id, synonym_ids: synonym_ids })
	if (update != null)
		console.log("update word")
	return update
}

export const deleteWord = async (id: String): Promise<Word> => {
	const del = qfetch(gql`
		mutation MyMutation2($_eq: uuid = "") {
			delete_words(where: {id: {_eq: $_eq}}) {
				affected_rows
			}
		}
	`, { _eq: id })
	if (del != null)
		console.log("delete word")
	return del
}