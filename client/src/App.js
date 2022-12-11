import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MainPage from "./Routes/MainPage";
import Navbar from "./Components/Navbar"
import SignInPage from "./Routes/SignInPage";
import "./styles.css"
import SignUpPage from "./Routes/SignUpPage";
import { useContext } from "react";
import UserContext from "./Context/User";

function App() {
  const isLogged = useContext(UserContext).isLogged
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/"       element={isLogged ? <MainPage/> : <Navigate to={"/signin"}/> }/>
        <Route path="/signin" element={!isLogged ? <SignInPage/> : <Navigate to={"/"}/> }/>
        <Route path="/signup" element={!isLogged ? <SignUpPage/> : <Navigate to={"/"}/> }/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
