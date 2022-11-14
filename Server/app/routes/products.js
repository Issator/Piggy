const express = require('express')
const products = require('../controller/products')
const router = express.Router()

router.post('/add', products.post)

router.get('/:id', products.getById)

router.put('/:id', products.update)

router.delete('/:id', products.remove)

module.exports = router