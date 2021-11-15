import { gql } from 'graphql-request';
import { qfetch } from '../../database/instance';
import { definitionQuery } from '../definitions';
export const wordQuery = `
	id
	word
	synonym_ids
	definition {
		${definitionQuery}
	}
`;
export const getWordCount = async ()=>{
    return {
        count: (await qfetch(gql`
		query MyQuery {
			words_aggregate {
				aggregate {
					count
				}
			}
		}
	`)).words_aggregate.aggregate.count
    };
};
export const searchWord = async (word)=>{
    const res = (await qfetch(gql`
		query MyQuery($_eq: String) {
			words(where: {word: {_eq: $_eq}}) {
				${wordQuery}
			}
		}
	`, {
        _eq: word
    })).words;
    if (res.length == 0) return null;
    return res[0];
};
export const getOneWordByOffset = async (offset)=>{
    return (await qfetch(gql`
		query MyQuery {
			words(limit: 1, offset: ${offset}) {
				${wordQuery}
			}
		}
	`)).words[0];
};
export const getWordById = async (id)=>{
    const words = await qfetch(gql`
		query MyQuery($_eq: uuid) {
			words(where: {id: {_eq: $_eq}}) {
				${wordQuery}
			}
		}
	`, {
        _eq: id
    });
    if (words) return words.words[0];
    return null;
};
export const getAllWord = async ()=>{
    const words = await qfetch(gql`
		query MyQuery {
			words {
				${wordQuery}
			}
		}
	`);
    if (words == null) return null;
    return words[Object.keys(words)[0]];
};
export const getCountWord = async (limit = 0)=>{
    const words = await qfetch(gql`
		query MyQuery($limit: Int) {
			words (limit: $limit) {
				${wordQuery}
			}
		}
	`, {
        limit
    });
    if (words == null) return null;
    return words;
};
export const insertWord = async (word)=>{
    const words = await qfetch(gql`
		mutation MyMutation($word: String) {
			insert_words(objects: {word: $word}) {
				returning {
					${wordQuery}
				}
			}
		}
	`, {
        word
    });
    if (words) return words.insert_words.returning[0];
    return null;
};
export const updateWord = async (id, synonym_ids)=>{
    const word = await getWordById(id);
    if (!word) return null;
    if (JSON.stringify(synonym_ids) == JSON.stringify(word.synonym_ids)) return null;
    const update = await qfetch(gql`
		mutation MyMutation($_eq: uuid, $synonym_ids: json) {
			update_words(where: {id: {_eq: $_eq}}, _set: {synonym_ids: $synonym_ids}) {
				affected_rows
				returning {
					${wordQuery}
				}
			}
		}
	`, {
        _eq: id,
        synonym_ids: synonym_ids
    });
    if (update) return update.update_words.returning[0];
    return null;
};
export const deleteWord = async (id)=>{
    const del = qfetch(gql`
		mutation MyMutation2($_eq: uuid = "") {
			delete_words(where: {id: {_eq: $_eq}}) {
				affected_rows
			}
		}
	`, {
        _eq: id
    });
    return del;
};
export const searchWordLike = async (query)=>{
    const res = (await qfetch(gql`
		query MyQuery($_like: String = "${query}%") {
			words(where: {word: {_like: $_like }}, limit: 250) {
				${wordQuery}
			}
		}
	`)).words;
    return res;
};
