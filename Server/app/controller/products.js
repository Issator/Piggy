const { Request, Response, NextFunction } = require('express')
const Validate = require('../functions/Validate')
const { TokenValues } = require('../functions/Token')
const { CalculateCosts } = require('../functions/CalculateCosts')
const errorMessage = require('../functions/ErrorMessage')
const Product = require('../models/Product')
const Payment = require('../models/Payment')
const { ObjectId } = require('mongodb')


/**
 * Get product by id
 * @param {Request}      req  - request
 * @param {Response}     res  - response
 * @param {NextFunction} next - next function
 */
const getById = (req, res, next) => {
    /** @type {TokenValues} */
    const decoded = res.locals.decoded
    const id = req.params.id
    const full = req.query.full

    // if id received
    if (!id) {
        return res.status(400).send(errorMessage("Id not received!"))
    }

    // if id valid
    if (!ObjectId.isValid(id)) {
        return res.status(400).send(errorMessage("Id is not valid!"))
    }

    //find product
    Product.getById(id)
        .then(foundProduct => {
            // has access
            if (foundProduct.user_id != decoded._id && decoded.status != "admin") {
                return res.status(404).send(errorMessage("Permission denied!"))
            }

            //get payments
            Payment.getByProductId(id)
                .then(payments => {

                    if(!Validate.time(foundProduct.end_date)){
                        foundProduct.end_saving = true
                        Product.saved(foundProduct._id.toString())
                    }

                    // if not collected yet
                    if (!foundProduct.end_saving) {
                        try {
                            const { left, daily } = CalculateCosts(foundProduct.cost, foundProduct.end_date, payments)
                            foundProduct.left = left
                            foundProduct.daily = daily

                            if (+left == 0) {
                                foundProduct.end_saving = true
                                Product.saved(id)
                            }

                            if (full) {
                                foundProduct.payments = payments || []
                            }

                            return res.send(foundProduct)

                        } catch (error) {
                            return res.status(500).send(errorMessage("Failed to calculate payments"))
                        }
                    }
                })
                .catch(err => {
                    return res.status(500).send(errorMessage("Failed to get payments from database"))
                })



        })
        .catch(err => {
            return res.status(400).send(errorMessage("Product not found!"))
        })
}

/**
 * Get list of all user products
 * @param {Request}      req  - request
 * @param {Response}     res  - response
 * @param {NextFunction} next - next function
 */
const userProducts = (req, res, next) => {
    /** @type {TokenValues} */
    const decoded = res.locals.decoded
    const userId = req.params.id

    // if id received
    if (!userId) {
        return res.status(400).send(errorMessage("Id not received!"))
    }

    // if id valid
    if (!ObjectId.isValid(userId)) {
        return res.status(400).send(errorMessage("Id is not valid!"))
    }

    //has access
    if (userId != decoded._id && decoded.status != "admin") {
        return res.status(406).send(errorMessage("Permission denied!"))
    }

    return Product.getAll({ user_id: userId })
        .then(async foundProducts => {
            return await Promise.all(foundProducts.map(product => {
                return Payment.getByProductId(product._id.toString())
                    .then(payments => {

                        if(!Validate.time(product.end_date)){
                            product.end_saving = true
                            Product.saved(product._id)
                        }

                        // if not collected yet
                        if (!product.end_saving) {
                            try {
                                const { left, daily } = CalculateCosts(product.cost, product.end_date, payments)
                                product.left = left
                                product.daily = daily

                                if (+left == 0) {
                                    product.end_saving = true
                                    Product.saved(product._id.toString())
                                }

                            } catch (error) {
                                throw errorMessage("Failed to calculate payments")
                            }
                        }
                        return product
                    })
                    .catch(err => {
                        throw errorMessage("Fail to collect payments!")
                    })
                }))
            })
            .then(products => {
                return res.send(products)
            })
            .catch(err => {
                if(err.message){
                    return res.status(500).send(errorMessage(err.message))
                }
                return res.status(500).send(errorMessage("Fail to collect data!"))
            })
            
        
}


/**
 * Create product
 * @param {Request}      req  - request
 * @param {Response}     res  - response
 * @param {NextFunction} next - next function
 */
const post = (req, res, next) => {
    /** @type {TokenValues} */
    const decoded = res.locals.decoded
    const newProd = {
        name: req.body.name,
        cost: Number.parseFloat(req.body.cost) || null,
        end_date: req.body.end_date
    }

    //validate
    if (!newProd.name) {
        return res.status(400).send(errorMessage("Invalid product name!"))
    }

    if (!newProd.cost || newProd.cost < 0) {
        return res.status(400).send(errorMessage("Invalid cost!"))
    }

    if (!newProd.end_date || !Validate.time(newProd.end_date)) {
        return res.status(400).send(errorMessage("Invalid date!"))
    }

    const product = new Product(null,
        newProd.name,
        newProd.cost,
        newProd.end_date,
        decoded._id,
        false
    )

    product.save()
        .then(response => {
            const toSend = product.toJSON()
            toSend._id = response.insertedId
            return res.status(201).send(toSend)

        })
        .catch(err => { return res.status(400).send(errorMessage("Failed to save product!")) })
}

/**
 * Update product
 * @param {Request}      req  - request
 * @param {Response}     res  - response
 * @param {NextFunction} next - next function
 */
const update = (req, res, next) => {
    /** @type {TokenValues} */
    const decoded = res.locals.decoded
    const prodId = req.params.id
    const newProductData = {
        name: req.body.name || null,
        cost: +req.body.cost || null,
        end_date: req.body.end_date || null
    }

    if (!prodId) {
        return res.status(400).send(errorMessage("Product Id not received!"))
    }

    // if id valid
    if (!ObjectId.isValid(prodId)) {
        return res.status(400).send(errorMessage("Id is not valid!"))
    }

    //validate
    if (newProductData.cost && newProductData.cost < 0) {
        return res.status(400).send(errorMessage("Invalid cost!"))
    }

    if (newProductData.end_date && !Validate.time(newProductData.end_date)) {
        return res.status(400).send(errorMessage("Invalid date!"))
    }

    return Product.getById(prodId)
        .then(prodData => {

            if (decoded._id != prodData.user_id && decoded.status != "admin") {
                return res.status(406).send(errorMessage("Permission denied!"))
            }

            const newData = { ...prodData, _id: prodId, ...newProductData }
            const updatedProduct = Product.create(newData)

            return updatedProduct.save()
                .then(result => {
                    console.log(result)
                    return res.status(200).send(updatedProduct.toJSON())
                })
                .catch(err => {
                    console.log(err)
                    return res.status(400).send(errorMessage("Failed update product!"))
                })
        })
        .catch(err => {
            return res.status(400).send(errorMessage("Product not found!"))
        })
}

/**
 * Delete product
 * @param {Request}      req  - request
 * @param {Response}     res  - response
 * @param {NextFunction} next - next function
 */
const remove = (req, res, next) => {
    /** @type {TokenValues} */
    const decoded = res.locals.decoded
    const prodId = req.params.id

    if (!prodId) {
        return res.status(400).send(errorMessage("Product Id not received!"))
    }

    // if id valid
    if (!ObjectId.isValid(prodId)) {
        return res.status(400).send(errorMessage("Id is not valid!"))
    }

    return Product.getById(prodId)
        .then(prodData => {

            if (!prodData) {
                return res.status(400).send({ message: "Product not found!" })
            }

            if (decoded._id != prodData.user_id && decoded.status != "admin") {
                return res.status(406).send(errorMessage("Permission denied!"))
            }

            // delete product
            return Product.getAndDeleteById(prodId)
                .then(product => {
                    if (!product) {
                        return res.status(400).send({ message: "Product not found!" })
                    }

                    //delete payments
                    return Payment.deleteByProductId(prodId)
                                .then(result => {
                                    return res.send(product)
                                })
                                .catch(err => {
                                    return res.send({product, message: "Failed to delete payments!"})
                                })
                })
                .catch(err => {
                    console.log("DELETE ERROR", err)
                    return res.status(400).send({ message: "Failed to delete product!" })
                })
        })
        .catch(err => {
            return res.status(400).send(errorMessage("Fail to get product!"))
        })
}

/**
 * Send payment for product
 * @param {Request}      req  - request
 * @param {Response}     res  - response
 * @param {NextFunction} next - next function
 */
const payment = (req, res, next) => {
    /** @type {TokenValues} */
    const decoded = res.locals.decoded
    const prodId = req.body.id
    const amount = +req.body.amount

    if (!prodId) {
        return res.status(400).send(errorMessage("Product Id not received!"))
    }

    // if id valid
    if (!ObjectId.isValid(prodId)) {
        return res.status(400).send(errorMessage("Id is not valid!"))
    }

    if (!amount || amount <= 0) {
        return res.status(400).send(errorMessage("Invalid amount data!"))
    }

    return Product.getById(prodId)
        .then(product => {
            // if exist
            if (!product) {
                return res.status(400).send(errorMessage("Product dont exist!"))
            }

            // check permission
            if (decoded._id != product.user_id && decoded.status != "admin") {
                return res.status(406).send(errorMessage("Permission denied!"))
            }

            // get payments
            const payment = new Payment(null,prodId,new Date().toISOString(),amount)
            payment.save()
                .then(response => {
                    const paymentId = response.insertedId
                    const toSend = payment.toJSON()
                    toSend._id = paymentId
                    return res.status(201).send(payment)
                })
                .catch(err => {
                    return res.status(500).send(errorMessage("Failed to create payment"))
                })
        })
        .catch(err => {
            return res.status(500).send(errorMessage("Failed to get product from database!"))
        })
}

module.exports = {
    getById,
    post,
    update,
    remove,
    payment,
    userProducts
}