import { useContext, useEffect, useState } from "react";
import UserContext from "../../Context/User";
import productServer from "../../Servers/productServer";
import Modal from "./Modal";
import price from "../../Functions/Price"
import UpdateProductForm from "../Forms/UpdateProductFrom";
import ServerError from "../../Servers/serverError";
import toDateString from "../../Functions/ToDateString";

/**
 * return for receiving validation result
 * @callback OnChange on change function
 * @param {("DELETE"|"UPDATE")} status function status
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
    const [editMode, setEditMode] = useState(false)
    const [editValue, setEditValue] = useState({})
    const [alert, setAlert] = useState("")

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
                payments.map((payment, index) => {
                return (
                    <div key={payment._id} className="p-1">
                        <p className="p-0 m-0 fw-bold">Numer: {index + 1}</p>
                        <p className="p-0 m-0">Data: {payment.pay_date ? toDateString(payment.pay_date) : "N/A"}</p>
                        <p className="p-0 m-0">kwota: {price(payment.amount)}</p>
                    </div>
                )
                })
            }
            </div>
        )
    }

    const editButtonPressed = () => {
        if(!editMode){
            setEditMode(true)
        }else{
            productServer.update(id,editValue,userCtx.data.token)
                     .then(response => {
                        change("UPDATE")
                        onClose()
                     })
                     .catch(err => {
                        const error = ServerError(err)
                        if(error){
                            setAlert(error)
                        }else{
                            console.log(err)
                            setAlert("Produkt nie został zmieniony!")
                        }
                     })
        }
    }

    const handleEditChange = (data) => {
        setEditValue(data)
    }

    const details = () => {
        // show edit mode or data
        if(editMode){
            return(
                <UpdateProductForm product={product} onChange={handleEditChange}/>
            )
        }else{
            return(
                <ul>
                    <li>nazwa: {product.name}</li>
                    <li>Koszt: {price(product.cost)}</li>
                    <li>Pozostało: {price(product.left)}</li>
                    <li>Data zakupu: {product.end_date ? new Date(product.end_date).toLocaleDateString() : "N/A"}</li>
                </ul>
            )
        }


    }


    return <Modal onClose={onClose}>
        <div className="card" style={{width: "25rem"}}>
                <div className="card-body border border-2 border-primary rounded-2 m-1">
                    <h3 className="text-center">
                        {product.name}
                    </h3>

                    <hr/>
                    <h5>Dane</h5>
                    {details()}

                    <hr/>
                    <h5>Płatności</h5>               
                    {paymentList()}
                    <hr/>
                    <div className="d-flex justify-content-between">
                        <button type="button" 
                                className="btn btn-secondary-dark" 
                                style={{width: '120px'}}
                                onClick={editButtonPressed}
                        >Edytuj</button>

                        <button type="button" 
                                className="btn btn-danger" 
                                style={{width: '120px'}}
                                onClick={deleteProduct}
                        >Usuń</button>
                    </div>

                    {
                        alert && <div className={`alert alert-danger mt-2 mb-0 text-center`} role="alert">
                            {alert}
                        </div>
                    }
                </div>
            </div>
    </Modal>
}