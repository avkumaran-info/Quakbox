import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { FaUpload } from "react-icons/fa";

// Categories List
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
  const [videos, setVideos] = useState([]); // All videos
  const [filteredVideos, setFilteredVideos] = useState([]); // Filtered videos
  const [selectedCategory, setSelectedCategory] = useState("All"); // Default category
  const [searchQuery, setSearchQuery] = useState(""); // Search state
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchVideos();
  }, [id]);

  // Fetch all videos initially
  const fetchVideos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("api_token");
      if (!token) {
        setMessage("❌ Authorization token missing. Please log in.");
        return;
      }
      const response = await axios.get(
        "https://develop.quakbox.com/admin/api/videos/qlist",
        { headers: { Authorization: `Bearer ${token}` } }
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

  const handleVideoClick = async (video) => {
    try {
      const token = localStorage.getItem("api_token"); // Get the auth token
      if (!token) {
        console.error("❌ Authorization token missing. Please log in.");
        return;
      }

      // Call the API to update the view count
      await axios.post(
        `https://develop.quakbox.com/admin/api/videos/${video.video_id}/view`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Navigate to the video page after API call
      navigate(`/videos/${encodeURIComponent(video.video_id)}`, {
        state: { video },
      });
    } catch (error) {
      console.error(
        "❌ Error updating video view count:",
        error.response?.data || error.message
      );
    }
  };

  // Handle category selection
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    filterVideos(searchQuery, category);
  };

  // Handle search
  const handleSearch = async (e) => {
    if (e.key === "Enter") {
      filterVideos(e.target.value, selectedCategory);
    }
  };

  const filterVideos = async (search, category) => {
    setSearchQuery(search);
    setSelectedCategory(category);
    setLoading(true);
    setMessage(""); // Reset message before filtering

    try {
      const token = localStorage.getItem("api_token");
      if (!token) {
        setMessage("❌ Authorization token missing. Please log in.");
        return;
      }

      // Get all videos (fetch only once)
      let allVideos = videos.length > 0 ? videos : [];
      if (allVideos.length === 0) {
        const response = await axios.get(
          "https://develop.quakbox.com/admin/api/videos",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("📌 API Response:", response.data); // ✅ Check uploaded_datetime values
        if (response.status === 200 && response.data.data) {
          allVideos = response.data.data;
          setVideos(allVideos); // Store videos globally to avoid refetching
        } else {
          setMessage("⚠️ No videos found.");
          setFilteredVideos([]); // Ensure empty state
          return;
        }
      }

      // Apply search filter
      let filtered = allVideos;
      if (search) {
        filtered = filtered.filter((video) =>
          video.title.toLowerCase().includes(search.toLowerCase().trim())
        );
      }

      // Apply category filter
      if (category !== "All") {
        filtered = filtered.filter(
          (video) =>
            video.category_name?.toLowerCase().trim() ===
            category.toLowerCase().trim()
        );
      }

      // If no matching videos, reset message correctly
      if (filtered.length === 0) {
        setMessage(
          `⚠️ No videos found for '${category}'${
            search ? ` and '${search}'` : ""
          }.`
        );
      } else {
        setMessage(""); // Ensure message is cleared if videos are found
      }

      setFilteredVideos(filtered);
    } catch (error) {
      setMessage("❌ Error fetching videos.");
    } finally {
      setLoading(false);
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

  // Time formatting function
  const timeAgo = (dateString) => {
    if (!dateString) return "Unknown"; // ✅ Prevent errors
  
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date"; // ✅ Check for invalid timestamps
  
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
  
    if (seconds < 60) return "Just now";
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
    <>
      {/* Navbar with Search Box */}
      <nav className="navbar navbar-light bg-light shadow d-flex justify-content-center align-items-center p-2 mb-2">
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch} // Search on Enter key
          style={{
            width: "50%",
            maxWidth: "500px",
            marginRight: "10px",
            height: "38px",
          }}
        />
        <button
          className="btn btn-outline-primary d-flex align-items-center justify-content-center"
          style={{
            padding: "8px 20px",
            height: "38px",
            display: "flex",
            gap: "8px",
          }}
          onClick={() => navigate("/upload")}
        >
          <FaUpload className="me-1" /> Upload Video
        </button>
      </nav>

      {/* Categories Section */}
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
            <div className="text-center">⚠️ No videos found.</div>
          ) : (
            filteredVideos.map((video, index) => (
              <div
                className="col-12 col-sm-6 col-lg-4 col-xl-3 mb-3"
                key={index}
                onClick={() => handleVideoClick(video)}
                style={{ cursor: "pointer" }}
              >
                <div
                  className="card border-0"
                  style={{
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  {/* Video Thumbnail */}
                  <div style={{ position: "relative" }}>
                    <img
                      src={video.defaultthumbnail}
                      className="card-img-top"
                      alt={video.title || "Video Thumbnail"}
                      style={{
                        height: "160px",
                        width: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  {/* Video Info */}
                  <div className="card-body p-2 d-flex">
                    {/* Profile Image */}
                    <img
                      src={video.user_profile_image || "default_profile.png"}
                      alt="Uploader"
                      className="rounded-circle me-2"
                      style={{
                        width: "40px",
                        height: "40px",
                        objectFit: "cover",
                      }}
                    />

                    {/* Video Details */}
                    <div style={{ flex: 1 }}>
                      <h6 className="fw-bold mb-1 text-dark">{video.title}</h6>
                      <p
                        className="text-muted mb-0"
                        style={{ fontSize: "13px" }}
                      >
                        {video.username}
                      </p>
                      <p
                        className="text-muted mb-0"
                        style={{ fontSize: "12px" }}
                      >
                        {video.views} views • {timeAgo(video.uploaded_datetime)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default QVideos;
