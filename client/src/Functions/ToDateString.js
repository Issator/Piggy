/**
 * Unified to date string function
 * @param {Date|String} date date
 * @return {string} date 
 */
export default function toDateString(date){
    const options = {
            weekday: "long",
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric"
        }
    return new Date(date).toLocaleString("pl-PL", options)
}