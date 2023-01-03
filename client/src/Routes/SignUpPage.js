import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../Components/Utils/Spinner";
import ServerError from "../Servers/serverError";
import userServer from "../Servers/userServer";

/**
 * Page for signup users
 */
export default function SignUpPage() {
    const navigate = useNavigate()

    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")

    const [alert, setAlert] = useState(false)

    const [isLoginValid, setLoginValid] = useState(true)
    const [isPasswordValid, setPasswordValid] = useState(true)
    const [isEmailValid, setEmailValid] = useState(true)

    const [signUpLoading, setSignUpLoading] = useState(false)

    /**
     * Validate login if correct
     * @param {string} value - email
     * @returns {boolean} - email validation result
     */
    const validateEmail = (value) => {
        const regex = /^\w+@[a-zA-Z_]+?(\.[a-zA-Z]+)*?\.[a-zA-Z]{2,3}$/
        const result = regex.test(value)
        setEmailValid(result)
        return result
    }

    /**
     * Validate login if correct
     * @param {string} value - login
     * @returns {boolean} - login validation result
     */
    const validateLogin = (value) => {
        const result = (value !== "")
        setLoginValid(result)
        return result
    }

    /**
     * Validate password if correct
     * @param {string} value - password
     * @returns {boolean} - password validation result
     */
     const validatePassword = (value) => {
        const regex = /^(?=.*[0-9])(?=.*[~!@#$%^&*_\-+=|:;<>,.?])(?=.*[a-z])(?=.*[A-Z])(?=.{8,})/
        const result = regex.test(value)
        setPasswordValid(result)
        return result
    }

    /**
     * handle email change
     * @param {React.ChangeEvent<HTMLInputElement>} e - Input event
     */
    const handleEmailChange = (e) => {
        const {value} = e.target
        validateEmail(value)
        setEmail(value)
    }

    /**
     * handle login change
     * @param {React.ChangeEvent<HTMLInputElement>} e - Input event
     */
    const handleLoginChange = (e) => {
        const {value} = e.target
        validateLogin(value)
        setLogin(value)
    }

    /**
     * handle password change
     * @param {React.ChangeEvent<HTMLInputElement>} e - Input event
     */
    const handlePasswordChange = (e) => {
        const {value} = e.target
        validatePassword(value)
        setPassword(value)
    }

    /**
     * handle login button click.
     * Send request fro creating account to server
     * @param {React.ChangeEvent<HTMLButtonElement>} e - Button event
     */
    const handleButtonClick = (e) => {
        setSignUpLoading(true)
        e.preventDefault()

        const loginResult    = validateLogin(login)
        const emailResult    = validateEmail(email)
        const passwordResult = validatePassword(password)

        if(!loginResult || !emailResult || !passwordResult){
            setSignUpLoading(false)
            return
        }

        const toSend = {
            login,password,email
        }

        console.log(toSend)
        userServer.signUp(toSend).then(response => {
            navigate('/signin', {state: {success: true}})
        }).catch(err => {
            const error = ServerError(err)
            if(error){
                setAlert(error)
            }
            setSignUpLoading(false)
        })

    }

    return (
        <div className="full-center pb-5">
            <div>
                <h3 className="text-center p-2">Rejestracja</h3>
                <div className="card" style={{ minWidth: "30rem" }}>
                    <div className="card-body p-1">
                        {/* --- Email --- */}
                        <div className="form-group p-1">
                            <label htmlFor="emailInput">Email</label>
                            <input type="email"
                                className={"form-control mt-1 mb-1 " + (isEmailValid ? "" : "is-invalid")}
                                id="emailInput"
                                placeholder="podaj email..." 
                                value={email}
                                onChange={handleEmailChange}/>
                        </div>

                        {/* --- Login --- */}
                        <div className="form-group p-1">
                            <label htmlFor="loginInput">Login</label>
                            <input type="text"
                                className={"form-control mt-1 mb-1 " + (isLoginValid ? "" : "is-invalid")}
                                id="loginInput"
                                placeholder="podaj login..." 
                                value={login}
                                onChange={handleLoginChange}/>
                        </div>

                        {/* --- Hasło --- */}
                        <div className="form-group p-1">
                            <label htmlFor="passwordInput">Hasło</label>
                            <input type="password"
                                className={"form-control mt-1 mb-1 " + (isPasswordValid ? "" : "is-invalid")}
                                id="passwordInput"
                                placeholder="podaj hasło..." 
                                value={password}
                                onChange={handlePasswordChange}/>
                            <small className="form-text ms-1">Hasło musi mieć min. 8 znaków, małą i dużą literę, liczbę i znak specjalny</small>
                        </div>

                        <div className="form-group p-1">
                            <button className="btn btn-primary w-100 mt-3" onClick={handleButtonClick} disabled={signUpLoading}>
                                {!signUpLoading ? "Zarejestruj się" : <Spinner color="white"/>}
                            </button>

                            {alert &&
                                <div className="alert alert-danger mt-2 text-center" role="alert">
                                    {alert}
                                </div>
                            }
                        </div>
                    </div>
                    <div className="card-footer">
                        <div className="text-center">Masz już konto? <Link to="/signin">Zaloguj się!</Link></div>
                    </div>
                </div>
            </div>
        </div>
    )
}