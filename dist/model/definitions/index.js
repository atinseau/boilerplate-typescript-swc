import { gql } from 'graphql-request';
import { qfetch } from '../../database/instance';
export const definitionQuery = `
	catgram
	defs
	origin_def
	word_id
`;
export const insertDefinition = async (catgram, defs, origin_def, word_id)=>{
    const res = await qfetch(gql`
		mutation MyMutation($catgram: String, $defs: json, $origin_def: String, $word_id: uuid) {
			insert_definitions(objects: {catgram: $catgram, defs: $defs, origin_def: $origin_def, word_id: $word_id}) {
				returning {
					${definitionQuery}
				}
			}
		}
	`, {
        catgram,
        defs,
        origin_def,
        word_id
    });
    if (!res) return null;
    return res.insert_definitions.returning[0];
};
export const getDefinitionByWordId = async (wordId)=>{
    const def = await qfetch(gql`
		query MyQuery($_eq: uuid = "") {
			definitions(where: {word_id: {_eq: $_eq}}) {
				${definitionQuery}
			}
		}
	`, {
        _eq: wordId
    });
    if (!def) return null;
    if (!def.definitions.length) return null;
    return def.definitions[0];
};
