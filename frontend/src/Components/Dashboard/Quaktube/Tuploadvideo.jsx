import React, { useState } from "react";  // Add useState import
import { useNavigate } from "react-router-dom";
import NavBar from "../NavBar";
import Tsidebar from "./Tsidebar";
import './video.css';

const TuploadVideo = () => {

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

      {/* Main Content */}
      <div id="mainContent" className={`main-content ${sidebarOpen ? "content-expanded" : "content-collapsed"}`}>
      <div className="container-fluid pt-5 pb-5">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-left">
              <h6>Upload Details</h6>
            </div>
          </div>
          <div className="col-lg-2">
            <div className="bg-light border rounded p-3">Image Placeholder</div>
          </div>
          <div className="col-lg-10">
            <div className="fw-bold">Contrary to popular belief, Lorem Ipsum (2019) is not.</div>
            <div className="text-muted">102.6 MB . 2:13 MIN Remaining</div>
            <div className="mt-3">
              <div className="progress">
                <div
                  className="progress-bar progress-bar-striped progress-bar-animated"
                  role="progressbar"
                  aria-valuenow="75"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  style={{ width: "75%" }}
                ></div>
              </div>
              <div className="mt-2">
                <a href="#" className="text-danger">
                  <i className="fas fa-times-circle"></i>
                </a>
              </div>
            </div>
            <div className="text-muted mt-2">
              Your Video is still uploading, please keep this page open until it's done.
            </div>
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-lg-12">
            <form>
              <div className="mb-3">
                <label htmlFor="videoTitle" className="form-label">
                  Video Title
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="videoTitle"
                  placeholder="Contrary to popular belief, Lorem Ipsum (2019) is not."
                />
              </div>
              <div className="mb-3">
                <label htmlFor="about" className="form-label">
                  About
                </label>
                <textarea
                  className="form-control"
                  id="about"
                  rows="3"
                  placeholder="Description"
                ></textarea>
              </div>
              <div className="mb-3">
                <h6>Category (you can select up to 6 categories)</h6>
                <div className="row">
                  <div className="col-lg-4">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="category1" />
                      <label className="form-check-label" htmlFor="category1">
                        Abaft
                      </label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="category2" />
                      <label className="form-check-label" htmlFor="category2">
                        Brick
                      </label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="category3" />
                      <label className="form-check-label" htmlFor="category3">
                        Purpose
                      </label>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="category4" />
                      <label className="form-check-label" htmlFor="category4">
                        Shallow
                      </label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="category5" />
                      <label className="form-check-label" htmlFor="category5">
                        Spray
                      </label>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="category6" />
                      <label className="form-check-label" htmlFor="category6">
                        Quiet
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <button type="button" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default TuploadVideo;
