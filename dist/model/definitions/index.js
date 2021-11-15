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
exports.getDefinitionByWordId = exports.insertDefinition = exports.definitionQuery = void 0;
const graphql_request_1 = require("graphql-request");
const instance_1 = require("../../database/instance");
exports.definitionQuery = `
	catgram
	defs
	origin_def
	word_id
`;
const insertDefinition = (catgram, defs, origin_def, word_id) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield (0, instance_1.qfetch)((0, graphql_request_1.gql) `
		mutation MyMutation($catgram: String, $defs: json, $origin_def: String, $word_id: uuid) {
			insert_definitions(objects: {catgram: $catgram, defs: $defs, origin_def: $origin_def, word_id: $word_id}) {
				returning {
					${exports.definitionQuery}
				}
			}
		}
	`, {
        catgram, defs, origin_def, word_id
    });
    if (!res)
        return null;
    return res.insert_definitions.returning[0];
});
exports.insertDefinition = insertDefinition;
const getDefinitionByWordId = (wordId) => __awaiter(void 0, void 0, void 0, function* () {
    const def = yield (0, instance_1.qfetch)((0, graphql_request_1.gql) `
		query MyQuery($_eq: uuid = "") {
			definitions(where: {word_id: {_eq: $_eq}}) {
				${exports.definitionQuery}
			}
		}
	`, { _eq: wordId });
    if (!def)
        return null;
    if (!def.definitions.length)
        return null;
    return def.definitions[0];
});
exports.getDefinitionByWordId = getDefinitionByWordId;
//# sourceMappingURL=index.js.map