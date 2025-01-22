import React, { useState } from "react";
import Login from "./Components/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import Signup from "./Components/Signup";
import ForgetPassword from "./Components/ForgetPassword";
import Home from "./Components/Dashboard/Home";
import ChatPage from "./Components/ChatPage";
import GoLive from "./Components/GoLive";
import NavBar from "./Components/Dashboard/NavBar";
import GoogleAuth from "./Components/socialLogin/GoogleAuth";
import FanCountriesComponent from "./Components/FanCountriesComponent";
import TestHome from "./Components/Test/TestHome";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/chatroom" element={<ChatPage />} />
        <Route path="/golive" element={<GoLive />} />
        <Route path="/test" element={<NavBar />} />
        <Route path="/favouriteCountires" element={<FanCountriesComponent />} />
        {/* favouriteCountires */}
        <Route path="/test" element={<TestHome />} />
      </Routes>
    </Router>
  );
};

export default App;
