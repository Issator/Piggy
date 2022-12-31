import ProductCard from "../Components/Cards/ProductCard"
import NewProductCard from "../Components/Cards/NewProductCard"
import { useContext, useEffect, useState } from "react"
import productServer from "../Servers/productServer"
import UserContext from "../Context/User"
import NewProductModal from "../Components/Modal/NewProductModal"
import Spinner from "../Components/Utils/Spinner"

export default function MainPage(){
    const [products, setProducts] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [loading, setLoading] = useState(true)
    const userCtx = useContext(UserContext)

    useEffect(() => {
        const data = {...userCtx.data}
        if(data.id && data.token){
            productServer.getUsersProducts(data.id,data.token)
                         .then(response => setProducts(response.data))
                         .catch(error => console.error(error.response))
                         .finally(setLoading(false))
        }
    }, [userCtx])

    const refresh = () => {
        setLoading(true)
        const data = {...userCtx.data}
        if(data.id && data.token){
            productServer.getUsersProducts(data.id,data.token)
                         .then(response => setProducts(response.data))
                         .catch(error => console.error(error.response))
                         .finally(setLoading(false))
        }
    }

    const reloadProduct = (id,status) => {
        if(status == "UPDATE"){
            productServer.getById(id, userCtx.data.token)
                         .then(response => {
                            const data = response.data
                            // find and replace
                            const allProducts = [...products]
                            const foundIdx = allProducts.findIndex(product => product._id == response.data._id)
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

            if(data.end_saving){
                return null
            }
            
            return (
                <ProductCard name={data.name} 
                             cost={data.cost} 
                             end_date={data.end_date}
                             left={data.left}
                             daily={data.daily}
                             key={data._id}
                             id={data._id}
                             end_saving={data.end_saving}
                             view_mode={data.end_saving}
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
                {loading && <Spinner className="full-center" color="primary" style={{width: "4rem", height: "4rem", borderWidth: "0.5rem"}}/>}
            </div>
        </div>
    )
}