import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import NavBar from "../NavBar";
import Tsidebar from "./Tsidebar";
import Home from "./Sidebars/VHome";
import "./navstyles.css";
import Channels from "./Sidebars/Channels";
import Singlechannel from "./Sidebars/Singlechannel"
import Videopage from "./Sidebars/Videopage";

const Thome = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleSidebarToggle = () => {
    setSidebarOpen((prevState) => !prevState);
  };

  return (
    <div className={`app ${sidebarOpen ? "sidebar-open" : ""}`}>
      {/* Navbar */}
      <NavBar />

      {/* Custom Navigation Bar */}
      <div className="container-fluid mt-4 mb-4">
        <div className="navbar-custom d-flex align-items-center">
          <button
            className="btn btn-link btn-sm text-secondary order-1 order-sm-0"
            id="sidebarToggleBtn"
            onClick={handleSidebarToggle}
          >
            <i className="fas fa-bars"></i>
          </button>
          <h6 className="ml-4 mt-2 custom-header">QuakTube</h6>

          {/* Search Bar */}
          <form className="d-none d-md-inline-block form-inline ml-auto navbar-search search-bar">
            <div className="input-group">
              <input type="text" className="form-control" placeholder="Search for..." />
              <div className="input-group-append">
                <button className="btn btn-light" type="button">
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </div>
          </form>

          {/* Upload Button */}
          <ul className="navbar-nav ml-auto ml-md-0 navbar-right">
            <li className="nav-item mx-1">
              <button onClick={() => navigate("/uploadpage")} className="btn btn-primary">
                <i className="fas fa-plus-circle fa-fw"></i> Upload Video
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "sidebar-visible" : "toggled"}`} id="sidebar">
        <Tsidebar sidebarOpen={sidebarOpen} />
      </div>

      {/* Main Content with Routing */}
      <div id="mainContent" className={`main-content ${sidebarOpen ? "content-expanded" : "content-collapsed"}`}>
        {/* Make sure Routes and Route paths are correctly set */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/channels" element={<Channels />} />
          <Route path="/singlechannel" element={<Singlechannel />} />
          <Route path="/video-page" element={<Videopage />} />
        </Routes>
      </div>
    </div>
  );
};

export default Thome;
