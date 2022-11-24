const express = require('express')
const payments = require('../controller/payments')
const router = express.Router()

router.post('/add', payments.post)

router.get('/list/:id',payments.getByProductId)

router.get('/:id', payments.getById)

router.put('/:id', payments.update)

router.delete('/:id', payments.remove)

module.exports = router