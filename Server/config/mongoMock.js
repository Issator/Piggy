const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
    mongoClient.connect(globalThis.__MONGO_URI__)
               .then(responseClient => {
                        _client = responseClient.db(globalThis.__MONGO_DB_NAME__)
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