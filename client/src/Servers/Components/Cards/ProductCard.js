import {BiCalendar, BiMoney} from 'react-icons/bi'
import Card from './Card'
/**
 * Display product in simple card view
 * @param {Product} props product data
 */
export default function ProductCard(props){
    return (
        <Card>
            <div className="card-body">

                <h3>{props.name}</h3>

                <p title='Kwota / pozostało'>
                    <BiMoney/> : <span className='text-primary-dark'>{props.cost}</span>/{props.left}
                </p>

                <p title="data zakupu">
                    <BiCalendar/> : {props.end_date}
                </p>

                <div className='form-group mb-2'>
                    <label htmlFor="amount">Odłóż kwotę</label>
                    <input type="number" className="form-control" id="amount" defaultValue={props.daily}/>
                </div>
                <button className="btn btn-primary" type="button">Odłóż</button>
            </div>
        </Card>
    )
}