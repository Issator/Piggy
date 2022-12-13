import { useContext } from "react";
import { useLocation } from "react-router-dom";
import UserContext from "../Context/User";
import Dropdown from "./Dropdown";

/** on with routes navbar should be hidden */
const HIDE_ON_PAGE = ["/signup", "/signin", "/resetPassword", "/testArea"]

export default function Navbar(){
    const userCtx = useContext(UserContext)

    // Hide navbar if route in HIDE_ON_PAGE 
    const location = useLocation()
    const contain = HIDE_ON_PAGE.filter(path => path === location.pathname)
    if(contain.length > 0){
        return;
    }

    const logoutButton = () => {
        userCtx.logout()
    }

    return (
        <nav className="row bg-white border-bottom border-3 border-primary p-2 m-0">
            <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                    <img src="piggy.png" style={{width: '50px', height: 'auto'}}/>
                    <h3 className="ms-2">Piggy</h3>
                </div>
                <Dropdown text={userCtx.data.login} id="accountDropdown" className="btn btn-outline-primary">
                    <div className="dropdown-item pe-pointer">Produkty</div>
                    <div className="dropdown-item pe-pointer">Ustawienia konta</div>
                    <div className="dropdown-item pe-pointer" onClick={logoutButton}>Wyloguj się</div>
                </Dropdown>
            </div>
        </nav>
    )
}