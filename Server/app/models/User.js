 /**
 * User data
 * @typedef {Object} UserData
 * @property {number} _id               - user id
 * @property {string} login            - user login
 * @property {string} password         - user password
 * @property {string} email            - user email
 * @property {("user"|"admin")} status - user status
 */

const { getDB } = require("../../config/mongo")
const { ObjectId } = require('mongodb')

class User {
    constructor(_id, login, password, email, status) {
        this._id = _id ? ObjectId(_id) : null
        this.login = login
        this.password = password
        this.email = email
        this.status = status || "user"
    }

    save() {
        const db = getDB()

        if(this._id) {
            return db.collection('users')
                     .updateOne({_id: this._id}, {$set: this})
                     .then(result => {return result})
                     .catch(err => {throw err})
        }else{
            return db.collection('users')
                    .insertOne(this)
                    .then(result => {return result})
                    .catch(err => {throw err})
        }
    }

    toJSON() {
        const json = {
            _id: this._id,
            login: this.login,
            email: this.email,
            status: this.status
        }

        return json
    }

    static create(object){
        const {_id, login, password, email, status} = object
        return new User(_id, login, password, email, status)
    }

    static getAll(filters) {
        const db = getDB()
        return db.collection('users').find(filters).toArray()
                 .then(users => {return users})
                 .catch(err => {throw err})
    }

    static deleteById(id) {
        const db = getDB()
        
        return db.collection('users').deleteOne({_id: ObjectId(id)})
                 .then(response => {
                     return response
                 })
                 .catch(err => {throw err})
    }

    static getAndDeleteById(id) {
        const db = getDB()
        return db.collection('users').findOneAndDelete({_id: ObjectId(id)})
                 .then(response => {
                     return response.value
                 })
                 .catch(err => {throw err})
    }

    static getById(id) {
        const db = getDB()
        return db.collection('users').findOne({_id: ObjectId(id)})
                 .then(user => {
                    return user
                 })
                 .catch(err => {throw err})
    }
}

module.exports = User