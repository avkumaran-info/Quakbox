import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";

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
  const [videos, setVideos] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();

  useEffect(() => {
    if (state && Array.isArray(state.video)) {
      setVideos(state.video);
      setLoading(false);
    } else {
      const fetchVideos = async () => {
        try {
          const token = localStorage.getItem("api_token");
          if (!token) {
            setMessage("❌ Authorization token missing. Please log in.");
            return;
          }

          const response = await axios.get("https://develop.quakbox.com/admin/api/videos", {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.status === 200 && response.data.data) {
            setVideos(response.data.data);
          } else {
            setMessage("⚠️ No videos found.");
          }
        } catch (error) {
          setMessage("❌ No videos to display");
        } finally {
          setLoading(false);
        }
      };

      fetchVideos();
    }
  }, [id, state]);

  const handleVideoClick = (video) => {
    if (!video.video_id) {
      console.error("Video ID is missing:", video);
      return;
    }

    navigate(`/videos/${encodeURIComponent(video.video_id)}`, {
      state: { video },
    });
  };

  const scrollLeft = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 6 + categories.length) % categories.length);
  };

  const scrollRight = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex >= categories.length - 6 ? 0 : prevIndex + 6
    );
  };

  return (
    <div className="p-2">
      {/* Category Section */}
      <div className="d-flex align-items-center justify-content-center mb-4 position-relative">
        {/* Left Scroll Button */}
        <button
          className="btn btn-light position-absolute"
          onClick={scrollLeft}
          style={{ left: "10px", zIndex: "10" }}
        >
          <i className="fa fa-arrow-left"></i>
        </button>

        {/* Scrollable Categories */}
        <div
          ref={scrollContainerRef}
          className="d-flex flex-wrap justify-content-center gap-2"
          style={{ overflow: "hidden", width: "90%"  }}
        >
          {categories.slice(currentIndex, currentIndex + 6).map((category, index) => (
              <div
              key={index}
              className="card align-items-center justify-content-center"
              style={{
                width: "200px",
                borderRadius: "10px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                cursor: "pointer",
                paddingTop: "5px", // Add padding on top
                paddingBottom: "5px",
              }}
            >
              <i className={`fa ${category.icon}`} style={{ fontSize: "18px" }}></i>
              <h6 className="mt-2 mb-0" style={{ fontSize: "14px" }}>
                {category.name}
              </h6>
            </div>
          ))}
        </div>

        {/* Right Scroll Button */}
        <button
          className="btn btn-light position-absolute"
          onClick={scrollRight}
          style={{ right: "10px", zIndex: "10" }}
        >
          <i className="fa fa-arrow-right"></i>
        </button>
      </div>

      {/* Videos Section */}
      <div className="container">
        <div className="row">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : message ? (
            <div className="text-center">{message}</div>
          ) : (
            videos.map((video, index) => (
              <div
              className="col-12 col-sm-6 col-lg-4 col-xl-3 mb-3"
              key={index}
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
                  <img
                    src={video.defaultthumbnail || link}
                    className="card-img-top"
                    alt={video.title || "Video Thumbnail"}
                    style={{ height: "150px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h6 className="fw-bold">{video.title}</h6>
                    <p className="text-muted">{video.views} views</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default QVideos;
