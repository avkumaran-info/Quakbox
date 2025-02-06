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
  const { id } = useParams(); // Get the video id from the URL
  const { state } = useLocation(); // Get state from navigate

  useEffect(() => {
    if (state && Array.isArray(state.video)) {
      setVideos(state.video); // state.video should be an array of videos
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

          console.log("API Response:", response.data);

          if (response.status === 200 && response.data.data) {
            setVideos(response.data.data);
          } else {
            setMessage("⚠️ No videos found.");
          }
        } catch (error) {
          console.error("Error fetching videos:", error);
          setMessage("❌ Error fetching videos. Please try again later.");
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
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? categories.length - 6 : prevIndex - 6
    );
  };

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
            .slice(currentIndex, currentIndex + 6)
            .map((category, index) => (
              <div
                key={index}
                className="card d-flex align-items-center justify-content-center"
                style={{
                  width: "190px",
                  borderRadius: "10px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                  paddingTop: "15px",
                  paddingBottom: "15px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <i className={`fa ${category.icon}`} style={{ fontSize: "18px" }}></i>
                  <h5 className="card-title m-0" style={{ fontSize: "14px" }}>
                    {category.name}
                  </h5>
                </div>
              </div>
            ))}
        </div>

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
        <div className="row">
          {loading ? (
            <div>Loading...</div>
          ) : message ? (
            <div>{message}</div>
          ) : (
            videos.map((video, index) => (
              <div
                className="col-12 col-sm-6 col-lg-4 col-xl-3 mb-3"
                key={video.video_id || index}
                onClick={() => handleVideoClick(video)}
                style={{ cursor: "pointer" }}
              >
                <div
                  className="card position-relative"
                  style={{
                    borderRadius: "15px",
                    overflow: "hidden",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                    transition: "transform 0.3s ease",
                  }}
                >
                  <img
                    src={video.defaultthumbnail || link}
                    className="card-img-top"
                    alt={video.title || "Video Thumbnail"}
                    style={{ height: "150px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{video.title}</h5>
                    <p className="card-text">{video.description}</p>
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
