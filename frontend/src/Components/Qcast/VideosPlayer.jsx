import React, { useEffect, useState } from "react";
import user from "../../assets/images/user1.png";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import NavBar from "../Dashboard/NavBar";

const defaultComments = [
  {
    username: "John Doe",
    text: "Awesome video!",
    timestamp: "2 hours ago",
    user_profile: user,
  },
  {
    username: "Priya Sharma",
    text: "Really informative!",
    timestamp: "5 hours ago",
    user_profile: user,
  },
  {
    username: "Rajesh Kumar",
    text: "Loved the editing!",
    timestamp: "1 day ago",
    user_profile: user,
  },
];

const VideosPlayer = () => {
  const { videoId } = useParams(); // Get videoId from URL params
  const [video, setVideo] = useState(null);
  const [recommendedVideos, setRecommendedVideos] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();
  const passedVideo = location.state?.video; // Always use passedVideo for recommendations
  console.log(passedVideo);

  useEffect(() => {
    const fetchVideo = async () => {
      setVideo(null); // ✅ Force re-render before fetching new video

      try {
        const token = localStorage.getItem("api_token");
        if (!token) {
          console.error("❌ Authorization token missing. Please log in.");
          return;
        }

        const response = await axios.get(
          `https://develop.quakbox.com/admin/api/videos/${videoId}/show`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setVideo(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.error("Error fetching video:", error);
      }
    };

    fetchVideo();
  }, [videoId]); // ✅ Refetch video when `videoId` changes

  useEffect(() => {
    const fetchVideos = async () => {
      if (!passedVideo) return; // Ensure passedVideo is available

      try {
        const token = localStorage.getItem("api_token");
        if (!token) {
          console.error("❌ Authorization token missing. Please log in.");
          return;
        }

        const response = await axios.get(
          "https://develop.quakbox.com/admin/api/videos/qlist",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const allVideos = response.data.data;

        // ✅ Always use `passedVideo.category_name` to filter recommendations
        const relatedVideos = allVideos.filter(
          (v) =>
            v.category_name === passedVideo.category_name &&
            v.video_id !== passedVideo.video_id
        );

        setRecommendedVideos(relatedVideos);
      } catch (error) {
        console.error("Error fetching recommended videos:", error);
      }
    };

    fetchVideos();
  }, [passedVideo]); // ✅ Fetch recommendations based on passedVideo

  // ✅ Fix: Ensure video updates when clicking a recommended video
  const handleVideoClick = (recVideo) => {
    setVideo(null); // ✅ Clear current video before navigating
    navigate(`/videos/${recVideo.video_id}`, { state: { video: recVideo } });
  };

  // Toggle Comments Section
  const toggleComments = () => {
    setShowComments((prev) => !prev);
    if (!showComments) {
      setComments(defaultComments); // Set default comments when opening
    }
  };

  if (!video) {
    return <h2 className="text-center mt-5">Loading video...</h2>;
  }

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
    <>
      <NavBar />
      <div
        className="g-light text-dark min-vh-100 d-flex flex-column me-3"
        style={{ marginTop: "40px", marginRight: "25px" }}
      >
        <div className="row flex-grow-1">
          {/* Left Side - Video Section */}
          <div className="col-lg-9 d-flex flex-column bg-white p-3 rounded shadow-sm">
            {/* Video Player */}
            <div className="ratio ratio-16x9">
              {video.video_type == 1 && (
                <video controls autoPlay className="w-100 rounded">
                  <source src={video.file_path} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
              {video.video_type === 2 && (
                <>
                  <img src={passedVideo.defaultthumbnail} alt="" />
                  <video controls autoPlay className="w-100 rounded">
                    <source src={video.file_path} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </>
              )}
            </div>

            {/* Video Title & Views */}
            <div className="d-flex align-items-center">
              {/* Left Side: Title & Views */}
              <div className="flex-grow-1">
                <h5 className="fw-bold text-truncate">{video.title}</h5>
                <p className="text-muted small m-0">
                  {passedVideo.views} views •{" "}
                  {timeAgo(passedVideo.uploaded_datetime)}{" "}
                </p>
              </div>

              {/* Right Side: Action Buttons */}
              <div className="d-flex gap-2">
                <button className="btn btn-outline-secondary">
                  👍 {video.like}
                </button>
                <button className="btn btn-outline-secondary">👎</button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={toggleComments}
                >
                  {showComments ? "Hide Comments" : "Show Comments"}
                </button>
                <button className="btn btn-outline-secondary">🔗 Share</button>
                <button className="btn btn-outline-secondary">✂️ Clip</button>
              </div>
            </div>

            {/* Video Description */}
            <p className="text-muted">{video.description}</p>

            {/* Channel Info & Subscribe Button */}
            <div className="d-flex justify-content-between align-items-center  border-top">
              <div className="d-flex align-items-center mt-1">
                <img
                  src={passedVideo.user_profile_image}
                  alt="Channel Logo"
                  className="rounded-circle me-2"
                  width="40"
                  height="40"
                />
                <div>
                  <span className="fw-bold">{passedVideo.user_name}</span>
                  <br />
                  <small className="text-muted">
                    {video.subscribers} subscribers
                  </small>
                </div>
              </div>
              <button className="btn btn-danger fw-bold">Subscribe</button>
            </div>

            {/* Comments Section */}
            {showComments && (
              <div className="mt-4">
                <h6 className="fw-bold">Comments ({comments.length})</h6>
                <div className="border-top pt-3">
                  {comments.length > 0 ? (
                    comments.map((comment, index) => (
                      <div key={index} className="d-flex mb-3">
                        <img
                          src={comment.user_profile || "default-user.png"}
                          alt="User"
                          className="rounded-circle me-2"
                          width="40"
                          height="40"
                        />
                        <div>
                          <strong>{comment.username}</strong>
                          <p className="m-0">{comment.text}</p>
                          <small className="text-muted">
                            {comment.timestamp}
                          </small>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No comments yet. Be the first to comment!</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar - Recommended Videos */}
          <div className="col-lg-3 bg-white p-3 overflow-hidden">
            <h6 className="text-muted">Recommended Videos</h6>
            {recommendedVideos.length > 0 ? (
              recommendedVideos.map((recVideo) => (
                <div
                  key={recVideo.video_id}
                  className="d-flex mb-3"
                  onClick={() => handleVideoClick(recVideo)} // Added onClick handler
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={`${recVideo.defaultthumbnail}`} // Fixed to use correct path for thumbnail
                    alt="Thumbnail"
                    className="rounded"
                    style={{
                      width: "120px",
                      height: "70px",
                      objectFit: "cover",
                    }}
                  />
                  <div className="ms-2">
                    <p className="small m-0">{recVideo.title}</p>
                    <span className="text-muted small">Channel Name</span>
                    <br />
                    <span className="text-muted small">
                      {recVideo.views} views
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p>No recommended videos</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default VideosPlayer;
