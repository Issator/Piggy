const jwt = require('jsonwebtoken')
const { JWT_KEY } = require('../../config/config')

 /**
 * User data
 * @typedef {Object} TokenValues
 * @property {number} id               - user id
 * @property {string} login            - user login
 * @property {("user"|"admin")} status - user status
 */

/**
 * Generate user token 
 * @param {UserData} userData - user data
 * @returns {string} jwt token
 */
const generate = (userData) => {
    return jwt.sign({_id: userData._id, login: userData.login, status: userData.status}, JWT_KEY)
}

exports.Token = {
    generate
}