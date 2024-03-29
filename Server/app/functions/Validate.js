/**
 * Validation rules
 * - 1 number
 * - 1 special character: ~!@#$%^&*_-+=|:;<>,.?
 * - 1 capital letter
 * - 1 small letter
 * - min 8 length
 *
 * @param {string} password password
 * @return {boolean} result 
 */
 const password = (password) => {
    const regex = /^(?=.*[0-9])(?=.*[~!@#$%^&*_\-+=|:;<>,.?])(?=.*[a-z])(?=.*[A-Z])(?=.{8,})/
    return regex.test(password)
}

/**
 * Validate email
 *
 * @param {string} email email
 * @return {boolean} result 
 */
const email = (email) => {
    const regex = /^\w+@[a-zA-Z_]+?(\.[a-zA-Z]+)*?\.[a-zA-Z]{2,3}$/
    return regex.test(email)
}

/**
 * Validate if date is correct.
 * Must by bigger than current date
 *
 * @param {string} date date in YYYY-MM-DD format
 */
const time = (date) => {
    const receiveDate = new Date(date)
    const currentDate = new Date()
    
    // check if correct date
    const result = (receiveDate instanceof Date && !isNaN(receiveDate.valueOf()))
    if(!result){
        return false
    }

    return currentDate < receiveDate
}

/**
 * Validate user for post request
 *
 * @param {JSON} user
 * @return {boolean} result
 */
const postUser = (user) => {
    if(!user.password || !user.login || !user.email){
        return false
    }

    if(!password(user.password)){
        return false
    }

    if(!email(user.email)){
        return false
    }

    return true
}

const Validate = {
    password,
    email,
    postUser,
    time
}

module.exports = Validate