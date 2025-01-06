import React from "react";
import Login from "./Components/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import Signup from "./Components/Signup";
import ForgetPassword from "./Components/ForgetPassword";
import Home from "./Components/Dashboard/Home";
// import Tast from "./Components/Tast";
import TestHome from "./Components/Test/TestHome";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route path="/d" element={<Home />} />
        {/* <Route path="/test" element={<Tast />} /> */}
        <Route path="/t" element={<TestHome />} />
      </Routes>
    </Router>
  );
};

export default App;
