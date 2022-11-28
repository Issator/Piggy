const express = require('express')
const users = require('../controller/users')
const { ValidateToken } = require('../middleware/ValidateToken')
const router = express.Router()

router.post('/signin', users.signIn)

router.post('/signup', users.signUp)

router.get('/:id', users.getById)

router.put('/:id',ValidateToken, users.update)

router.delete('/:id',ValidateToken, users.remove)

module.exports = router