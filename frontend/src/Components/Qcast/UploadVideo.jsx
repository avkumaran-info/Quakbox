import React, { useState, useRef, useEffect } from "react";
import QSidebar from "./QSidebar";
import NavBar from "../Dashboard/NavBar";
import videoupload from "../../assets/images/Videos property/videoupload.png";
import webcam from "../../assets/images/Videos property/webcam.png";
import photo from "../../assets/images/Videos property/photo.jpeg";
import music from "../../assets/images/Videos property/music.jpg";
import loading from "../../assets/images/loading.gif";
import { FaUpload } from "react-icons/fa"; // For upload icon
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getOpacity } from "@mui/material/styles/createColorScheme";

const UploadVideo = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("video"); // Default to "video" category
  const [webcamStream, setWebcamStream] = useState(null); // Store webcam stream
  const videoRef = useRef(null); // Reference to video element
  const fileInputRef = useRef(null); // File input reference for upload
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // Track loading state

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handler for category click on the right side
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    if (category !== "webcam") {
      stopWebcam(); // Stop webcam when not selected
    }
  };

  // Access webcam when "Webcam Capture" is clicked
  const handleWebcamCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setWebcamStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setSelectedCategory("webcam");
    } catch (error) {
      console.error("Error accessing webcam: ", error);
      alert("Please allow webcam access.");
    }
  };

  // Stop webcam stream when no longer needed
  const stopWebcam = () => {
    if (webcamStream) {
      const tracks = webcamStream.getTracks();
      tracks.forEach((track) => track.stop());
      setWebcamStream(null);
    }
  };

  // Handle file upload

  const handleFileUpload = async (e) => {
    const formData = new FormData();

    const file = e.target.files[0];
    const videoType = file.type.startsWith("video/")
      ? 1
      : file.type.startsWith("audio/")
      ? 2
      : file.type.startsWith("image/")
      ? 3
      : 4; // Default to webcam
    formData.append("video_type", videoType); // ✅ Fix: Corrected key
    formData.append("temp_upload", true);
    formData.append("video_file", file);

    setIsLoading(true);

    try {
      const token = localStorage.getItem("api_token");
      if (!token) {
        alert("Authorization token not found. Please log in.");
        return;
      }

      const response = await axios.post(
        "https://develop.quakbox.com/admin/api/videos/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setIsLoading(false);

      if (response.data.result) {
        // Pass videoType to the next page
        const videoData = {
          message: response.data.message,
          filePath: response.data.file_path,
          thumbnails: response.data.thumbnails,
          videoType: response.data.video_type, // ✅ Ensure this is passed
        };

        navigate("/addvideo", { state: { videoData } });
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error uploading video:", error);
      alert("Upload failed. Please try again.");
    }
  };

  // Content for each category
  const categoryContent = {
    video: {
      image: videoupload,
      label: "Video Upload",
      options: [
        {
          label: "Webcam Capture",
          img: webcam,
          category: "webcam",
          action: handleWebcamCapture,
        },
        { label: "Create Music", img: music, category: "music" },
        { label: "Photo Slideshow", img: photo, category: "photo" },
      ],
    },
    photo: {
      image: photo,
      label: "Photo Slideshow",
      options: [
        {
          label: "Webcam Capture",
          img: webcam,
          category: "webcam",
          action: handleWebcamCapture,
        },
        { label: "Create Music", img: music, category: "music" },
        { label: "Video Upload", img: videoupload, category: "video" },
      ],
    },
    webcam: {
      image: webcam,
      label: "Webcam Capture",
      options: [
        { label: "Photo Slideshow", img: photo, category: "photo" },
        { label: "Create Music", img: music, category: "music" },
        { label: "Video Upload", img: videoupload, category: "video" },
      ],
    },
    music: {
      image: music,
      label: "Create Music",
      options: [
        {
          label: "Webcam Capture",
          img: webcam,
          category: "webcam",
          action: handleWebcamCapture,
        },
        { label: "Photo Slideshow", img: photo, category: "photo" },
        { label: "Video Upload", img: videoupload, category: "video" },
      ],
    },
  };

  // Handle back button click to navigate to /qcast
  const handleBackClick = () => {
    navigate("/qcast"); // Navigate to '/qcast'
  };

  useEffect(() => {
    if (selectedCategory === "webcam" && !webcamStream) {
      handleWebcamCapture(); // Start the webcam if it's selected
    } else {
      stopWebcam();
    }

    return () => stopWebcam(); // Cleanup on unmount
  }, [selectedCategory]);
  // Run effect when selectedCategory changes

  return (
    <>
      <NavBar />
      {/* Full-page loading overlay */}
      {isLoading && (
        <div style={overlayStyle}>
          <img src={loading} alt="Loading..." style={gifStyle} />
        </div>
      )}

      <div style={{ marginTop: "56px" }}>
        <div className="d-flex">
          <div
            style={{
              flex: 1,
              padding: "20px",
              transition: "margin 0.3s",
              marginRight: sidebarOpen ? "250px" : "60px", // Adjust margin based on sidebar
            }}
          >
            <div className="row">
              {/* Left Side */}
              <div className="col-md-8 text-start">
                <button className="btn btn-dark mb-3" onClick={handleBackClick}>
                  Back
                </button>

                {/* Left side container that switches between image or webcam */}
                <div
                  className="my-3"
                  style={{
                    width: "100%",
                    height: "350px", // Fixed height for consistency
                    borderRadius: "10px", // Rounded corners
                    overflow: "hidden", // Hide any overflowed parts of the image
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Add a subtle shadow for better appearance
                    objectFit: "contain",
                  }}
                >
                  {/* If webcam is active, show video */}
                  {selectedCategory === "webcam" ? (
                    <video
                      ref={videoRef}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <img
                      src={categoryContent[selectedCategory].image}
                      alt={categoryContent[selectedCategory].label}
                      className="img-fluid hover-zoom"
                      style={{
                        width: "100%",
                        height: "300px",
                        objectFit: "contain", // Ensures the whole image is visible without cropping
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        fileInputRef.current.click();
                      }}
                    />
                  )}
                </div>

                {/* Label */}
                <div className="mt-3">
                  <h4>{categoryContent[selectedCategory].label}</h4>
                </div>

                {/* Upload Buttons below the image */}
                <div className="d-flex justify-content-around mt-3">
                  {selectedCategory === "photo" && (
                    <div>
                      <label className="btn btn-outline-primary">
                        <FaUpload className="me-2" /> Upload Photo
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          ref={fileInputRef}
                          multiple
                          onChange={handleFileUpload}
                        />
                      </label>
                    </div>
                  )}

                  {selectedCategory === "video" && (
                    <div>
                      <label className="btn btn-outline-primary">
                        <FaUpload className="me-2" /> Upload Video
                        <input
                          type="file"
                          accept="video/*"
                          style={{ display: "none" }}
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                        />
                      </label>
                    </div>
                  )}

                  {selectedCategory === "music" && (
                    <div>
                      <label className="btn btn-outline-primary ">
                        <FaUpload className="me-2" /> Upload Music
                        <input
                          type="file"
                          accept="image/*,audio/*"
                          style={{ display: "none" }}
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side */}
              <div className="col-md-4 border-start">
                <h6 className="text-muted">
                  CREATE {categoryContent[selectedCategory].label.toUpperCase()}
                </h6>

                {/* Container for the 3 elements */}
                <div className="d-flex flex-column gap-3">
                  {/* Loop through the options based on selected category */}
                  {categoryContent[selectedCategory].options.map(
                    (option, index) => (
                      <div
                        key={index}
                        className="d-flex align-items-center clickable"
                        onClick={() => {
                          handleCategoryClick(option.category);
                          if (option.action) option.action(); // Call action if it exists (for webcam capture)
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <img
                          src={option.img}
                          alt={option.label}
                          className="me-2"
                          style={{
                            width: "80px",
                            height: "70px",
                          }}
                        />
                        <div>
                          <span className="d-block">{option.label}</span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
          <QSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        </div>
      </div>

      {/* CSS for Hover Zoom Effect */}
      <style>
        {`
          .hover-zoom {
            transition: transform 0.3s ease-in-out;
          }

          .hover-zoom:hover {
            transform: scale(1.1); /* Zoom in slightly */
          }
          
        `}
      </style>
    </>
  );
};

export const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black background
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999, // Ensures it's above all other elements
};

export const gifStyle = {
  width: "200px",
  height: "100px",
  opacity: 0.5,
};

export default UploadVideo;
