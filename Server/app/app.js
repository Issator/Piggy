const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const paymentsRouter = require('./routes/payments')
const productsRouter = require('./routes/products')
const savingsRouter  = require('./routes/savings')
const usersRouter    = require('./routes/users')

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.use('/product', productsRouter)
app.use('/payment', paymentsRouter)
app.use('/saving',  savingsRouter )
app.use('/users',   usersRouter   )


module.exports = app