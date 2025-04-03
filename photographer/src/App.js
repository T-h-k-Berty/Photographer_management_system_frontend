import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Components/Login/LoginPage";
import SignUp from "./Components/SignUp/SignUp";
import PhotographerSignUp from "./Components/SignUp/Photographer";
import ClientSignUp from "./Components/SignUp/ClientSignUp";
import TopBar from "./Components/Photographer/TopBar/TopBar";
import Home from "./Components/Photographer/Home/Home";
import PopularPhotographers from "./Components/Photographer/Popular_Phptographer/PopularPhotographer";
import CreatePortfolio from "./Components/Photographer/Portfolio/CreatePortfolio";
import ViewPortfolio from "./Components/Photographer/Portfolio/ViewPortfolio";
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
        <Route path="/photographer/portfolio" element={<CreatePortfolio />} />
        <Route path="/photographer/view-portfolio" element={<ViewPortfolio />} />
        


  
      </Routes>
    </Router>
  );
};

export default App;
