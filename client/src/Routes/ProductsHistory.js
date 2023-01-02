import { useContext, useEffect, useState } from "react"
import ProductCard from "../Components/Cards/ProductCard"
import MainSpinner from "../Components/Utils/MainSpinner"
import UserContext from "../Context/User"
import productServer from "../Servers/productServer"

export default function ProductsHistory({user_id}){
    const [products, setProducts] = useState([])
    const userCtx = useContext(UserContext)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const data = {...userCtx.data}
        const gotId = user_id || data.id
        if(gotId && data.token){
            productServer.getUsersProducts(gotId,data.token)
                         .then(response => setProducts(response.data))
                         .catch(error => console.error(error.response))
                         .finally(() => setLoading(false))
        }
    }, [userCtx])

    const reloadProduct = (id,status) => {
        if(status == "DELETE"){
            const allProducts = [...products]
            const foundIdx = allProducts.findIndex(product => product._id == id)
            if(foundIdx != -1){
                allProducts.splice(foundIdx, 1)
                setProducts(allProducts)
            }else{
                console.log("Failed to remove product:" + id)
            }
        }
    }

    const mapProducts = () => {
        const generate = (data) => {
            
            return (
                <ProductCard name={data.name} 
                             cost={data.cost} 
                             end_date={data.end_date}
                             left={data.left}
                             daily={data.daily}
                             key={data._id}
                             id={data._id}
                             end_saving={data.end_saving}
                             view_mode={true}
                             reload={reloadProduct}
                             />
            )
        }

        if(products.length == 0){
            return <h5 className=" text-center">Brak produktów</h5>
        }

        return products.map(product => {return generate(product)})
    }

    return(
        <div className="row p-0 m-0 justify-content-center">
            <h3 className="text-center">Historia produktów</h3>
            <div className="row m-0 p-0">
                {mapProducts()}
            </div>
            {loading && <MainSpinner/>}
        </div>
    )
}