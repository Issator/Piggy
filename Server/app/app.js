const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const productsRouter = require('./routes/products')
const usersRouter    = require('./routes/users')

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.use('/product', productsRouter)
app.use('/users',   usersRouter   )


module.exports = app