import ProductCard from "../Components/Cards/ProductCard"
import NewProductCard from "../Components/Cards/NewProductCard"
import { useContext, useEffect, useState } from "react"
import productServer from "../Servers/productServer"
import UserContext from "../Context/User"
import NewProductModal from "../Components/Modal/NewProductModal"

export default function MainPage(){
    const [products, setProducts] = useState([])
    const [showModal, setShowModal] = useState(false)
    const userCtx = useContext(UserContext)

    useEffect(() => {
        const data = {...userCtx.data}
        if(data.id && data.token){
            productServer.getUsersProducts(data.id,data.token)
                         .then(response => setProducts(response.data))
                         .catch(error => console.error(error.response))
        }
    }, [userCtx])

    const refresh = () => {
        const data = {...userCtx.data}
        if(data.id && data.token){
            productServer.getUsersProducts(data.id,data.token)
                         .then(response => setProducts(response.data))
                         .catch(error => console.error(error.response))
        }
    }

    const reloadProduct = (id,status) => {
        if(status == "UPDATE"){
            productServer.getById(id, userCtx.data.token)
                         .then(response => {
                            const data = response.data
                            // find and replace
                            const allProducts = [...products]
                            const foundIdx = allProducts.findIndex(product => product.id == response.data.id)
                            if(foundIdx != -1){
                                allProducts[foundIdx] = data
                                setProducts(allProducts)
                            }else{
                                console.log("Failed to update product:" + id)
                            }
                         })
                         .catch(error => console.error(error.response))
        }

        if(status == "DELETE"){
            const allProducts = [...products]
            const foundIdx = allProducts.findIndex(product => product.id == id)
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
                             key={data.id}
                             id={data.id}
                             reload={reloadProduct}
                             />
            )
        }

        return products.map(product => {return generate(product)})
    }


    return (
        <div className="row p-0 m-0 justify-content-center">
            <div className="row m-0 p-0">
                {mapProducts()}
                <NewProductCard onClick={() => setShowModal(true)}/>
                {showModal && <NewProductModal onClose={() => {setShowModal(false)}} refresh={refresh}/>}
            </div>
        </div>
    )
}