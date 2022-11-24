const express = require('express')
const users = require('../controller/users')
const router = express.Router()

router.post('/signin', users.signIn)

router.post('/signup', users.signUp)

router.get('/:id', users.getById)

router.put('/:id', users.update)

router.delete('/:id', users.remove)

module.exports = router