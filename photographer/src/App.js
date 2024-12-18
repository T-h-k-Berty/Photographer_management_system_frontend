import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Components/Login/LoginPage";
import SignUp from "./Components/SignUp/SignUp";
import PhotographerSignUp from "./Components/SignUp/Photographer";
import ClientSignUp from "./Components/SignUp/ClientSignUp";
import "./Style/main.css";                             // Custom Styles

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Default Route */}
        <Route path="/" element={<LoginPage />} />

        {/* Login Page Route */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/PhotographerSignUp" element={<PhotographerSignUp />} />
        <Route path="/ClientSignUp" element={<ClientSignUp />} />

  
      </Routes>
    </Router>
  );
};

export default App;
