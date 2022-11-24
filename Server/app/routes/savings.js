const express = require('express')
const savings = require('../controller/savings')
const router = express.Router()

router.post('/add', savings.post)

router.get('/user', savings.getByUserId)

router.get('/:id', savings.getById)

router.put('/:id', savings.update)

router.delete('/:id', savings.remove)

module.exports = router