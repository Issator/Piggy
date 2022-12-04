import Dropdown from "./Dropdown";

export default function Navbar(){
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