// src/pages/Home.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import { ContentProvider, useContent } from "../store/contentStore"; // Ensure this is the correct path
import CreateVideo from "./CreateVideo";
import CreateAudio from "./CreateAudio";
import TakePhoto from "./TakePhoto";
import UploadContent from "./UploadContent";
import MyContent from "./MyContent";
import { Grid, Container } from "@mui/material";
import ContentCard from "../components/ContentCard";
import NavBar from "../../Dashboard/NavBar"; // Adjust path if necessary
import HamburgerMenu from "../components/HamburgerMenu";
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

// Separate component to render the content grid
const HomeContent = () => {
  const { content, removeContent } = useContent();
  const allContent = [...content.photos, ...content.videos, ...content.audios];

  return (
    <Container style={{ margin: "0", padding: "0" }}>
      {/* Removed the Home Page text */}
      <h1>Home Page</h1>
      <Grid container spacing={2}>
        {allContent.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <ContentCard item={item} onDelete={removeContent} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default VidoeHome;
