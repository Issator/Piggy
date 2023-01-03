import { useContext, useEffect, useState } from 'react'
import {BiCalendar, BiCoin, BiCoinStack, BiMoney} from 'react-icons/bi'
import UserContext from '../../Context/User'
import price from '../../Functions/Price'
import productServer from '../../Servers/productServer'
import ProductsDetailsModal from '../Modal/ProductsDetailsModal'
import Card from './Card'
/**
 * Display product in simple card view
 * @param {Product} props product data
 */
export default function ProductCard(props){
    const userCtx = useContext(UserContext)
    const [amount, setAmount] = useState(props.daily)
    const [isValid, setIsValid] = useState(true)
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        if(props.daily){
            setAmount(props.daily)
        }
    }, [props])

    /**
     * Submit payment handler
     * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} e event
     */
    const submitPayment = (e) => {
        e.preventDefault()

        const toSend = {
            id: props.id,
            amount: amount
        }

        props.reload(props.id)
        productServer.payment(toSend,userCtx.data.token)
                     .then(response => props.reload(props.id,"UPDATE"))
                     .catch(err => console.log(err.response))
    }

    /**
     * Change amount handler
     *
     * @param {import('react').ChangeEvent<HTMLInputElement>} e event
     */
    const changeAmount = (e) => {
        const amount = e.target.value
        setAmount(amount)

        // validate
        if(+amount <= 0 ){
            if(isValid) {setIsValid(false)}
        }else{
            if(!isValid) {setIsValid(true)}
        }
    }

    /**
     * handle change request from modal
     *
     * @param {"DELETE"|"UPDATE"} status request status
     */
    const handleChange = (status) => {
        if(status == "DELETE"){
            productServer.remove(props.id,userCtx.data.token)
                         .then(response => props.reload(props.id,"DELETE"))
                         .catch(err => console.log(err.response))
        }else if(status == "UPDATE"){
            props.reload(props.id,"UPDATE")
        }
    }

    /**
     * display bottom of card
     */
    const bottomCard = () => {
        if(!props.view_mode){
            return (
                <>
                    <div className='form-group my-2'>
                        <label htmlFor="amount">Odłóż kwotę</label>
                        <input type="number" 
                            className={`form-control ${!isValid && "is-invalid"}`} 
                            id="amount" 
                            value={amount} 
                            onChange={changeAmount}/>
                    </div>
                    <button className="btn btn-primary" type="button" disabled={!isValid} onClick={submitPayment}>Odłóż</button>
                </>
            )
        }else{
            const color = props.end_saving ? "alert-success" : "alert-primary"
            const text = props.end_saving ? "Zakończone" : "W trakcie"
            return (
                <div className={'text-center alert ' + color }>{text}</div>
            )
        }
    }

    return (
        <Card>
            <div className="card-body d-flex flex-column">
                <div className="mb-auto">
                    <h3 className="pe-pointer clamp-2 m-0 text-primary pe-pointer" onClick={() => setShowModal(true)}>{props.name}</h3>

                    <p className='m-0' title='Kwota'>
                        <BiCoinStack/> : {price(props.cost)}
                    </p>

                    <p className='m-0' title='Pozostało'>
                        <BiCoin/> : {price(props.left)}
                    </p>

                    <p className="m-0" title="data zakupu">
                        <BiCalendar/> : {props.end_date}
                    </p>

                </div>


                <div>
                    {bottomCard()}
                </div>
                </div>
            {showModal && <ProductsDetailsModal onClose={() => {setShowModal(false)}} id={props.id} change={handleChange} view_mode={props.view_mode}/>}
        </Card>
    )
}