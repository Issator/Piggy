import axios from "axios";
import { AxiosResponse } from "axios";
import SERVER from "./serverConfig";

/**
 * get products detail by id
 * 
 * @param {string|number} id     - product id
 * @param {boolean}       full   - return full data of product (default false)
 * @param {string}        token  - user token
 *
 * @returns {Promise<AxiosResponse<any,any>>} server response
 */
const getById = (id,token,full = false) => {
    const path = SERVER + "/products/" + id + (full ? "?full=true" : "" )
    return axios.get(path, {headers: {token: token}})
}

/**
 * add product to server
 * 
 * @param {Object}        productData            product data
 * @param {string}        productData.name     - product name
 * @param {string|number} productData.cost     - product cost
 * @param {date}          productData.end_date - product end date
 * 
 * @param {string} token user token
 *
 * @returns {Promise<AxiosResponse<any,any>>} server response
 */
const post = (productData,token) => {
    return axios.post(SERVER + "/products/add", productData, {headers: {token: token}})
}


/**
 * Update product data. 
 * Require at lest one product value
 * 
 * @param {string|number} id - product id
 * 
 * @param {Object}        productData            product data
 * @param {string}        productData.name     - product name
 * @param {string|number} productData.cost     - product cost
 * @param {date}          productData.end_date - product end date
 * 
 * @param {string} token - user token
 *
 * @returns {Promise<AxiosResponse<any,any>>} server response
 */
const update = (id, productData, token) => {
    return axios.put(SERVER + "/products/" + id, productData, {headers: {token: token}})
}


/**
 * Delete product
 * 
 * @param {string|number} id - product id
 * 
 * @param {string} token - user token
 *
 * @returns {Promise<AxiosResponse<any,any>>} server response
 */
const remove = (id,token) => {
    return axios.delete(SERVER + "/products/" + id, {headers: {token: token}})
}

/**
 * add payment to product
 * 
 * @param {Object}        payment        payment
 * @param {string|number} payment.id     - product id
 * @param {string|number} payment.amount - payment amount
 * 
 * @param {string} token user token
 *
 * @returns {Promise<AxiosResponse<any,any>>} server response
 */
const payment = (payment, token) => {
    return axios.post(SERVER + "/products/payment", payment, {headers: {token: token}})
}

/**
 * get all user products
 * 
 * @param {string} id    - payment
 * @param {string} token - user token
 *
 * @returns {Promise<AxiosResponse<any,any>>} server response
 */
const getUsersProducts = (id, token) => {
    return axios.get(SERVER + "/products/getUsers/" + id, {headers: {token: token}})
}

const productServer = {
    getById,
    post,
    update,
    remove,
    payment,
    getUsersProducts
}

export default productServer