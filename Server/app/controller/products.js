const {Request, Response, NextFunction, json} = require('express')
const _products = require('../../data/products.json')
const Validate = require('../functions/Validate')
const jwt = require('jsonwebtoken')
const { JWT_KEY } = require('../../config/config')

/**
 * Get product by id
 * @param {Request}      req  - request
 * @param {Response}     res  - response
 * @param {NextFunction} next - next function
 */
const getById = (req, res, next) => {
    const id = req.params.id
    const token = req.headers.token

    jwt.verify(token, JWT_KEY, (err, decoded) => {
        // validate token
        if(err) {
            return res.status(400).send({message: "Invalid token"})
        }

        //find product
        const foundProduct = _products.find(product => product.id == id)
        if(!foundProduct){
            return res.status(400).send({message: "Product not found!"})
        }

        if(foundProduct.user_id != decoded.id){
            return res.status(404).send({message: "Permission denied!"})
        }

        return res.send(foundProduct)
    })
}


/**
 * Create product
 * @param {Request}      req  - request
 * @param {Response}     res  - response
 * @param {NextFunction} next - next function
 */
const post = (req, res, next) => {
    const token = req.headers.token
    const newProd = {
        name: req.body.name,
        cost: Number.parseFloat(req.body.cost) || null,
        end_date: req.body.end_date
    }

    //validate
    if(!newProd.name){
        return res.status(400).send({message: "Invalid product name!"})
    }

    if(!newProd.cost || newProd.cost < 0){
        return res.status(400).send({message: "Invalid cost!"})
    }

    if(!newProd.end_date || !Validate.time(newProd.end_date)){
        return res.status(400).send({message: "Invalid date!"})
    }

    //verify token
    jwt.verify(token, JWT_KEY, (err, decoded) => {
        //if invalid
        if(err) {return res.status(400).send({message: "Invalid token!"})}

        //TODO: Add admin logic

        newProd.user_id = decoded.id
        newProd.id = (+_products[_products.length-1]?.id || 0) + 1
        newProd.end_savings = false

        _products.push(newProd)
        return res.status(201).send(newProd)
    })
}

/**
 * Update product
 * @param {Request}      req  - request
 * @param {Response}     res  - response
 * @param {NextFunction} next - next function
 */
const update = (req, res, next) => {
    const token = req.headers.token
    const prodId = req.params.id
    const newProductData = {
        name: req.body.name || null,
        cost: +req.body.cost || null,
        end_date: req.body.end_date || null
    }

    if(!prodId){
        return res.status(400).send({message: "Product Id not received!"})
    }

    if(!token){
        return res.status(400).send({message: "Token not received!"})
    }

    //validate
    if(newProductData.cost && newProductData.cost < 0){
        return res.status(400).send({message: "Invalid cost!"})
    }

    if(newProductData.end_date && !Validate.time(newProd.end_date)){
        return res.status(400).send({message: "Invalid date!"})
    }

    //verify token
    jwt.verify(token, JWT_KEY, (err, decoded) => {
        //if invalid
        if(err) {return res.status(400).send({message: "Invalid token!"})}

        const found = _products.find(product => product.id == prodId)
        if(!found){
            return res.status(400).send({message: "Product not found!"})
        }

        //TODO: Add admin logic
        if(decoded.id != found.user_id){
            return res.status(406).send({message: "Permission denied!"})
        }

        found.cost = newProductData.cost || found.cost
        found.name = newProductData.name || found.name
        found.end_date = newProductData.end_date || found.end_date

        return res.send(found)
    })
}

/**
 * Delete product
 * @param {Request}      req  - request
 * @param {Response}     res  - response
 * @param {NextFunction} next - next function
 */
const remove = (req, res, next) => {
    const token = req.headers.token
    const prodId = req.params.id

    if(!prodId){
        return res.status(400).send({message: "Product Id not received!"})
    }

    if(!token){
        return res.status(400).send({message: "Token not received!"})
    }

    //verify token
    jwt.verify(token, JWT_KEY, (err, decoded) => {
        //if invalid
        if(err) {return res.status(400).send({message: "Invalid token!"})}

        const foundIndex = _products.findIndex(product => product.id == prodId)
        if(foundIndex == -1){
            return res.status(400).send({message: "Product not found!"})
        }

        //TODO: Add admin logic
        if(decoded.id != _products[foundIndex].user_id){
            return res.status(406).send({message: "Permission denied!"})
        }

        const toDelete = _products[foundIndex]
        _products.splice(foundIndex,1)
        return res.send(toDelete)
    })
}

module.exports = {
    getById,
    post,
    update,
    remove
}