export default function price(value){

    let result
    try{
        result = (+value).toFixed(2) + " zł"
    } catch(e){
        result = "0"
    }

    return result
}