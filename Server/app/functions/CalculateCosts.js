const Validate = require("./Validate")

/**
 * Calculate how much is left to pay and daily cost.
 *
 * @param {number}        total     - total cost
 * @param {Array<Object>} payments  - payments array
 * @param {date}          end_date  - end date
 * @throws error if amount less than 0 or date is invalid
 */
exports.CalculateCosts = (total, end_date, payments) => {
    // validate cost
    if(total < 0){
        throw "Invalid Total!"
    }
    // try create date
    const daysLeft = getDays(end_date)
    if(!daysLeft){
        throw "Invalid Date!"
    }

    //calculate payments
    const sum = payments ? payments.reduce((s, payment) => s + payment.amount, 0) : 0
    const leftToPay = total - sum

    const toSend = {
        left: leftToPay,
        daily: (leftToPay / daysLeft).toFixed(2)
    }
    return toSend
}

/**
 * Return how many days left or false if error
 *
 * @param {string} date date in string
 * @return {(number|boolean)} number of days or false if incorrect  
 */
const getDays = (date) => {
    const receiveDate = new Date(date)
    const currentDate = new Date()
    
    // check if correct date
    const result = (receiveDate instanceof Date && !isNaN(receiveDate.valueOf()))
    if(!result){
        return false
    }

    // get time left
    const timeLeft = receiveDate - currentDate
    if(timeLeft < 0){
        return false
    }

    // get days
    const daysLeft = Math.round(timeLeft / (1000 * 60 * 60 * 24))
    if(daysLeft <= 0){
        return false
    }

    //return days
    return daysLeft
}