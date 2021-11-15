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
exports.wordRouter = void 0;
const express_1 = __importDefault(require("express"));
const word_1 = require("../model/word");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
exports.wordRouter = router;
router.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(yield (0, auth_1.authMiddleware)(req, res, [
        '/random',
        '/by-id',
        '/definition',
        '/search'
    ])))
        return;
    next();
}));
router.post('/random', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    const max = (yield (0, word_1.getWordCount)()).count;
    const rand = Math.round(Math.random() * max);
    let word = yield (0, word_1.getOneWordByOffset)(rand);
    // SAVE WORD IN USER HISTORICS
    // const user = formattedUser(await userByToken(token))
    // await updateUserByToken(token, {
    // 	word_seen: [...user.word_seen, word.id]
    // })
    res.send(word);
}));
router.post('/by-id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    if (!id) {
        res.send({
            status: 307,
            msg: "There is not id provided for word"
        });
        return;
    }
    const word = yield (0, word_1.getWordById)(id);
    res.send((!word) ? { status: 307, msg: "No word found" } : word);
}));
router.post('/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req.body;
    if (!query) {
        res.send({
            status: 307,
            msg: "There is not query for searching word"
        });
        return;
    }
    res.send(yield (0, word_1.searchWordLike)(query));
}));
//# sourceMappingURL=word.js.map