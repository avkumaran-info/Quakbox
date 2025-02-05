import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// Category List with Icons
const categories = [
  { name: "Popping on Quakbox", icon: "fa-foursquare" },
  { name: "Tune", icon: "fa-headphones" },
  { name: "Sports", icon: "fa-futbol" },
  { name: "Silver Screen", icon: "fa-square-youtube" },
  { name: "TeleVision", icon: "fa-film" },
  { name: "Knowledge Base", icon: "fa-book" },
  { name: "Actors", icon: "fa-users" },
  { name: "Comedy", icon: "fa-face-smile" },
  { name: "Cooking", icon: "fa-utensils" },
  { name: "Documentary", icon: "fa-file" },
  { name: "Greetings", icon: "fa-envelope" },
  { name: "Interviews", icon: "fa-book" },
  { name: "News & Info", icon: "fa-file" },
  { name: "Religious", icon: "fa-users" },
  { name: "Speeches", icon: "fa-pen-to-square" },
  { name: "Talk Shows", icon: "fa-person" },
  { name: "Education", icon: "fa-book" },
  { name: "Travel", icon: "fa-truck fa-flip-horizontal" },
];

const link =
  "https://create.microsoft.com/_next/image?url=https%3A%2F%2Fcdn.create.microsoft.com%2Fcmsassets%2FyoutubeBanner-Hero.webp&w=1920&q=75";


const QVideos = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  const [videos, setVideos] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const token = localStorage.getItem("api_token");
      if (!token) {
        setMessage("❌ Authorization token missing. Please log in.");
        return;
      }
  
      const response = await axios.get("http://localhost:8000/api/videos/", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });
  
      if (response.status === 200) {
        setVideos(response.data.data);
      } else {
        setMessage(`⚠️ Unexpected response: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching videos:", error.response || error.message);
      setMessage(`❌ Error fetching videos: ${error.response?.data?.message || error.message}`);
    }
  };
  
  const handleVideoClick = (video) => {
    navigate(`/video/${encodeURIComponent(video.video_id)}`, { state: { video } });
  };
  // Function to scroll left (by 6 categories)
  const scrollLeft = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? categories.length - 6 : prevIndex - 6
    );
  };

  // Function to scroll right (by 6 categories)
  const scrollRight = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex >= categories.length - 6 ? 0 : prevIndex + 6
    );
  };

  return (
    <div className="p-0">
      {/* Category Card Section */}
      <div
        className="d-flex align-items-center justify-content-around mb-4"
        style={{
          width: "100%",
          position: "relative",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "4px",
        }}
      >
        {/* Left Scroll Button */}
        <button
          className="btn btn-light"
          onClick={scrollLeft}
          style={{
            position: "absolute",
            left: "0",
            zIndex: "10",
            marginLeft: "-10px",
          }}
        >
          <i className="fa fa-arrow-left"></i>
        </button>

        {/* Scrollable Category Cards */}
        <div
          ref={scrollContainerRef}
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "4px",
            overflow: "hidden",
            width: "100%",
          }}
        >
          {categories
            .slice(currentIndex, currentIndex + 6) // Display 6 categories at a time
            .map((category, index) => (
              <div
                key={index}
                className="card d-flex align-items-center justify-content-center"
                style={{
                  width: "190px",
                  borderRadius: "10px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                  paddingTop: "15px", // Add padding on top
                  paddingBottom: "15px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <i
                    className={`fa ${category.icon}`}
                    style={{ fontSize: "18px" }}
                  ></i>
                  <h5 className="card-title m-0" style={{ fontSize: "14px" }}>
                    {category.name}
                  </h5>
                </div>
              </div>
            ))}
        </div>

        {/* Right Scroll Button */}
        <button
          className="btn btn-light"
          onClick={scrollRight}
          style={{
            position: "absolute",
            right: "0",
            zIndex: "10",
            marginRight: "-10px",
          }}
        >
          <i className="fa fa-arrow-right"></i>
        </button>
      </div>

      {/* Featured Videos Section */}
      <div className="p-0">
        {/* Video Thumbnails
        <div className="row">
        {videos.map((video, index) => (
          <div
            className="col-12 col-sm-6 col-lg-4 col-xl-3 mb-3"
            key={video.video_id || index} // Use video_id if unique, fallback to index
            onClick={() => handleVideoClick(video)}
            style={{ cursor: "pointer" }}
          >
            <div
              className="card position-relative"
              style={{
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              }}
            >
              {video.image && ( // Ensure video.image exists before rendering
                <img
                src={video.defaultthumbnail ? video.defaultthumbnail : link} // Fallback image
                className="card-img-top"
                alt={video.title || "Video Thumbnail"}
                style={{ height: "150px", objectFit: "cover" }}
              />
              )}
              <div className="card-body">
                <h6 className="card-title" style={{ fontWeight: "bold" }}>
                  {video.title || "Untitled Video"}
                </h6>
                <p className="card-text text-muted">{video.views || 0} views</p>
              </div>
            </div>
          </div>
        ))}


        </div> */}
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default QVideos;



