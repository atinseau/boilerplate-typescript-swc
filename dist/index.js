"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("./prompt");
require("./config");
const auth_1 = require("./routes/auth");
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({
    extended: true
}));
app.get('/', (req, res) => {
    res.send(process.env.ENDPOINT);
});
app.listen(PORT, () => { });
app.use('/auth', auth_1.authRouter);
//# sourceMappingURL=index.js.map