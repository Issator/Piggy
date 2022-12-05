import { useLocation } from "react-router-dom";
import Dropdown from "./Dropdown";

/** on with routes navbar should be hidden */
const HIDE_ON_PAGE = ["/signup", "/signin", "/resetPassword", "/testArea"]

export default function Navbar(){

    // Hide navbar if route in HIDE_ON_PAGE 
    const location = useLocation()
    const contain = HIDE_ON_PAGE.filter(path => path === location.pathname)
    if(contain.length > 0){
        return;
    }

    return (
        <nav className="row bg-primary text-white p-2 m-0">
            <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                    <img src="piggy.png" style={{width: '50px', height: 'auto'}}/>
                    <h3 className="ms-2">Piggy</h3>
                </div>
                <Dropdown text="konto" id="accountDropdown" className="btn btn-primary">
                    <div className="dropdown-item">Produkty</div>
                    <div className="dropdown-item">Ustawienia konta</div>
                    <div className="dropdown-item">Wyloguj się</div>
                </Dropdown>
            </div>
        </nav>
    )
}