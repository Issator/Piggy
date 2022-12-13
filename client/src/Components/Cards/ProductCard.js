import { useContext, useEffect, useState } from 'react'
import {BiCalendar, BiMoney} from 'react-icons/bi'
import UserContext from '../../Context/User'
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

    const submitPayment = (e) => {
        e.preventDefault()

        const toSend = {
            id: props.id,
            amount: amount
        }

        props.reload(props.id)

        productServer.payment(toSend,userCtx.data.token)
                     .then(response => props.reload(props.id))
                     .catch(err => console.log(err.response))
    }

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

    return (
        <Card>
            <div className="card-body">

                <h3 className="pe-pointer" onClick={() => setShowModal(true)}>{props.name}</h3>

                <p title='Kwota / pozostało'>
                    <BiMoney/> : <span className='text-primary-dark'>{props.cost}</span>/{props.left}
                </p>

                <p title="data zakupu">
                    <BiCalendar/> : {props.end_date}
                </p>

                <div className='form-group mb-2'>
                    <label htmlFor="amount">Odłóż kwotę</label>
                    <input type="number" 
                           className={`form-control ${!isValid && "is-invalid"}`} 
                           id="amount" 
                           value={amount} 
                           onChange={changeAmount}/>
                </div>
                <button className="btn btn-primary" type="button" disabled={!isValid} onClick={submitPayment}>Odłóż</button>
            </div>
            {showModal && <ProductsDetailsModal onClose={() => {setShowModal(false)}} id={props.id}/>}
        </Card>
    )
}