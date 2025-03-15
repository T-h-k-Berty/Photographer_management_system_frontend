import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Components/Login/LoginPage";
import SignUp from "./Components/SignUp/SignUp";
import PhotographerSignUp from "./Components/SignUp/Photographer";
import ClientSignUp from "./Components/SignUp/ClientSignUp";
import TopBar from "./Components/Photographer/TopBar/TopBar";
import Home from "./Components/Photographer/Home/Home";
import PopularPhotographers from "./Components/Photographer/Popular_Phptographer/PopularPhotographer";
import "./Style/main.css";                             // Custom Styles

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Default Route */}
        <Route path="/topbar" element={<TopBar />} />

        {/* Login Page Route */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/PhotographerSignUp" element={<PhotographerSignUp />} />
        <Route path="/ClientSignUp" element={<ClientSignUp />} />
        <Route path="/PhotographerHome" element={<Home />} />
        <Route path="/PopularPhotographer" element={<PopularPhotographers />} />


  
      </Routes>
    </Router>
  );
};

export default App;
