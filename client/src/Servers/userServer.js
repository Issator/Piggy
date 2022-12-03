import axios from "axios";
import { AxiosResponse } from "axios";
import SERVER from "./serverConfig";

/**
 * Get user data by id
 *
 * @param {number|string} id user id
 * @returns {Promise<AxiosResponse<any,any>>} server response
 */
const getById = (id) => {
    return axios.get(SERVER + "/users/" + id)
}


/**
 * Sign up user into server
 *
 * @param {Object} userData user data
 * @param {string} userData.email    - user email
 * @param {string} userData.login    - user login
 * @param {string} userData.password - user password
 * @returns {Promise<AxiosResponse<any,any>>} server response
 */
const signUp = (userData) => {
    return axios.post(SERVER + "/users/signup", userData)
}


/**
 * Login user into server
 *
 * @param {Object} userData user data
 * @param {string} userData.login    - user login
 * @param {string} userData.password - user password
 * @returns {Promise<AxiosResponse<any,any>>} server response
 */
const signIn = (userData) => {
    return axios.post(SERVER + "/users/signin", userData)
}

/**
 * Update user.
 * Require at least one user value
 * 
 * @param {string|number} id user id
 *
 * @param {Object} userData user data
 * @param {string} userData.login    - user login
 * @param {string} userData.password - user password
 * 
 * @param {string} token user token
 * @returns {Promise<AxiosResponse<any,any>>} server response
 */
const update = (id,userData,token) => {
    return axios.put(SERVER + "/users/" + id, userData, {headers: {token: token}})
}

/**
 * dElete user from server.
 * Require user or admin server to conform
 *
 * @param {string} password password
 * @param {string} token token
 */
const remove = (id, password, token) => {
    return axios.delete(SERVER + "/users/" + id, password, {headers: {token: token}})
}

const userServer = {
    getById,
    signIn,
    signUp,
    update,
    remove
}

export default userServer