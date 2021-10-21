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
const readline_1 = __importDefault(require("readline"));
const synonyms_1 = require("./seeder/synonyms");
const words_1 = require("./seeder/words");
const rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
    history: []
});
const prompt = () => {
    process.stdout.write("cli> ");
};
prompt();
rl.on('line', (line) => __awaiter(void 0, void 0, void 0, function* () {
    const args = line.split(' ');
    if (args[0] == "seed") {
        if (!args[1])
            console.log("Missing parameter");
        switch (args[1]) {
            case "words":
                yield (0, words_1.seedWord)();
                break;
            case "syn":
                yield (0, synonyms_1.injectSynonym)();
                break;
        }
    }
    if (args[0] == "db") {
        if (!args[1])
            console.log("Missing parameter");
        switch (args[1]) {
            case "drop":
                if (!args[2])
                    console.log("Missing what to drop");
                switch (args[2]) {
                    case "words":
                        yield (0, words_1.removeWord)();
                        break;
                }
                break;
        }
    }
    prompt();
}));
rl.on('close', () => {
    console.log("clse");
});
//# sourceMappingURL=prompt.js.map