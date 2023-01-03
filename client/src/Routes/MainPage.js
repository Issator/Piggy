import ProductCard from "../Components/Cards/ProductCard"
import NewProductCard from "../Components/Cards/NewProductCard"
import { useContext, useEffect, useState } from "react"
import productServer from "../Servers/productServer"
import UserContext from "../Context/User"
import NewProductModal from "../Components/Modal/NewProductModal"
import MainSpinner from "../Components/Utils/MainSpinner"

/**
 * Main page displayed on main root
 */
export default function MainPage(){
    const [products, setProducts] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [loading, setLoading] = useState(true)
    const userCtx = useContext(UserContext)

    useEffect(() => {
        const data = {...userCtx.data}
        if(data._id && data.token){
            productServer.getUsersProducts(data._id,data.token)
                         .then(response => setProducts(response.data))
                         .catch(error => console.error(error.response))
                         .finally(() => setLoading(false))
        }
    }, [userCtx])

    /**
     * refresh products list
     */
    const refresh = () => {
        setLoading(true)
        const data = {...userCtx.data}
        productServer.getUsersProducts(data._id,data.token)
                     .then(response => setProducts(response.data))
                     .catch(error => console.error(error.response))
                     .finally(() => setLoading(false))
    }

    /**
     * reload product data
     * @param {string} id
     * @param {"UPDATE"|"DELETE"} status
     */
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

    /**
     * Map products list
     */
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
                {loading && <MainSpinner/>}
            </div>
        </div>
    )
}