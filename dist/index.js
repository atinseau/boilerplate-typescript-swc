import Express from "express";
import './config';
import { authRouter } from "./routes/auth";
import { definitionRouter } from "./routes/definition";
import { wordRouter } from "./routes/word";
const PORT = process.env.PORT || 3000;
const app = Express();
app.use(Express.json());
app.use(Express.urlencoded({
    extended: true
}));
app.use('/auth', authRouter);
app.use('/word', wordRouter);
app.use('/definition', definitionRouter);
app.get('/', (req, res)=>{
    res.send(process.env.ENDPOINT);
});
app.listen(PORT, ()=>{
    console.log(`Listing on port ${PORT}...`);
});
