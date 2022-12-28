import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import UserContext from "../Context/User";
import Dropdown from "./Dropdown";

/** on with routes navbar should be hidden */
const HIDE_ON_PAGE = ["/signup", "/signin", "/resetPassword", "/testArea"]

export default function Navbar(){
    const userCtx = useContext(UserContext)
    const navigate = useNavigate()

    // Hide navbar if route in HIDE_ON_PAGE 
    const location = useLocation()
    const contain = HIDE_ON_PAGE.filter(path => path === location.pathname)
    if(contain.length > 0){
        return;
    }

    const logoutButton = () => {
        userCtx.logout()
    }

    const gotoHistory = () => {
        navigate("history")
    }

    return (
        <nav className="row position-sticky top-0 bg-white border border-3 rounded-4 border-primary p-2 m-1" style={{zIndex: "100"}}>
            <div className="d-flex justify-content-between align-items-center">
                <Link to={"/"} className="d-flex align-items-center text-black text-decoration-none">
                    <img src="piggy.png" style={{width: '50px', height: 'auto'}}/>
                    <h3 className="ms-2">Piggy</h3>
                </Link>
                <div>
                    <button type="button" className="btn btn-outline-primary rounded-4 me-2" onClick={gotoHistory}>Historia</button>
                    <button type="button" className="btn btn-primary rounded-4" onClick={logoutButton}>Wyloguj się</button>
                </div>
            </div>
        </nav>
    )
}