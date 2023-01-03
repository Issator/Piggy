import { useContext, useEffect, useState } from "react"
import userServer from "../Servers/userServer"
import UserContext from "../Context/User"
import MainSpinner from "../Components/Utils/MainSpinner"
import DeleteAccount from "../Components/Forms/DeleteAccount"

export default function UserPage({ id: user_id, onDelete }) {
    const userCtx = useContext(UserContext)
    const [userData, setUserData] = useState({})
    const [alert, setAlert] = useState({ status: null, message: null })
    const [loading, setLoading] = useState(true)
    const [showDelete, setShowDelete] = useState(false)

    useEffect(() => {
        if (user_id) {
            userServer.getById(user_id)
                .then(response => setUserData(response.data))
                .catch(error => console.log(error))
                .finally(setLoading(false))
        }
    }, [user_id])

    /**
     * submit form
     * @param {import("react").FormEvent<HTMLFormElement>} e
     */
    const formSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget);
        const data = {}
        for (let [key, value] of formData.entries()) {
            data[key] = value
        }

        userServer.update(user_id, data, userCtx.data.token)
            .then(response => setAlert({ message: "Dane zmienione!", status: "success" }))
            .catch(error => {
                if (error.response && error.response.data.message) {
                    setAlert({ message: error.response.data.message, status: "danger" })
                } else {
                    setAlert({ message: "Błąd edycji konta!", status: "danger" })
                    console.log(error)
                }
            })
    }

    const showDeleteForm = () => {
        setShowDelete(true)
    }

    const AccountDeletedHandler = (user_id) => {
        if(onDelete){
            onDelete(user_id)
        }else{
            userCtx.logout()
        }
    }

    return (
        <div className="row p-0 m-2 justify-content-center">
            <div style={{ width: '600px' }}>

                <h3 className="text-center">Moje konto</h3>
                <div className="card row m-2 p-2">
                    <form onSubmit={formSubmit}>
                        <h3 className="mt-3 mb-3 ">Ustawienia Konta</h3>
                        <div className="form-group mb-1">
                            <label htmlFor="email">Email</label>
                            <input type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                placeholder="Podaj email"
                                defaultValue={userData.email}
                                disabled
                            />
                        </div>
                        <div className="form-group mb-1">
                            <label htmlFor="login">Login</label>
                            <input type="text"
                                className="form-control"
                                id="login"
                                name="login"
                                placeholder="Podaj login"
                                defaultValue={userData.login}
                            />
                        </div>
                        <div className="form-group mb-1">
                            <label htmlFor="password">Hasło</label>
                            <input type="password"
                                className="form-control"
                                id="password"
                                name="password"
                                placeholder="Podaj nowe hasło" />
                        </div>
                        <div className="mt-2 d-flex justify-content-between">
                            <button type="submit" className="btn btn-primary">Zapisz zmiany</button>
                            {!showDelete &&
                                <button type="button" className="btn btn-danger" onClick={showDeleteForm}>Usuń konto</button>
                            }
                        </div>

                        {alert.status && alert.message &&
                            <div className={`alert alert-${alert.status} mt-2 text-center`} role="alert">
                                {alert.message}
                            </div>
                        }

                        {showDelete && (
                            <div className="mt-2">
                                <hr/>
                                <h5>Usuń konto</h5>
                                <DeleteAccount id={user_id} onDelete={AccountDeletedHandler}/>
                            </div>
                        )}
                    </form>
                </div>
            </div>
            {loading && <MainSpinner/>}
        </div>
    )
}