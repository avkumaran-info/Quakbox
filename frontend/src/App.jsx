import React, { useState } from "react";
import Login from "./Components/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import Signup from "./Components/Signup";
import ForgetPassword from "./Components/ForgetPassword";
import Home from "./Components/Dashboard/Home";
import ChatPage from "./Components/ChatPage";
import NavBar from "./Components/NavBar";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* <Route path="/d" element={<Dashboard />} /> */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/chatroom" element={<ChatPage />} />
        <Route path="/test" element={<NavBar/>}/>
      </Routes>
    </Router>
  );
};

export default App;
