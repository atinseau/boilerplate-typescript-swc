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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.injectSynonym = exports.getSynonym = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const word_1 = require("../model/word");
let browser = null;
let page = null;
const getSynonym = (word) => __awaiter(void 0, void 0, void 0, function* () {
    if (!browser)
        browser = yield puppeteer_1.default.launch();
    if (!page)
        page = yield browser.newPage();
    yield page.goto('http://www.synonymo.fr/syno/' + word);
    const body = yield page.$$("body .fiche .synos li a");
    let res;
    if (body)
        res = yield Promise.all(body.map((e) => __awaiter(void 0, void 0, void 0, function* () { return (yield e.getProperty('textContent')).jsonValue(); })));
    return res;
});
exports.getSynonym = getSynonym;
const injectSynonym = () => __awaiter(void 0, void 0, void 0, function* () {
    let words = (yield (0, word_1.getAllWord)()).filter(e => e.synonym_ids == null);
    let stop = false;
    console.log("Loading...");
    while (!stop) {
        for (const entry of words) {
            let synonyms = yield (0, exports.getSynonym)(entry.word);
            if (synonyms.length > 5) {
                const synonym_ids = [];
                for (const synonym of synonyms) {
                    const search = words.filter(e => e.word.toLocaleLowerCase() == synonym.toLocaleLowerCase()).map(e => e.id);
                    if (!search.length) {
                        if (synonym.split(' ').length == 1) {
                            const insert = yield (0, word_1.insertWord)({ word: synonym });
                            if (insert != null)
                                synonym_ids.push(insert.id);
                        }
                    }
                    else
                        synonym_ids.push(...search);
                }
                yield (0, word_1.updateWord)(entry.id, synonym_ids);
            }
            else {
                yield (0, word_1.deleteWord)(entry.id);
            }
        }
        words = (yield (0, word_1.getAllWord)()).filter(e => e.synonym_ids == null);
        if (words.length < 1000)
            stop = true;
    }
    console.log("db seeded !");
    if (browser != null)
        yield browser.close();
});
exports.injectSynonym = injectSynonym;
//# sourceMappingURL=synonyms.js.map