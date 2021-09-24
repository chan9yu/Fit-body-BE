const express = require('express')
const mongoose = require('mongoose')

const app = express()
const port = 3000

mongoose.connect()

app.get('/', (req, res) => res.send('예아'))

app.listen(port, () => console.log(`express port ${port} 으로 시작!`))
