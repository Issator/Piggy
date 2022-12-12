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

    const mapProducts = () => {
        const generate = (data) => {
            return (
                <ProductCard name={data.name} 
                             cost={data.cost} 
                             end_date={data.end_date}
                             left={data.left}
                             daily={data.daily}
                             key={data.id}
                             />
            )
        }

        return products.map(product => {return generate(product)})
    }


    return (
        <div>
            <div>
                {mapProducts()}
                <NewProductCard onClick={() => setShowModal(true)}/>
                {showModal && <NewProductModal onClose={() => {setShowModal(false)}}/>}
            </div>
        </div>
    )
}