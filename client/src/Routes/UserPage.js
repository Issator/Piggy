import { useEffect, useState } from "react"
import userServer from "../Servers/userServer"

export default function UserPage({id}){
    const [userData, setUserData] = useState({})

    useEffect(() => {
        if(id){
            userServer.getById(id)
                      .then(response => setUserData(response.data))
                      .catch(error => console.log(error))
        }
    }, [id])
    return (
        <div className="row p-0 m-2 justify-content-center">
            <div style={{width: '600px'}}>

            <h3 className="text-center">Moje konto</h3>
            <div className="card row m-2 p-2">
            <form>
                <h3 className="mt-3 mb-3 ">Ustawienia Konta</h3>
                <div className="form-group mb-1">
                    <label htmlFor="email">Email</label>
                    <input type="email" 
                           className="form-control" 
                           id="email" 
                           name="email"
                           placeholder="Podaj email" 
                           defaultValue={userData.email}
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
                           placeholder="Podaj nowe hasło"/>
                </div>
                <div className="mt-2">
                    <button type="submit" className="btn btn-primary">Zapisz zmiany</button>
                </div>

                {/* {alert.status && alert.message &&
                    <div className={`alert alert-${alert.status} mt-2 text-center`} role="alert">
                    {alert.message}
                    </div>
                } */}
            </form>
            </div>
            </div>
        </div>
    )
}