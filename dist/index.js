import express from "express";
import './config';
const PORT = process.env.PORT || 3000;
const app = express();
app.get('/', (req, res)=>{
    res.send(process.env.ENDPOINT);
});
app.listen(PORT);
