import { createContext, useEffect, useState } from "react"
import userServer from "../Servers/userServer"

const UserContext = createContext({
    data: {
        _id: 0,
        login: "",
        email: "",
        token: "",
        status: ""
    },

    isLogged: false,

    login: (login, password) => {},
    logout: () => {},
    update: (data) => {},
    clear: () => {}
})

export function UserProvider(props) {
    const [userData, setUserData] = useState({})
    const isLogged = !!JSON.parse(localStorage.getItem("tokenData"))

    useEffect(() => {
        try{
            loadData()
        }catch(err){
            console.log("Fail To collect data! Data removed!")
            clearData()
        }
    }, [])

    const update = (newData) => {
        const allData = {...userData, ...newData}
        setUserData(allData)
    }

    const loginUser = (login,password) => {
        return userServer.signIn({login,password})
                         .then(response => {
                            const {_id,token} = response.data
                            getUserData(_id).then(userDetails => {
                                const toSave = {...userDetails, token}
                                localStorage.setItem("tokenData", JSON.stringify({_id: _id,token}))
                                setUserData(toSave)
                                return null
                            }).catch(err => {throw err})
                         }).catch(err => {throw err})
    }

    const getUserData = (id) => {
        return userServer.getById(id)
                         .then(response => {return response.data})
                         .catch(err => {throw  err})
    }

    const loadData = () => {
        const tokenData = JSON.parse(localStorage.getItem("tokenData"))
        if(tokenData && tokenData._id && tokenData.token){
            getUserData(tokenData._id).then(userData => {
                setUserData({...userData,...tokenData})
            }).catch(err => {
                throw "Fail to receive data!"
            })
        }
    }

    const clearData = () => {
        localStorage.removeItem("tokenData")
        setUserData({})
    }

    const userContext = {
        data: userData,
        isLogged: isLogged,

        login: loginUser,
        logout: clearData,
        update: update,
        clear: clearData
    }

    return (
        <UserContext.Provider value={userContext}>
            {props.children}
        </UserContext.Provider>
    )
}

export default UserContext