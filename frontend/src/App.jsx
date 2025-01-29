import React, { useState } from "react";
import { Provider, useDispatch } from "react-redux";
import Login from "./Components/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./Components/Signup";
import ForgetPassword from "./Components/ForgetPassword";
import Home from "./Components/Dashboard/Home";
import ChatPage from "./Components/ChatPage";
import GoLive from "./Components/GoLive";
import FanCountriesComponent from "./Components/FanCountriesComponent";
import store from "./Components/redux/store";
import FanCountry from "./Components/FanCountry";
import Thome from "./Components/Dashboard/Quaktube/Thome";  // Import Thome component
import Tuploadpage from "./Components/Dashboard/Quaktube/Tuploadpage";
// import TuploadVideo from "./Components/Dashboard/Quaktube/Tuploadvideo";
// import Channels from "./Components/Dashboard/Quaktube/Sidebars/Channels";
// import Singlechannel from "./Components/Dashboard/Quaktube/Sidebars/Singlech/annel";
// import Videopage from "./Components/Dashboard/Quaktube/Sidebars/Videopage";

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
          <Route path="/thome" element={<Thome />} /> {/* Home route */}
          {/*<Route path="/channels" element={<Channels/>} />*/}
          {/*<Route path="/singlechannel" element={<Singlechannel />} />*/}
          {/*<Route path="/video-page" element={<Videopage />} />*/}
          <Route path="/uploadpage" element={<Tuploadpage />} />
          {/*<Route path="/uploadvideo" element={<TuploadVideo />} />*/}
         </Routes>
      </Router>
    </Provider>
  );
};

export default App;
