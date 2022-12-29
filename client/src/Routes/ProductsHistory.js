import { useContext, useEffect, useState } from "react"
import ProductCard from "../Components/Cards/ProductCard"
import UserContext from "../Context/User"
import productServer from "../Servers/productServer"

export default function ProductsHistory(){
    const [products, setProducts] = useState([])
    const userCtx = useContext(UserContext)

    useEffect(() => {
        const data = {...userCtx.data}
        if(data.id && data.token){
            productServer.getUsersProducts(data.id,data.token)
                         .then(response => setProducts(response.data))
                         .catch(error => console.error(error.response))
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

        return products.map(product => {return generate(product)})
    }

    return(
        <div className="row p-0 m-0 justify-content-center">
            <h3 className="text-center">Historia produktów</h3>
            <div className="row m-0 p-0">
                {mapProducts()}
            </div>
        </div>
    )
}