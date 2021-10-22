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
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../model/user");
const router = express_1.default.Router();
exports.authRouter = router;
router.use((req, res, next) => {
    console.log("auth request");
    next();
});
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, username, password } = req.body;
    const user = yield (0, user_1.register)(email, username, password);
    if (user) {
        res.send(user);
    }
    else {
        res.send({
            status: 307,
            msg: "User already exists"
        });
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const auth = yield (0, user_1.login)(username, password);
    if (auth) {
        res.send(auth);
    }
    else {
        res.send({
            status: 307,
            msg: "User crediential is invalid"
        });
    }
}));
router.post('/logout', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    const status = yield (0, user_1.logout)(token);
    if (status) {
        res.send(status);
    }
    else {
        res.send({
            status: 307,
            msg: "Already logout or no token provided"
        });
    }
}));
router.post('/verify-token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    const status = yield (0, user_1.isAuth)(token);
    res.send(status);
}));
router.post('/email-is-taken', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const status = yield (0, user_1.emailIsTaken)(email);
    if (status != null)
        res.send({ status });
    else {
        res.send({
            status: 307,
            msg: "There is no email in body"
        });
    }
}));
router.post('/username-is-taken', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.body;
    const status = yield (0, user_1.usernameIsTaken)(username);
    if (status != null)
        res.send({ status });
    else {
        res.send({
            status: 307,
            msg: "There is no username in body"
        });
    }
}));
//# sourceMappingURL=auth.js.map