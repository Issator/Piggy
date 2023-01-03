import { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import UserContext from "../Context/User";
import serverError from "../Servers/serverError"
import Spinner from "../Components/Utils/Spinner";

/**
 * Page for sign in users
 */
export default function SignInPage() {

    const location = useLocation()
    const userCtx = useContext(UserContext)

    const defaultAlert = () => {
        if(location.state && location.state.success){
            return {
                message: "Konto utworzone!", 
                type: "success"
            }
        }else{
            return {
                message: null, 
                type: null
            }
        }
    }

    const [alert, setAlert] = useState(defaultAlert())

    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")

    const [isLoginValid, setLoginValid] = useState(true)
    const [isPasswordValid, setPasswordValid] = useState(true)

    const [signInLoading, setSignInLoading] = useState(false)

    /**
     * Validate login if correct
     * @param {string} value - login
     * @returns {boolean} - login validation result
     */
    const validateLogin = (value) => {
        if (value === "") {
            setLoginValid(false)
            return false
        } else {
            setLoginValid(true)
            return true
        }
    }

    /**
     * Validate password if correct
     * @param {string} value - password
     * @returns {boolean} - password validation result
     */
    const validatePassword = (value) => {
        if (value === "") {
            setPasswordValid(false)
            return false
        } else {
            setPasswordValid(true)
            return true
        }
    }

    /**
     * handle login change
     * @param {React.ChangeEvent<HTMLInputElement>} e - Input event
     */
    const handleLoginChange = (e) => {
        const { value } = e.target
        setLoginValid(true)
        setLogin(value)
    }

    /**
     * handle password change
     * @param {React.ChangeEvent<HTMLInputElement>} e - Input event
     */
    const handlePasswordChange = (e) => {
        const { value } = e.target
        setPasswordValid(true)
        setPassword(value)
    }

    /**
     * handle login button click
     * @param {React.ChangeEvent<HTMLButtonElement>} e - Button event
     */
     const handleButtonClick = (e) => {
        setSignInLoading(true)
        e.preventDefault()

        const loginResult = validateLogin(login)
        const passwordResult = validatePassword(password)

        if(!loginResult || !passwordResult){
            console.error("Niepoprawne dane logowania!")
            return
        }

        userCtx.login(login, password)
               .catch(err => {
                const error = serverError(err)
                if(error){
                    setAlert({message:error, type:"danger"})
                }
                setSignInLoading(false)
               })
    }

    return (
        <div className="full-center pb-5">
            <div>
                <h3 className="text-center p-2">Logowanie</h3>
                <div className="card" style={{ minWidth: "30rem" }}>
                    <div className="card-body">
                        {/* --- Login --- */}
                        <div className="form-group p-1">
                            <label htmlFor="loginInput">Login</label>
                            <input type="text"
                                    className={"form-control mt-1 mb-1 " + (isLoginValid ? "" : "is-invalid")}
                                    id="loginInput"
                                    placeholder="podaj login..." 
                                    value={login}
                                    onChange={handleLoginChange}
                                    onBlur={() => validateLogin(login)}/>
                        </div>

                        {/* --- Hasło --- */}
                        <div className="form-group p-1">
                            <label htmlFor="passwordInput">Hasło</label>
                            <input type="password"
                                    className={"form-control mt-1 mb-1 " + (isPasswordValid ? "" : "is-invalid")}
                                    id="passwordInput"
                                    placeholder="podaj hasło..." 
                                    value={password}
                                    onChange={handlePasswordChange}
                                    onBlur={() => validatePassword(password)}/>
                        </div>

                        <div className="form-group p-1">
                            <button className="btn btn-primary w-100"
                                    disabled={signInLoading}
                                    onClick={handleButtonClick}>
                                {!signInLoading ? "Zaloguj się" : <Spinner color="white"/>}
                            </button>
                        </div>

                        { alert.message &&
                            <div className={`alert alert-${alert.type} mt-2 mb-0 text-center`} role="alert">
                                {alert.message}
                            </div>
                        }

                    </div>

                    <div className="card-footer">
                        <div className="text-center">nie masz konta? <Link to="/signup">Zarejestruj się!</Link></div>
                    </div>

                </div>
            </div>
        </div>
    )
}