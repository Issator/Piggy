const mongodb = require('mongodb');
const MONGO_PATH = require('../.env/mongo');
const mongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
    mongoClient.connect(MONGO_PATH)
               .then(responseClient => {
                        _db = responseClient.db()
                        callback()
                    })
               .catch(err => {
                    console.log(err)
                    throw "Failed to connect!"
                })
}

/**
 * returns mongo client if connected to bd
 *
 * @return {mongodb.Db} 
 */
const getDB = () => {
    if(_db){
        return _db
    }

    throw 'No database connection!'
}

exports.mongoConnect = mongoConnect
exports.getDB = getDB