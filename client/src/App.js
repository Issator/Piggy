import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MainPage from "./Routes/MainPage";
import Navbar from "./Components/Navbar"
import SignInPage from "./Routes/SignInPage";
import "./styles.css"
import SignUpPage from "./Routes/SignUpPage";
import { useContext } from "react";
import UserContext from "./Context/User";
import ProductsHistory from "./Routes/ProductsHistory";
import UserPage from "./Routes/UserPage";
import AdminPage from "./Routes/AdminPage";

function App() {
  const {isLogged, data} = useContext(UserContext)

  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/"        element={isLogged ? <MainPage/> : <Navigate to={"/signin"}/> }/>
        <Route path="/signin"  element={!isLogged ? <SignInPage/> : <Navigate to={"/"}/> }/>
        <Route path="/signup"  element={!isLogged ? <SignUpPage/> : <Navigate to={"/"}/> }/>
        <Route path="/history" element={isLogged ? <ProductsHistory/> : <Navigate to={"/"}/> }/>
        <Route path="/account" element={isLogged ? <UserPage id={data._id}/> : <Navigate to={"/"}/> }/>
        <Route path="/admin"   element={isLogged ? <AdminPage/> : <Navigate to={"/"}/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
