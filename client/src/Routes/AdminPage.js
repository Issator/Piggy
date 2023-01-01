import { useEffect, useState } from "react"
import userServer from "../Servers/userServer"

export default function AdminPage(){
    const [users, setUsers] = useState([])

    useEffect(() => {
        userServer.getAll()
                  .then(response => setUsers(response.data))
                  .catch(err => console.log(err))
                  .finally(() => {console.log(users)})
    }, [])

    return(
        <div className="row p-0 m-0 justify-content-center">
            <h3 className="text-center">Panel administratora</h3>
        </div>
    )
}