export default function ServerError(err){
    if(err.response && err.response.data){
        const data = err.response.data

        if(data.message){
            return data.message
        }
    }

    return null
}