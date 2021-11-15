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
exports.injectSynonym = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const word_1 = require("../model/word");
let browser = null;
const getProperties = (data, property) => __awaiter(void 0, void 0, void 0, function* () {
    let all = [];
    yield Promise.all(data.map((e) => __awaiter(void 0, void 0, void 0, function* () {
        all.push(yield (yield e.getProperty(property)).jsonValue());
    })));
    return all;
});
const getAllIds = (synos = []) => __awaiter(void 0, void 0, void 0, function* () {
    const ids = [];
    for (const syno of synos) {
        let word = yield (0, word_1.searchWord)(syno);
        if (!word)
            word = yield (0, word_1.insertWord)(syno);
        ids.push(word.id);
    }
    return ids;
});
const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const injectSynonym = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!browser)
        browser = yield puppeteer_1.default.launch();
    let dict = yield browser.newPage();
    yield dict.goto('http://www.synonymo.fr/dictionnaire_des_synonymes');
    const body = yield dict.$$("body .fiche-wrapper .fiche ul li a");
    let letters = yield getProperties(body, 'href');
    for (let i = 0; i < letters.length; i++) {
        if (i >= alphabet.indexOf('v')) {
            yield dict.goto(letters[i]);
            const wordsDom = yield dict.$$("body .fiche-wrapper .fiche ul li a");
            let wordsHref = yield getProperties(wordsDom, 'href');
            let wordsText = yield getProperties(wordsDom, 'textContent');
            for (let e = 0; e < wordsHref.length; e++) {
                let word = yield (0, word_1.searchWord)(wordsText[e]);
                if (!word)
                    word = yield (0, word_1.insertWord)(wordsText[e]);
                yield dict.goto(wordsHref[e]);
                const synosDom = yield dict.$$("body .fiche-wrapper .fiche ul li a");
                let synos = yield getProperties(synosDom, 'textContent');
                const synoIds = yield getAllIds(synos);
                const update = yield (0, word_1.updateWord)(word.id, synoIds);
                if (!update)
                    console.log(alphabet[i] + ", " + e + ": skip");
                else
                    console.log(alphabet[i] + ", " + e + ": new !");
            }
        }
    }
});
exports.injectSynonym = injectSynonym;
//# sourceMappingURL=synonyms.js.map