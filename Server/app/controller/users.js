const {Request, Response, NextFunction } = require('express')
const Validate = require('../functions/Validate')
const {TokenValues, Token} = require('../functions/Token')
const errorMessage = require('../functions/ErrorMessage')
const User = require('../models/User')
const { ObjectId } = require('mongodb')

/**
 * Get user by id
 * @param {Request}      req  - request
 * @param {Response}     res  - response
 * @param {NextFunction} next - next function
 */
const getById = (req, res, next) => {
    const id = req.params.id

    // if id received
    if(!id){
        res.status(400).send(errorMessage("Id not received!"))
    }

    // if id valid
    if(!ObjectId.isValid(id)){
        res.status(400).send(errorMessage("Id is not valid!"))
    }

    User.getById(id)
         .then(user => {
             if(user){
                 const toSend = {...user}
                 delete toSend.password
                 return res.send(toSend)
             }else{
                return res.status(400).send(errorMessage("User not found!"))
             }
         })
         .catch(err => {
             return res.status(500).send(errorMessage("Fail to receive user from database!"))
         })
}

/**
 * SignUp user. Require login, email and password in body
 * @param {Request}      req  - request
 * @param {Response}     res  - response
 * @param {NextFunction} next - next function
 */
const signUp = (req, res, next) => {

    // should create user
    const newUserData = {
        login: req.body.login,
        password: req.body.password,
        email: req.body.email
    }

    // validate
    const result = Validate.postUser(newUserData)
    if(!result){
        return res.status(400).send(errorMessage("Validation failed!"))
    }
    
    // email already exist
    return User.getAll({email: newUserData.email})
        .then(response => {
            if(response.length > 0){
                return res.status(400).send(errorMessage("Email already used!"))
            }

            // user already exist
            User.getAll({login: newUserData.login})
                .then(response => {
                    if(response.length > 0){
                        return res.status(400).send(errorMessage("User already exist!"))
                    }

                    const newUser = User.create(newUserData)
                    newUser.save()
                           .then(response => {
                                const toSend = newUser.toJSON()
                                toSend._id = response.insertedId
                                return res.status(201).send(toSend)
                           })
                           .catch(err => {
                                return res.status(500).send(errorMessage("Fail to create new user!"))
                            })
                })
                .catch(err => {
                    return res.status(500).send(errorMessage("Fail to get users from database!"))
                })
        })
        .catch(err => {
            return res.status(500).send(errorMessage("Fail to get users from database!"))
        })
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
        return res.status(400).send(errorMessage("Missing data!"))
    }

    // find user by login
    return User.getAll({login: login})
        .then(response => {
            const found = response[0]
            if(!found){
                return res.status(400).send(errorMessage("User not exist!"))
            }

                // is password correct
                if(found.password == password){
                    found.token = Token.generate(found)
                    delete found.password
                    return res.send(found)
                }else{
                    return res.status(400).send(errorMessage("Invalid password!"))
                }

        })
        .catch(err => {
            return res.status(500).send(errorMessage("Fail to get users from database!"))
        })
}

/**
 * update user
 * @param {Request}      req  - request
 * @param {Response}     res  - response
 * @param {NextFunction} next - next function
 */
const update = (req, res, next) => {
    /** @type {TokenValues} */
    const decoded = res.locals.decoded
    const {login, password } = req.body
    const {id} = req.params

    // if id received
    if(!id){
        return res.status(400).send(errorMessage("Id not received!"))
    }

    // if id valid
    if(!ObjectId.isValid(id)){
        return res.status(400).send(errorMessage("Id is not valid!"))
    }

    // if no data received
    if(!login && !password){
        return res.status(400).send(errorMessage("No data received! Required login or password!"))
    }

    if(password && !Validate.password(password)){ 
        return res.status(400).send(errorMessage("Invalid new password!"))
    }
    
    // found who send request
    return User.getById(decoded._id)
               .then(requestUser => {
               
                   //if no access
                   if(requestUser._id != id && requestUser.status != "admin"){
                       return res.status(406).send(errorMessage("Access denied!"))
                   }
               
                   //get user
                   User.getById(id)
                       .then(user => {
                           if(!user){
                               return res.status(400).send(errorMessage("User not found!"))
                           }

                           // is login reserved
                           User.getAll({login: login})
                               .then(users => {
                                    if(users[0]._id != id){
                                        return res.status(400).send(errorMessage("Login exist!"))
                                    }
                                    const newData = {...user, _id: id, ...{login, password}}
                                    const updatedUser = User.create(newData)
                                
                                    updatedUser.save()
                                               .then(response => {
                                                    const toSend = {...newData}
                                                    delete toSend.password
                                                    return res.status(200).send(toSend)
                                               }) 
                                               .catch(err => {
                                                    return res.status(500).send(errorMessage("Fail to update user!"))
                                               })
                               })
                               .catch(err => {
                                    return res.status(500).send(errorMessage("Fail to get user to update!"))
                            })
                               
                       })
                       .catch(err => {
                               return res.status(500).send(errorMessage("Fail to get user to update!"))
                        })
               })
               .catch(err => {
                   return res.status(500).send(errorMessage("Fail to get request user!"))
               })
}

/**
 * remove user
 * @param {Request}      req  - request
 * @param {Response}     res  - response
 * @param {NextFunction} next - next function
 */
const remove = (req, res, next) => {
    /** @type {TokenValues} */
    const decoded = res.locals.decoded
    const toDelId = req.params.id
    const {password} = req.body

    // if id received
    if(!toDelId){
        return res.status(400).send(errorMessage("Id not received!"))
    }

    // if id valid
    if(!ObjectId.isValid(toDelId)){
        return res.status(400).send(errorMessage("Id is not valid!"))
    }

    if(!toDelId)    {return res.status(400).send(errorMessage("User Id not received in params!"))}
    if(!password)   {return res.status(400).send(errorMessage("Password not received in body!"))}
        
    //find user to verify password
    return User.getById(decoded._id)
               .then(found => {
                       // no permission
                       if(found._id != toDelId && found.status != "admin"){
                           return res.status(406).send(errorMessage("Permission denied!"))
                       }

                       //verify password
                       if(found.password != password) {
                           return res.status(406).send(errorMessage("Invalid password"))
                       }
                           
                       // delete user
                       User.getAndDeleteById(toDelId)
                           .then(response => {
                               return res.send(response)
                           })
                           .catch(err => {
                               return res.status(500).send(errorMessage("Fail to delete user!"))
                           })
               })
               .catch(err => {
                   return res.status(500).send(errorMessage("Fail to get request user"))
               })
}

module.exports = {
    getById,
    signIn,
    signUp,
    update,
    remove
}