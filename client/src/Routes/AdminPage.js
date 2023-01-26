import { useEffect, useState } from "react"
import { BiHistory } from "react-icons/bi"
import Modal from "../Components/Modal/Modal"
import MainSpinner from "../Components/Utils/MainSpinner"
import userServer from "../Servers/userServer"
import ProductsHistory from "./ProductsHistory"
import UserPage from "./UserPage"
import { FaUser } from "react-icons/fa"

/**
 * Page for admins only. Used for check user information and changing it
 */
export default function AdminPage(){
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [modalContent, setModalContent] = useState(null)

    useEffect(() => {
        getUserData()
    }, [])

    /**
     * Reload user list
     */
    const reloadList = () => {
        setLoading(true)
        getUserData()
    }

    /**
     * Get all users from server
     */
    const getUserData = () => {
        userServer.getAll()
                  .then(response => setUsers(response.data))
                  .catch(err => console.log(err))
                  .finally(() => setLoading(false))
    }

    /**
     * Remove user from list
     * @param {string} user_id
     */
    const userRemovedHandler = (user_id) => {
        const filtered = [...users].filter(user => user._id != user_id)
        setModalContent(null)
        setUsers(filtered)
    }

    const historyModal = (user) => {
        setModalContent(<ProductsHistory user_id={user._id}/>)
    }

    const userModal = (user) => {
        setModalContent(<UserPage id={user._id} onDelete={userRemovedHandler}/>)
    }

    const CloseModal = () => {
        setModalContent(null)
    }

    const userCard = (user) => {
        return (
            <div className="card p-1 my-2 shadow-sm" key={user._id}>
                <div className="d-flex justify-content-between">
                    <div>
                        <p className="p-0 m-0"><b>Id:    </b> {user._id}     </p>
                        <p className="p-0 m-0"><b>Login: </b> {user.login}  </p>
                        <p className="p-0 m-0"><b>Email: </b> {user.email}  </p>
                        <p className="p-0 m-0"><b>Status: </b>{user.status} </p>
                    </div>
                    <div className="btn-group">
                        <button type="button" onClick={() => historyModal(user)} className="btn btn-secondary-dark p-4"><BiHistory size={'40px'}/></button>
                        <button type="button" onClick={() => userModal(user)} className="btn btn-secondary-dark p-4"><FaUser size={'40px'}/></button>
                    </div>
                </div>
            </div>
        )
    }

    return(
        <div className="row p-0 m-0 justify-content-center">
            <h3 className="text-center">Panel administratora</h3>
            <div className="row">
                <button className="btn btn-primary" type="button" onClick={reloadList}>Odśwież Listę</button>
            </div>
            <div>
                {users && users.map(user => {
                    return userCard(user)
                })}
            </div>
            {loading && <MainSpinner/>}
            {modalContent && (
                <Modal onClose={CloseModal}>
                    <div className="card p-2" style={{width: "32rem", minHeight: "20rem", maxHeight: "42rem", overflow: "auto"}}>
                        {modalContent}
                    </div>
                </Modal>
            )}
        </div>
    )
}