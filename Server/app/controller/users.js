const {Request, Response, NextFunction} = require('express')
const _data = require('../../data/users.json')
const Validate = require('../functions/Validate')
const jwt = require('jsonwebtoken')
const { JWT_KEY } = require('../../config/config')

/**
 * Get user by id
 * @param {Request}      req  - request
 * @param {Response}     res  - response
 * @param {NextFunction} next - next function
 */
const getById = (req, res, next) => {
    const {id} = req.params
    const found = _data.find(user => user.id == id)
    if(found){
        const toSend = {...found}
        delete toSend.password
        return res.send(toSend)
    }else{
        return res.status(400).send({message: "User not found!"})
    }
}

/**
 * SignUp user. Require login, email and password in body
 * @param {Request}      req  - request
 * @param {Response}     res  - response
 * @param {NextFunction} next - next function
 */
const signUp = (req, res, next) => {

    // should create user
    const newUser = {
        login: req.body.login,
        password: req.body.password,
        email: req.body.email
    }

    // validate
    const result = Validate.postUser(newUser)
    if(!result){
        return res.status(400).send({message: "Validation failed!"})
    }
    
    // email already exist
    const foundEmail = _data.find(user => user.email == newUser.email)
    if(foundEmail){
        return res.status(400).send({message: "Email already used!"})
    }

    // user already exist
    const foundLogin = _data.find(user => user.login == newUser.login)
    if(foundLogin){
        return res.status(400).send({message: "User already exist!"})
    }

    newUser.id = (+_data[_data.length-1]?.id || 0) + 1
    newUser.status = "user"
    _data.push(newUser)
    return res.status(201).send(newUser)
}

/**
 * SignIn user. Require login and password in body
 * @param {Request}      req  - request
 * @param {Response}     res  - response
 * @param {NextFunction} next - next function
 */
const signIn = (req, res, next) => {

    // get data
    const {login, password} = req.body
    if(!login || !password){
        return res.status(400).send({message: "Missing data!"})
    }

    // find user by login
    const foundUser = _data.find(user => user.login == login)
    if(!foundUser){
        return res.status(400).send({message: "User not exist!"})
    }

    // is password correct
    if(foundUser.password == password){
        foundUser.token = jwt.sign({id: foundUser.id, login: foundUser.login}, JWT_KEY)
        return res.send(foundUser)
    }else{
        return res.status(400).send({message: "Invalid password!"})
    }
}

/**
 * update user
 * @param {Request}      req  - request
 * @param {Response}     res  - response
 * @param {NextFunction} next - next function
 */
const update = (req, res, next) => {
    const {login, password } = req.body
    const {token} = req.headers
    const {id} = req.params

    // no token
    if(!token){
        return res.status(400).send("No token received!")
    }
    
    // verify token
    jwt.verify(token, JWT_KEY, (err, decoded) => {
        // found who send request
        const requestUser = _data.find(user => user.id == decoded.id)
        
        // if invalid token
        if(err){
            return res.status(400).send({message: "Invalid token!"})
        }   
        
        //if no access
        if(requestUser.id != id && requestUser.status != "admin"){
            return res.status(406).send({message: "Access denied!"})
        }
        
        //get user
        const found = _data.find(user => user.id == id)
        if(!found){
            return res.status(400).send({message: "User not found!"})
        }

        // if no data received
        if(!login && !password){
            return res.status(400).send("No data received! Required login or password!")
        }



        // change data
        if(login)   { found.login = login }
        if(password){ 
            if(Validate.password(password)){
                found.password = password 
            }else{
                return res.status(400).send({message: "Invalid new password!"})
            }
        }

        return res.status(200).send(found)
    })


    // Should update user by given id
    // PUT user/:ID
    res.send("Update user")
}

/**
 * remove user
 * @param {Request}      req  - request
 * @param {Response}     res  - response
 * @param {NextFunction} next - next function
 */
const remove = (req, res, next) => {
    // Should delete user by given id
    // DEL user/:ID
    res.send("Delete user")
}

module.exports = {
    getById,
    signIn,
    signUp,
    update,
    remove
}