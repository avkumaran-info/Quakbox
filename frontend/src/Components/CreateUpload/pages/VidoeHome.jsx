// src/pages/Home.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import { ContentProvider, useContent } from "../store/contentStore"; // Ensure this is the correct path
import CreateVideo from "./CreateVideo";
import CreateAudio from "./CreateAudio";
import TakePhoto from "./TakePhoto";
import UploadContent from "./UploadContent";
import MyContent from "./MyContent";
import NavBar from "../../Dashboard/NavBar"; // Adjust path if necessary
import HamburgerMenu from "../components/HamburgerMenu";
import HomeContent from "./HomeContent";
const VidoeHome = () => {
  return (
    <div>
      <div>
        <NavBar />
      </div>
      <ContentProvider>
        <div style={{ marginTop: "70px" }}>
          {/* Removed HomeContent, which was rendering the Home Page text */}
          <HamburgerMenu />
          <Routes>
            <Route path="/" element={<HomeContent />} />
            <Route path="/create-video" element={<CreateVideo />} />
            <Route path="/create-audio" element={<CreateAudio />} />
            <Route path="/take-photo" element={<TakePhoto />} />
            <Route path="/upload-content" element={<UploadContent />} />
            <Route path="/my-content" element={<MyContent />} />
          </Routes>
        </div>
      </ContentProvider>
    </div>
  );
};

export default VidoeHome;
