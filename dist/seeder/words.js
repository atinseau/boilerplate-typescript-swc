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
exports.removeWord = void 0;
const word_1 = require("../model/word");
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