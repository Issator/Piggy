import { useContext, useState } from "react";
import UserContext from "../../Context/User";
import productServer from "../../Servers/productServer";
import Modal from "./Modal";
import serverError from "../../Servers/serverError"

/**
 * Modal for new product
 *
 * @param {Object}   props 
 * @param {Function} props.onClose - on modal close function
 * @param {Function} props.refresh - refresh products
 */
export default function({onClose,refresh}){
    const userCtx = useContext(UserContext)
    const currentDate = new Date().toISOString().split('T')[0]

    const [name, setName] = useState("")
    const [cost, setCost] = useState(0)
    const [date, setDate] = useState(currentDate)

    const [alert, setAlert] = useState("")

    const submitData = (e) => {
        e.preventDefault()

        const data = {
            name: name,
            cost: cost,
            end_date: date
        }

        const err = entryValidation(data)

        if(err){
            setAlert(err)
            return
        }

        productServer.post(data,userCtx.data.token)
                     .then(response => {
                        refresh()
                        onClose()
                     })
                     .catch(err => {
                        const error = serverError(err)
                        if(error){
                            setAlert(error)
                        }else{
                            console.log(err)
                            setAlert("Produkt nie został dodany!")
                        }
                     })
    }

    const entryValidation = (data) => {
        if(data.name == ""){
            return "Podaj nazwę produktu!"
        }

        if(!data.cost || data.cost <= 0){
            return "Podaj Kwotę!"
        }

        if(!data.end_date){
            return "Podaj date"
        }

        return null
    }

    return <Modal onClose={onClose}>
        <div className="card" style={{width: "25rem"}}>
                <div className="card-body">
                    <h3 className="text-center">
                        Dodaj nowy produkt
                    </h3>
                    {/* Product name */}
                    <div className="form-group">
                        <label htmlFor="productName">Nazwa produktu</label>
                        <input type="text" 
                               className="form-control"
                               id="productName"
                               placeholder="podaj nazwę produktu"
                               value={name}
                               onChange={e => setName(e.target.value)}/>
                    </div>

                    {/* Cost */}
                    <div className="form-group">
                        <label htmlFor="productCost">Kwota</label>
                        <input type="number" 
                               className="form-control"
                               id="productCost"
                               placeholder="podaj kwotę"
                               value={cost}
                               onChange={e => setCost(e.target.value)}/>
                    </div>

                    {/* End date */}
                    <div className="form-group">
                        <label htmlFor="productDate">Planowana data zakupu</label>
                        <input type="date" 
                               className="form-control"
                               id="productDate"
                               min={currentDate}
                               value={date}
                               onChange={e => setDate(e.target.value)}/>
                    </div>

                    <div className="w-100 mt-3">
                        <button className="btn btn-primary w-100" onClick={submitData}>Dodaj</button>
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