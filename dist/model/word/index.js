"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchWordLike = exports.deleteWord = exports.updateWord = exports.insertWord = exports.getCountWord = exports.getAllWord = exports.getWordById = exports.getOneWordByOffset = exports.searchWord = exports.getWordCount = exports.wordQuery = void 0;
const graphql_request_1 = require("graphql-request");
const instance_1 = require("../../database/instance");
const definitions_1 = require("../definitions");
exports.wordQuery = `
	id
	word
	synonym_ids
	definition {
		${definitions_1.definitionQuery}
	}
`;
const getWordCount = () => __awaiter(void 0, void 0, void 0, function* () {
    return {
        count: (yield (0, instance_1.qfetch)((0, graphql_request_1.gql) `
		query MyQuery {
			words_aggregate {
				aggregate {
					count
				}
			}
		}
	`)).words_aggregate.aggregate.count
    };
});
exports.getWordCount = getWordCount;
const searchWord = (word) => __awaiter(void 0, void 0, void 0, function* () {
    const res = (yield (0, instance_1.qfetch)((0, graphql_request_1.gql) `
		query MyQuery($_eq: String) {
			words(where: {word: {_eq: $_eq}}) {
				${exports.wordQuery}
			}
		}
	`, { _eq: word })).words;
    if (res.length == 0)
        return null;
    return res[0];
});
exports.searchWord = searchWord;
const getOneWordByOffset = (offset) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield (0, instance_1.qfetch)((0, graphql_request_1.gql) `
		query MyQuery {
			words(limit: 1, offset: ${offset}) {
				${exports.wordQuery}
			}
		}
	`)).words[0];
});
exports.getOneWordByOffset = getOneWordByOffset;
const getWordById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const words = (yield (0, instance_1.qfetch)((0, graphql_request_1.gql) `
		query MyQuery($_eq: uuid) {
			words(where: {id: {_eq: $_eq}}) {
				${exports.wordQuery}
			}
		}
	`, { _eq: id }));
    if (words)
        return words.words[0];
    return null;
});
exports.getWordById = getWordById;
const getAllWord = () => __awaiter(void 0, void 0, void 0, function* () {
    const words = yield (0, instance_1.qfetch)((0, graphql_request_1.gql) `
		query MyQuery {
			words {
				${exports.wordQuery}
			}
		}
	`);
    if (words == null)
        return null;
    return words[Object.keys(words)[0]];
});
exports.getAllWord = getAllWord;
const getCountWord = (limit = 0) => __awaiter(void 0, void 0, void 0, function* () {
    const words = yield (0, instance_1.qfetch)((0, graphql_request_1.gql) `
		query MyQuery($limit: Int) {
			words (limit: $limit) {
				${exports.wordQuery}
			}
		}
	`, { limit });
    if (words == null)
        return null;
    return words;
});
exports.getCountWord = getCountWord;
const insertWord = (word) => __awaiter(void 0, void 0, void 0, function* () {
    const words = yield (0, instance_1.qfetch)((0, graphql_request_1.gql) `
		mutation MyMutation($word: String) {
			insert_words(objects: {word: $word}) {
				returning {
					${exports.wordQuery}
				}
			}
		}
	`, { word });
    if (words)
        return words.insert_words.returning[0];
    return null;
});
exports.insertWord = insertWord;
const updateWord = (id, synonym_ids) => __awaiter(void 0, void 0, void 0, function* () {
    const word = yield (0, exports.getWordById)(id);
    if (!word)
        return null;
    if (JSON.stringify(synonym_ids) == JSON.stringify(word.synonym_ids))
        return null;
    const update = yield (0, instance_1.qfetch)((0, graphql_request_1.gql) `
		mutation MyMutation($_eq: uuid, $synonym_ids: json) {
			update_words(where: {id: {_eq: $_eq}}, _set: {synonym_ids: $synonym_ids}) {
				affected_rows
				returning {
					${exports.wordQuery}
				}
			}
		}
	`, { _eq: id, synonym_ids: synonym_ids });
    if (update)
        return update.update_words.returning[0];
    return null;
});
exports.updateWord = updateWord;
const deleteWord = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const del = (0, instance_1.qfetch)((0, graphql_request_1.gql) `
		mutation MyMutation2($_eq: uuid = "") {
			delete_words(where: {id: {_eq: $_eq}}) {
				affected_rows
			}
		}
	`, { _eq: id });
    return del;
});
exports.deleteWord = deleteWord;
const searchWordLike = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const res = (yield (0, instance_1.qfetch)((0, graphql_request_1.gql) `
		query MyQuery($_like: String = "${query}%") {
			words(where: {word: {_like: $_like }}, limit: 250) {
				${exports.wordQuery}
			}
		}
	`)).words;
    return res;
});
exports.searchWordLike = searchWordLike;
//# sourceMappingURL=index.js.map