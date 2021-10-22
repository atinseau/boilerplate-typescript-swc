import Express from "express";

import './prompt'
import './config'
import { authRouter } from "./routes/auth";

const PORT = process.env.PORT || 3000

const app = Express()
app.use(Express.json())
app.use(Express.urlencoded({
	extended: true
}))

app.get('/', (req, res) => {
	res.send(process.env.ENDPOINT)
})

app.listen(PORT, () => {})

app.use('/auth', authRouter)