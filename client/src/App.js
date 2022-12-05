import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "./Routes/MainPage";
import Navbar from "./Components/Navbar"
import SignInPage from "./Routes/SignInPage";
import "./styles.css"
import SignUpPage from "./Routes/SignUpPage";

function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element={<MainPage/>}/>
        <Route path="/signin" element={<SignInPage/>}/>
        <Route path="/signup" element={<SignUpPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
