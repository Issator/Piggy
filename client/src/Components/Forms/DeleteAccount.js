import { useContext, useState } from "react"
import UserContext from "../../Context/User"
import userServer from "../../Servers/userServer"

export default function DeleteAccount({id,onDelete}){
    const userCtx = useContext(UserContext)
    const [password, setPassword] = useState("")
    const [alert, setAlert] = useState(null)

    /**
     * Handle password change
     * @param {import("react").ChangeEvent<HTMLInputElement>} e event
     */
    const handleChange = (e) => {
        setPassword(e.target.value)
    }

    /**
     * on delete form submit
     * @param {import("react").MouseEvent<HTMLButtonElement>} e event
     */
    const onSubmit = (e) => {
        e.preventDefault()

        userServer.remove(id, password, userCtx.data.token)
                  .then(response => {onDelete(id)})
                  .catch(error => {
                    if (error.response && error.response.data && error.response.data.message){
                        setAlert(error.response.data.message)
                    }else{
                        console.log(error)
                        setAlert("Failed to delete user!")
                    }
                  })
    }
    return (
        <div className="card border-danger">
            <div className="form-group p-3">
                <label htmlFor="conformPassword">Hasło</label>
                <input type="password"
                    className="form-control"
                    id="conformPassword"
                    name="password"
                    placeholder="Podaj hasło"
                    value={password}
                    onChange={handleChange}
                />
                <div className="d-flex justify-content-between mt-1">
                    <p className="card-text text-danger">Uwaga! Konto zostanie usunięte na zawsze!</p>
                    <button type="button" 
                            className="btn btn-danger" 
                            onClick={onSubmit}
                            disabled={password.length == 0}>Usuń konto</button>
                </div>

                {alert &&
                    <div className="alert alert-danger mt-2 text-center" role="alert">
                        {alert}
                    </div>
                }

            </div>
        </div>
    )
}