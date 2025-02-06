import React, { useState } from "react";
import { Provider, useDispatch } from "react-redux";
import Login from "./Components/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./Components/Signup";
import ForgetPassword from "./Components/ForgetPassword";
import Home from "./Components/Dashboard/Home";
import ChatPage from "./Components/ChatPage";
import GoLive from "./Components/GoLive";
import NavBar from "./Components/Dashboard/NavBar";
import GoogleAuth from "./Components/socialLogin/GoogleAuth";
import FanCountriesComponent from "./Components/FanCountriesComponent";
import store from "./Components/redux/store";
import VidoeHome from "./Components/CreateUpload/pages/VidoeHome";
import FanCountry from "./Components/FanCountry";
import QHomw from "./Components/Qcast/QHomw";
import UploadVideo from "./Components/Qcast/UploadVideo";
import AddVideo from "./Components/Qcast/AddVideo";
import VideoPlayer from "./Components/Qcast/VideoPlayer";
const App = () => {
  return (
    <Provider store={store}>
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
          <Route path="/test" element={<FanCountry />} />
          <Route path="/favouriteCountires" element={<FanCountry />} />
          <Route path="/qcast" element={<QHomw />} />
          <Route path="/upload" element={<UploadVideo />} />
          <Route path="/videos/:id" element={<VideoPlayer />} />
          <Route path="/addvideo" element={<AddVideo />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
