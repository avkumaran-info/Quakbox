import React, { useState } from "react";
import Login from "./Components/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./Components/Signup";
import ForgetPassword from "./Components/ForgetPassword";
import Home from "./Components/Dashboard/Home";
import ChatPage from "./Components/ChatPage";
import GoLive from "./Components/GoLive";
import FanCountriesComponent from "./Components/FanCountriesComponent";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/country/:countryCode" element={<Home />} />
        <Route path="/world" element={<Home />} />
        <Route path="/chatroom" element={<ChatPage />} />
        <Route path="/golive" element={<GoLive />} />
        <Route path="/favouriteCountires" element={<FanCountriesComponent />} />
        {/* favouriteCountires */}
      </Routes>
    </Router>
  );
};

export default App;
