const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const productsRouter = require('./routes/products')
const usersRouter    = require('./routes/users')
const { ValidateToken } = require('./middleware/ValidateToken')

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.use('/products', ValidateToken, productsRouter)
app.use('/users', usersRouter)

app.use((req, res, next) => {
    res.status(404).send({message: "Path not exist!"});
})

module.exports = app