import { useContext, useEffect } from "react";
import UserContext from "../../Context/User";
import productServer from "../../Servers/productServer";
import Modal from "./Modal";

/**
 * Modal for product details
 *
 * @param {Object}   props 
 * @param {Function} props.onClose - on modal close function
 * @param {number}   props.id      - product id
 */
export default function({onClose,id}){
    const userCtx = useContext(UserContext)
    const currentDate = new Date().toISOString().split('T')[0]

    useEffect(() => {
        productServer.getById(id, userCtx.data.token, true)
                     .then(response => console.log(response.data))
    }, [])


    return <Modal onClose={onClose}>
        <div className="card" style={{width: "25rem"}}>
                <div className="card-body">
                    <h3 className="text-center">
                        Dodaj nowy produkt
                    </h3>
                </div>
            </div>
    </Modal>
}