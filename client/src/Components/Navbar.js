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
        <nav className="row position-sticky top-0 bg-white border border-3 rounded-4 border-primary p-2 m-1" style={{zIndex: "100"}}>
            <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                    <img src="piggy.png" style={{width: '50px', height: 'auto'}}/>
                    <h3 className="ms-2">Piggy</h3>
                </div>
                <Dropdown text={userCtx.data.login} id="accountDropdown" className="btn btn-outline-primary border border-white rounded-4">
                    <div className="dropdown-item pe-pointer">Produkty</div>
                    <div className="dropdown-item pe-pointer">Ustawienia konta</div>
                    <div className="dropdown-item pe-pointer" onClick={logoutButton}>Wyloguj się</div>
                </Dropdown>
            </div>
        </nav>
    )
}