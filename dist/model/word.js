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
exports.deleteWord = exports.updateWord = exports.insertWord = exports.getAllWord = exports.getWordById = void 0;
const graphql_request_1 = require("graphql-request");
const instance_1 = require("../database/instance");
const getWordById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const words = yield (0, instance_1.qfetch)((0, graphql_request_1.gql) `
		query MyQuery($_eq: uuid) {
			words(where: {id: {_eq: $_eq}}) {
				word
				id
				synonym_ids
			}
		}
	`, { _eq: id });
    return words;
});
exports.getWordById = getWordById;
const getAllWord = () => __awaiter(void 0, void 0, void 0, function* () {
    const words = yield (0, instance_1.qfetch)((0, graphql_request_1.gql) `
		query MyQuery {
			words {
				id
				synonym_ids
				word
			}
		}
	`);
    if (words == null)
        return null;
    return words[Object.keys(words)[0]];
});
exports.getAllWord = getAllWord;
const insertWord = (word) => __awaiter(void 0, void 0, void 0, function* () {
    const words = yield (0, instance_1.qfetch)((0, graphql_request_1.gql) `
		mutation MyMutation($word: String) {
			insert_words(objects: {word: $word}) {
				returning {
					id
					synonym_ids
					word
				}
			}
		}
	`, { word: word.word });
    if (words != null) {
        console.log("insert word");
        return words.insert_words.returning[0];
    }
    return null;
});
exports.insertWord = insertWord;
const updateWord = (id, synonym_ids) => __awaiter(void 0, void 0, void 0, function* () {
    const update = (0, instance_1.qfetch)((0, graphql_request_1.gql) `
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
	`, { _eq: id, synonym_ids: synonym_ids });
    if (update != null)
        console.log("update word");
    return update;
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
    if (del != null)
        console.log("delete word");
    return del;
});
exports.deleteWord = deleteWord;
//# sourceMappingURL=word.js.map