 /**
 * Product data
 * @typedef {Object} ProductData
 * @property {number} _id         - product id
 * @property {string} name        - product name
 * @property {number} cost        - product cost
 * @property {string} end_date    - saving end date
 * @property {number} user_id     - user id
 * @property {boolean} end_saving - is product saved
 */

const { getDB } = require("../../config/mongo")
const { ObjectId } = require('mongodb')

class Product {
    constructor(_id, name, cost, end_date, user_id, end_saving) {
        this._id = _id ? ObjectId(_id) : null
        this.name = name
        this.cost = +cost
        this.end_date = end_date
        this.user_id = user_id
        this.end_saving = !!end_saving
    }

    save() {
        const db = getDB()

        if(this._id) {
            return db.collection('products')
                     .updateOne({_id: this._id}, {$set: this})
                     .then(result => {return result})
                     .catch(err => {throw err})
        }else{
            return db.collection('products')
                    .insertOne(this)
                    .then(result => {return result})
                    .catch(err => {throw err})
        }
    }

    toJSON() {
        const json = {
            _id: this._id,
            name: this.name,
            cost: this.cost,
            end_date: this.end_date,
            user_id: this.user_id,
            end_saving: this.end_saving
        }
        return json
    }

    static create(object){
        const {_id, name, cost, end_date, user_id, end_saving} = object
        return new Product(_id, name, cost, end_date, user_id, end_saving)
    } 

    static getAll(filters) {

        const db = getDB()
        return db.collection('products').find(filters).toArray()
                 .then(products => {return products})
                 .catch(err => {throw err})
    }

    static deleteById(id) {
        const db = getDB()
        return db.collection('products').deleteOne({_id: ObjectId(id)})
                 .then(response => {
                     return response
                 })
                 .catch(err => {throw err})
    }

    static getAndDeleteById(id) {
        const db = getDB()
        return db.collection('products').findOneAndDelete({_id: ObjectId(id)})
                 .then(response => {
                     return response.value
                 })
                 .catch(err => {throw err})
    }

    static getById(id) {
        const db = getDB()
        return db.collection('products').findOne({_id: ObjectId(id)})
                 .then(product => {
                    return product
                 })
                 .catch(err => {throw err})
    }

    static saved(id) {
        const db = getDB()
        db.collection('products').updateOne({_id: ObjectId(id)}, {$set: {end_saving: true}})
    }
}

module.exports = Product