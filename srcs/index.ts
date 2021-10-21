import Express from "express";

import './prompt'
import './config'

const PORT = process.env.PORT || 3000

const app = Express()
app.use(Express.json())

app.get('/', (req, res) => {
	res.send(process.env.ENDPOINT)
})

app.listen(PORT, () => {})
