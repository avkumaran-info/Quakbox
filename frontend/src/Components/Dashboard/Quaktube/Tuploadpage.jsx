import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../NavBar';
import Tsidebar from './Tsidebar';

const TuploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Simulate file upload
  const handleUpload = () => {
    if (!selectedFile) {
      alert('Please select a file');
      return;
    }

    setUploading(true);
    // Simulate upload process (you can replace this with your actual upload logic)
    setTimeout(() => {
      setUploading(false);
      setUploadSuccess(true);
      alert('File uploaded successfully');
      // After uploading, navigate to Tuploadvideo page
      navigate('/uploadvideo');
    }, 2000); // Simulate 2 seconds of upload time
  };
   const [sidebarOpen, setSidebarOpen] = useState(true);
   const navigate = useNavigate();

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
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
        <div className="container-fluid pt-5 pb-5">
          <div className="row">
            <div className="col-md-8 mx-auto text-center upload-video pt-5 pb-5">
              <h1><i className="fas fa-file-upload text-primary"></i></h1>
              <h4 className="mt-5">Select Video files to upload</h4>
              <p className="land">or drag and drop video files</p>
              <div className="mt-4">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  id="fileInput"
                />
                <label htmlFor="fileInput" className="btn btn-outline-primary">
                  Choose File
                </label>
                {selectedFile && <p>{selectedFile.name}</p>}
              </div>

              {uploading ? (
                <p>Uploading...</p>
              ) : (
                <div className="mt-4">
                  <button onClick={handleUpload} className="btn btn-primary">
                    Upload Video
                  </button>
                </div>
              )}

              {uploadSuccess && (
                <div className="mt-4">
                  <p className="text-success">Upload successful!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TuploadPage;
