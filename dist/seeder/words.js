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
exports.removeWord = exports.seedWord = void 0;
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const word_1 = require("../model/word");
const PATH = "/home/arthur/Desktop/Dev/REACT_NATIVE/syno/api";
const getWordJSON = () => __awaiter(void 0, void 0, void 0, function* () {
    const SOURCE = "nietzche";
    // CHECK IF DB WORD EXIST
    try {
        const json = yield (0, promises_1.readFile)(PATH + '/output/' + SOURCE + '.json');
        return JSON.parse(json.toString());
    }
    catch (e) {
        console.log("file not found");
        const buf = yield (0, promises_1.readFile)(PATH + '/source/' + SOURCE);
        const words = buf.toString().split(' ').filter((e) => e.length > 3 && !e.includes('://') && !e.includes('’') && !e.includes('\''));
        let db = [];
        for (const word of words) {
            const entry = db.filter(e => e.word == word);
            if (entry.length == 0)
                db.push({ word: word, appear: 1 });
            else
                entry[0].appear++;
        }
        const output = db.sort((a, b) => (a.appear < b.appear) ? 1 : -1).filter((e) => e.appear > 6);
        (0, fs_1.writeFile)(PATH + '/output/' + SOURCE + '.json', JSON.stringify(output), (e) => {
            console.log(e);
        });
        return output;
    }
});
const seedWord = () => __awaiter(void 0, void 0, void 0, function* () {
    const words = yield getWordJSON();
    for (const entry of words) {
        yield (0, word_1.insertWord)(entry);
    }
    console.log("All word seeded");
});
exports.seedWord = seedWord;
const removeWord = () => __awaiter(void 0, void 0, void 0, function* () {
    const words = yield (0, word_1.getAllWord)();
    if (words != null) {
        for (const word of words) {
            yield (0, word_1.deleteWord)(word.id);
        }
        console.log("All word cleaned");
    }
    else {
        console.log("Aleardy empty");
    }
});
exports.removeWord = removeWord;
//# sourceMappingURL=words.js.map