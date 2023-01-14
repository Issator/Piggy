const {Request, Response, NextFunction } = require('express')
const jwt = require('jsonwebtoken')
const { JWT_KEY } = require('../../config/config')

/**
 * Validate and decode token
 * @param {Request}      req  - request
 * @param {Response}     res  - response
 * @param {NextFunction} next - next function
 */
exports.ValidateToken = (req, res, next) => {
    const token = req.headers.token

    //if token received
    if(!token){
        return res.status(400).send({message: "Token not received!"})
    }

    jwt.verify(token, JWT_KEY, (err, decoded) => {
        // validate token
        if(err) {
            return res.status(400).send({message: "Invalid token!"})
        }else{
            res.locals.decoded = decoded
            return next()
        }
    })
}