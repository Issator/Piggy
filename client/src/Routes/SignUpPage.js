import { Link } from "react-router-dom";

export default function SignUpPage() {
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
                                className={"form-control mt-1 mb-1 "}
                                id="emailInput"
                                placeholder="podaj email..."/>
                        </div>

                        {/* --- Login --- */}
                        <div className="form-group p-1">
                            <label htmlFor="loginInput">Login</label>
                            <input type="text"
                                className={"form-control mt-1 mb-1 "}
                                id="loginInput"
                                placeholder="podaj login..."/>
                        </div>

                        {/* --- Hasło --- */}
                        <div className="form-group p-1">
                            <label htmlFor="passwordInput">Hasło</label>
                            <input type="password"
                                className={"form-control mt-1 mb-1 "}
                                id="passwordInput"
                                placeholder="podaj hasło..."/>
                        </div>

                        <div className="form-group p-1">
                            <button className="btn btn-primary w-100 mt-3">
                                        Zarejestruj się
                            </button>
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