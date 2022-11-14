const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const productRouter = require('./routes/products')

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.use('/product', productRouter)

module.exports = app