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
exports.definitionRouter = void 0;
const express_1 = __importDefault(require("express"));
const definitions_1 = require("../model/definitions");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
exports.definitionRouter = router;
router.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(yield (0, auth_1.authMiddleware)(req, res, [
        '/by-word-id',
        '/insert'
    ])))
        return;
    next();
}));
router.post('/insert', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { catgram, origin_def, defs, word_id } = req.body;
    if (!catgram || !origin_def || !defs || !word_id) {
        res.send({
            msg: "Some parameter is missing or invalide",
            status: 307
        });
        return;
    }
    const data = yield (0, definitions_1.insertDefinition)(catgram, defs, origin_def, word_id);
    if (!data) {
        res.send({
            msg: "Fail to inserting new definition",
            status: 307
        });
        return;
    }
    res.send(data);
}));
router.post('/by-word-id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    if (!id) {
        res.send({
            msg: "There is no word id provided",
            status: 307
        });
        return;
    }
    const data = yield (0, definitions_1.getDefinitionByWordId)(id);
    if (!data) {
        res.send({
            msg: "There is no definition for this word",
            status: 307
        });
        return;
    }
    res.send(data);
}));
//# sourceMappingURL=definition.js.map