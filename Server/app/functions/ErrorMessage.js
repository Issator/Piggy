/**
 * Unified error message object
 *
 * @param {string} message - main message of error
 * @param {Object} details - error details
 */
const errorMessage = (message, details) => {
    const toSend = {}
    
    toSend.message = message || "Unknown error!"
    if(details){ toSend.details = details}

    return toSend
}

module.exports = errorMessage