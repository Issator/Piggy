import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function SignInPage() {
    const location = useLocation()

    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")

    const [isLoginValid, setLoginValid] = useState(true)
    const [isPasswordValid, setPasswordValid] = useState(true)

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
        e.preventDefault()

        const loginResult = validateLogin(login)
        const passwordResult = validatePassword(password)

        if(!loginResult || !passwordResult){
            console.error("Niepoprawne dane logowania!")
            return
        }

        const toSend = {
            login,password
        }
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
                                    onClick={handleButtonClick}>
                                Zaloguj się
                            </button>
                        </div>
                    </div>

                    <div className="card-footer">
                        <div className="text-center">nie masz konta? <Link to="/signup">Zarejestruj się!</Link></div>
                    </div>

                    { location.state && location.state.success &&
                        <div className="alert alert-success mt-2 text-center" role="alert">
                            Konto utworzone pomyślnie!
                        </div>
                    }

                </div>
            </div>
        </div>
    )
}