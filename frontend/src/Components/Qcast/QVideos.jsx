import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";

const categories = [
  // { name: "All", icon: "fa-globe" }, // Default category
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

const QVideos = () => {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All"); // Default to "All"
  const [currentIndex, setCurrentIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const token = localStorage.getItem("api_token");
        if (!token) {
          setMessage("❌ Authorization token missing. Please log in.");
          return;
        }

        const response = await axios.get(
          "https://develop.quakbox.com/admin/api/videos/qlist",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 200 && response.data.data) {
          setVideos(response.data.data);
          console.log(response.data.data);

          setFilteredVideos(response.data.data); // Initially show all videos
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
  }, [id]);

  // Handle Category Click - Filter Videos
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);

    if (category === "All") {
      setFilteredVideos(videos);
    } else {
      const filtered = videos.filter(
        (video) => video.category_name === category
      );
      setFilteredVideos(filtered);
    }
  };

  // Handle Left Scroll
  const scrollLeft = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - 6 >= 0 ? prevIndex - 6 : categories.length - 6
    );
  };

  // Handle Right Scroll
  const scrollRight = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 6 < categories.length ? prevIndex + 6 : 0
    );
  };

  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return "now"; // Less than 1 minute
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
    const years = Math.floor(days / 365);
    return `${years} year${years > 1 ? "s" : ""} ago`;
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
          className="d-flex justify-content-center gap-2"
          style={{
            overflow: "hidden",
            width: "100%",
            transition: "transform 0.3s ease-in-out",
          }}
        >
          {categories
            .slice(currentIndex, currentIndex + 6)
            .map((category, index) => (
              <div
                key={index}
                className={`card align-items-center justify-content-center ${
                  selectedCategory === category.name
                    ? "bg-primary text-white"
                    : "bg-light text-dark"
                }`}
                onClick={() => handleCategoryClick(category.name)}
                style={{
                  width: "180px",
                  borderRadius: "10px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                  paddingTop: "5px", // Add padding on top
                  paddingBottom: "5px",
                  transition: "0.3s",
                }}
              >
                <i
                  className={`fa ${category.icon}`}
                  style={{ fontSize: "18px" }}
                ></i>
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
          ) : filteredVideos.length === 0 ? (
            <div className="text-center">
              ⚠️ No videos found in this category.
            </div>
          ) : (
            filteredVideos.map((video, index) => (
              <div
                className="col-12 col-sm-6 col-lg-4 col-xl-3 mb-3"
                key={index}
                onClick={() =>
                  navigate(`/videos/${encodeURIComponent(video.video_id)}`, {
                    state: { video },
                  })
                }
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
                    src={video.defaultthumbnail}
                    className="card-img-top"
                    alt={video.title || "Video Thumbnail"}
                    style={{ height: "150px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h6 className="fw-bold">{video.title}</h6>
                    <p className="text-muted">
                      {video.views} views • {timeAgo(video.uploaded_datetime)}{" "}
                    </p>
                    <div className="d-flex align-items-center">
                      <img
                        src={video.user_profile_image}
                        alt={video.user_name}
                        className="rounded-circle me-2"
                        width="40"
                        height="40"
                        style={{ objectFit: "cover" }}
                      />
                      <span className="fw-bold">{video.user_name}</span>
                    </div>
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
