 /**
 * Payment data
 * @typedef {Object} PaymentData
 * @property {number} _id        - payment id
 * @property {number} product_id - product id
 * @property {Date} pay_date     - date of payment
 * @property {number} amount     - payment amount
 */

 const { getDB } = require("../../config/mongo")
 const { ObjectId } = require('mongodb')

 class Payment {
    constructor(_id, product_id, pay_date, amount) {
        this._id = _id ? ObjectId(_id) : null
        this.product_id = product_id
        this.pay_date = pay_date
        this.amount = amount
    }

    save() {
        const db = getDB()

        if(this._id) {
            return db.collection('payments')
                     .updateOne({_id: this._id}, {$set: this})
                     .then(result => {return result})
                     .catch(err => {throw err})
        }else{
            return db.collection('payments')
                    .insertOne(this)
                    .then(result => {return result})
                    .catch(err => {throw err})
        }
    }

    toJSON() {
        const json = {
            _id: this._id,
            product_id: this.product_id,
            pay_date: this.pay_date,
            amount: this.amount
        }

        return json
    }

    static create(object) {
        const {_id, product_id, pay_date, amount} = object
        return new Payment(_id, product_id, pay_date, amount)
    }

    static getAll(filters) {
        const db = getDB()
        return db.collection('payments').find(filters).toArray()
                 .then(products => {return products})
                 .catch(err => {throw err})
    }

    static getByProductId(product_id) {
        const db = getDB()
        return db.collection('payments').find({product_id: product_id}).toArray()
                 .then(products => {return products})
                 .catch(err => {throw err})
    }

    static deleteById(id) {
        const db = getDB()
        return db.collection('payments').deleteOne({_id: ObjectId(id)})
                 .then(response => {
                     return response
                 })
                 .catch(err => {throw err})
    }

    static deleteByProductId(product_id) {
        const db = getDB()
        return db.collection('payments').deleteMany({product_id: ObjectId(product_id)})
                 .then(response => {
                     return response
                 })
                 .catch(err => {throw err})
    }

    static getById(id) {
        const db = getDB()
        return db.collection('payments').findOne({_id: ObjectId(id)})
                 .then(product => {
                    return product
                 })
                 .catch(err => {throw err})
    }
 }

 module.exports = Payment