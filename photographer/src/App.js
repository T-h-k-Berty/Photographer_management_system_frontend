import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Components/Login/LoginPage";
import "./Style/main.css";                             // Custom Styles

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Default Route */}
        <Route path="/" element={<LoginPage />} />

        {/* Login Page Route */}
        <Route path="/login" element={<LoginPage />} />

  
      </Routes>
    </Router>
  );
};

export default App;
