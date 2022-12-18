import { useContext, useEffect, useState } from "react";
import UserContext from "../../Context/User";
import productServer from "../../Servers/productServer";
import Modal from "./Modal";
import price from "../../Functions/Price"

/**
 * return for receiving validation result
 * @callback OnChange on change function
 * @param {("DELETE"|"UPDATE")} status function status
 * @param {Object} data update data, if status is "UPDATE"
 */

/**
 * Modal for product details
 *
 * @param {Object}   props 
 * @param {Function} props.onClose - on modal close function
 * @param {number}   props.id      - product id
 * @param {OnChange} props.change  - change product
 */
export default function ProductsDetailsModal({onClose,id,change}){
    const userCtx = useContext(UserContext)
    const [product, setProduct] = useState({})

    useEffect(() => {
        productServer.getById(id, userCtx.data.token, true)
                     .then(response => setProduct(response.data))
                     .catch(err => console.log(err))
    }, [])

    const deleteProduct = () => {
        change("DELETE")
    }

    const paymentList = () => {
        const {payments} = product
        if (!payments || payments.length == 0){
            return "Brak"
        }

        return (
            <div className="border border-2 rounded-1" style={{height: '200px', overflowY: "auto"}}>  
            {
                payments.map(payment => {
                return (
                    <div key={payment.id} className="p-1">
                        <p className="p-0 m-0 fw-bold">Numer: {payment.id}</p>
                        <p className="p-0 m-0">Data: {payment.date ? new Date(payment.date).toLocaleDateString() : "N/A"}</p>
                        <p className="p-0 m-0">kwota: {price(payment.amount)}</p>
                    </div>
                )
                })
            }
            </div>
        )
    }


    return <Modal onClose={onClose}>
        <div className="card" style={{width: "25rem"}}>
                <div className="card-body border border-2 border-primary rounded-2 m-1">
                    <h3 className="text-center">
                        {product.name}
                    </h3>

                    <hr/>
                    <h5>Dane</h5>
                    <ul>
                        <li>Koszt: {price(product.cost)}</li>
                        <li>Data zakupu: {product.end_date ? new Date(product.end_date).toLocaleDateString() : "N/A"}</li>
                        <li>Pozostało: {price(product.left)}</li>
                    </ul>

                    <hr/>
                    <h5>Płatności</h5>               
                    {paymentList()}
                    <hr/>
                    <div className="d-flex justify-content-between">
                        <button type="button" 
                                className="btn btn-secondary-dark" 
                                style={{width: '120px'}}
                        >Edytuj</button>

                        <button type="button" 
                                className="btn btn-danger" 
                                style={{width: '120px'}}
                                onClick={deleteProduct}
                        >Usuń</button>
                    </div>
                </div>
            </div>
    </Modal>
}