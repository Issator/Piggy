/**
 * change given number into price
 *
 * @param {number} value
 * @return {string} 
 */
export default function price(value){

    let result
    try{
        result = (+value).toFixed(2) + " zł"
    } catch(e){
        result = "0 zł"
    }

    return result
}