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
import PhotographerPortfolio from "./Components/Photographer/Portfolio/PhotographerPortfolio";
import EditProfile from "./Components/Edit_Profile/EditProfile";
import "./Style/main.css";  
import Footer from "./Components/Photographer/Footer/Footer.jsx";  
import ForgotPassword from "./Components/Login/ForgotPassword.jsx"; 
import VerifyOtp from "./Components/Login/VerifyOtp.jsx";    
import ResetPassword from "./Components/Login/ResetPassword.jsx"; 
import EditPortfolio from "./Components/Photographer/Portfolio/Editportfolio.jsx";     
import UpcomingEventSchedule from "./Components/Schedule/UpcomingEventSchedule.jsx";     
import EventScheduleForm from "./Components/Schedule/EventScheduleForm.jsx";        

const App = () => {
  return (
    <Router>
      <Routes>

        <Route path="/Topbar" element={<TopBar />} />
        <Route path="/Footer" element={<Footer />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/PhotographerSignUp" element={<PhotographerSignUp />} />
        <Route path="/ClientSignUp" element={<ClientSignUp />} />
        <Route path="/PhotographerHome" element={<Home />} />
        <Route path="/PopularPhotographer" element={<PopularPhotographers />} />
        <Route path="/photographer/create-portfolio" element={<CreatePortfolio />} />
        <Route path="/photographer/view-portfolio" element={<ViewPortfolio />} />
        <Route path="/photographer/portfolio/:id" element={<PhotographerPortfolio />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/photographer/edit-portfolio/:portfolioId" element={<EditPortfolio />} />
        <Route path="/photographer/UpcomingEventSchedule" element={<UpcomingEventSchedule />} />
        <Route path="/photographer/EventScheduleForm" element={<EventScheduleForm />} />

        
      </Routes>
    </Router>
  );
};

export default App;


