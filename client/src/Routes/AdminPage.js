import { useEffect, useState } from "react"
import { BiHistory } from "react-icons/bi"
import Modal from "../Components/Modal/Modal"
import MainSpinner from "../Components/Utils/MainSpinner"
import userServer from "../Servers/userServer"
import ProductsHistory from "./ProductsHistory"
import UserPage from "./UserPage"
import { FaUser } from "react-icons/fa"

export default function AdminPage(){
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [modalContent, setModalContent] = useState(null)

    useEffect(() => {
        getUserData()
    }, [])

    const getUserData = () => {
        userServer.getAll()
                  .then(response => setUsers(response.data))
                  .catch(err => console.log(err))
                  .finally(() => setLoading(false))
    }

    const historyModal = (user) => {
        setModalContent(<ProductsHistory user_id={user._id}/>)
    }

    const userModal = (user) => {
        setModalContent(<UserPage id={user._id}/>)
    }

    const CloseModal = () => {
        setModalContent(null)
    }

    const userCard = (user) => {
        return (
            <div className="card p-1 my-2" key={user._id}>
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
            <div style={{maxWidth: "1200px"}}>
                {users && users.map(user => {
                    return userCard(user)
                })}
            </div>
            {loading && <MainSpinner/>}
            {modalContent && (
                <Modal onClose={CloseModal}>
                    <div className="card" style={{width: "32rem", maxHeight: "40rem", overflowY: "scroll"}}>
                        {modalContent}
                    </div>
                </Modal>
            )}
        </div>
    )
}