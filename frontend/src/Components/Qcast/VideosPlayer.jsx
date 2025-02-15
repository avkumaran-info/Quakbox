import React, { useContext, useEffect, useState } from "react";
import user from "../../assets/images/user1.png";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import NavBar from "../Dashboard/NavBar";
import CommentIcon from "@mui/icons-material/Comment";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { Tooltip } from "@mui/material";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import ReportIcon from "@mui/icons-material/Report";
import loading from "../../assets/images/loading.gif";
import { StoreContext } from "../../Context/StoreContext";

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
  const [comment, setComment] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const passedVideo = location.state?.video; // Always use passedVideo for recommendations
  // console.log(passedVideo);
  const { userData } = useContext(StoreContext);

  const [likes, setLikes] = useState(passedVideo?.likes || 0);
  const [dislikes, setDislikes] = useState(passedVideo?.dislikes || 0);

  const currentUserId = parseInt(localStorage.getItem("user_Id")); // Get logged-in user ID

  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const handleLike = async () => {
    if (!video) return;

    try {
      const token = localStorage.getItem("api_token");
      if (!token) {
        console.error("❌ Authorization token missing. Please log in.");
        return;
      }

      const response = await axios.post(
        `https://develop.quakbox.com/admin/api/videos/${video.video_id}/like`,
        { user_id: currentUserId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setLikes((prev) => prev + (isLiked ? -1 : 1));
        setIsLiked(!isLiked);

        if (isDisliked) {
          setDislikes((prev) => prev - 1); // Remove dislike if liked
          setIsDisliked(false);
        }
      }
    } catch (error) {
      console.error("Error liking video:", error);
    }
  };

  const handleDislike = async () => {
    if (!video) return;

    try {
      const token = localStorage.getItem("api_token");
      if (!token) {
        console.error("❌ Authorization token missing. Please log in.");
        return;
      }

      const response = await axios.post(
        `https://develop.quakbox.com/admin/api/videos/${video.video_id}/dislike`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setDislikes((prev) => prev + (isDisliked ? -1 : 1));
        setIsDisliked(!isDisliked);

        if (isLiked) {
          setLikes((prev) => prev - 1); // Remove like if disliked
          setIsLiked(false);
        }
      }
    } catch (error) {
      console.error("Error disliking video:", error);
    }
  };

  const handleSubscribe = async () => {
    try {
      const token = localStorage.getItem("api_token");
      if (!token) {
        console.error("❌ Authorization token missing. Please log in.");
        return;
      }

      const url = `https://develop.quakbox.com/admin/api/videos/${
        isSubscribed
          ? `unsubscribe/${video.user_id}`
          : `subscribe/${video.user_id}`
      }`;

      const method = isSubscribed ? "delete" : "post"; // Use DELETE for unsubscribe

      const response = await axios({
        method,
        url,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setIsSubscribed(!isSubscribed); // Toggle state
      }
    } catch (error) {
      console.error(
        "❌ Error updating subscription:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    const fetchVideo = async () => {
      setVideo(null); // Clear previous video

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

        const fetchedVideo = response.data.data;
        setVideo(fetchedVideo);

        console.log(response.data.data);

        // ✅ Update Likes & Dislikes
        setLikes(fetchedVideo.likes_count || 0);
        setDislikes(fetchedVideo.dislikes_count || 0);

        // ✅ Check if user already liked/disliked
        setIsLiked(
          fetchedVideo.liked_user_id?.some(
            (user) => user.video_liked_user_id === currentUserId
          ) || false
        );

        setIsDisliked(
          fetchedVideo.disliked_user_id?.some(
            (user) => user.video_disliked_user_id === currentUserId
          ) || false
        );

        // ✅ Check if user already subscribed
        setIsSubscribed(
          fetchedVideo.subscribers_user_id?.some(
            (user) => user.subscriber_id === currentUserId
          ) || false
        );
      } catch (error) {
        console.error("Error fetching video:", error);
      }
    };

    fetchVideo();
  }, [videoId]); // ✅ Refetch video when videoId changes

  const fetchComments = async () => {
    if (!video) return;

    try {
      const token = localStorage.getItem("api_token");
      if (!token) {
        console.error("❌ Authorization token missing. Please log in.");
        return;
      }

      const response = await axios.get(
        `https://develop.quakbox.com/admin/api/videos/${video.video_id}/comments`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // console.log(response);

      if (response.status === 200) {
        setComments(response.data.data);
      }
    } catch (error) {
      console.error("❌ Error fetching comments:", error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) {
      console.error("⚠️ Comment cannot be empty.");
      return;
    }

    try {
      const token = localStorage.getItem("api_token");
      if (!token) {
        console.error("❌ Authorization token missing. Please log in.");
        return;
      }

      // 🔹 Generate timestamp
      const currentTime = new Date().toISOString();

      // 🔹 Add comment optimistically to UI
      const tempComment = {
        comment_id: Date.now(), // Temporary ID
        comment_user_name: userData.users.username,
        comment_content: commentText,
        comment_user_profile_picture: userData.profile_image_url,
        comment_updated_datetime: currentTime, // Show correct time
      };

      setCommentText(""); // Clear input field

      // 🔹 Send comment to API
      const response = await axios.post(
        `https://develop.quakbox.com/admin/api/videos/${video.video_id}/comments`,
        { content: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        // console.log("✅ Comment posted successfully.");

        fetchComments(); // Fetch the latest comments
      }
    } catch (error) {
      console.error("❌ Error posting comment:", error);
    }
  };

  const handleEditComment = async (comment) => {
    // Handle the edit logic here (perhaps set the comment in the input field)
    console.log("Editing comment:", comment);
    setEditingComment(comment);
    setCommentText(comment.comment_content);
  };

  // Update edited comment via API
  const handleUpdateComment = async () => {
    if (!editingComment) return;

    try {
      const token = localStorage.getItem("api_token");
      if (!token) {
        console.error("❌ Authorization token missing. Please log in.");
        return;
      }
      const response = await axios.post(
        `https://develop.quakbox.com/admin/api/videos/comments/${editingComment.comment_id}`,
        { content: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // console.log(response);

      if (response.status === 201) {
        fetchComments(); // Refresh comments
        setEditingComment(null);
        setCommentText("");
      }
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingComment(null);
    setCommentText("");
  };

  const handleDeleteComment = async (commentId) => {
    // Confirm before deleting the comment (optional)
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this comment?"
    );
    if (!isConfirmed) return;

    try {
      const token = localStorage.getItem("api_token");
      if (!token) {
        console.error("❌ Authorization token missing. Please log in.");
        return;
      }

      const response = await axios.delete(
        `https://develop.quakbox.com/admin/api/videos/comments/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        console.log("Comment deleted successfully");

        // Optimistically remove the comment from the UI
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.comment_id !== commentId)
        );
      }
    } catch (error) {
      console.error("❌ Error deleting comment:", error);
    }
  };

  // 🔹 Fetch comments when page loads
  useEffect(() => {
    fetchComments();
  }, [video]);

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
    // if (!showComments) {
    //   setComments(comment); // Set default comments when opening
    //   console.log(comment);
    // }
  };

  if (!video) {
    return (
      <div style={overlayStyle}>
        <img src={loading} alt="Loading..." style={gifStyle} />
      </div>
    );
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
              {video.video_type === 3 &&
                (() => {
                  const isSingleImage =
                    Array.isArray(video.file_path) &&
                    video.file_path.length === 1;
                  const isMultipleImages =
                    Array.isArray(video.file_path) &&
                    video.file_path.length > 1;

                  return (
                    <div className="w-100 h-100 d-flex justify-content-center align-items-center">
                      {/* Single Image */}
                      {isSingleImage && (
                        <img
                          src={video.file_path[0]}
                          alt="Single"
                          className="img-fluid rounded w-100"
                          style={{ maxHeight: "400px", objectFit: "contain" }}
                        />
                      )}

                      {/* Multiple Images - Bootstrap Carousel */}
                      {isMultipleImages && (
                        <div
                          id={`carousel-${video.video_id}`}
                          className="carousel slide w-100"
                          data-bs-ride="carousel"
                          data-bs-interval="5000" // Changes slide every 5 seconds
                        >
                          <div className="carousel-inner">
                            {video.file_path.map((img, index) => (
                              <div
                                className={`carousel-item ${
                                  index === 0 ? "active" : ""
                                }`}
                                key={index}
                              >
                                <img
                                  src={img}
                                  className="d-block w-100 rounded"
                                  alt={`Slide ${index + 1}`}
                                  style={{
                                    maxHeight: "400px",
                                    objectFit: "contain",
                                  }}
                                />
                              </div>
                            ))}
                          </div>

                          {/* Dark Previous Button */}
                          <button
                            className="carousel-control-prev"
                            type="button"
                            data-bs-target={`#carousel-${video.video_id}`}
                            data-bs-slide="prev"
                          >
                            <span
                              className="carousel-control-prev-icon"
                              aria-hidden="true"
                              style={{ filter: "invert(1)" }} // Makes button dark
                            ></span>
                            <span className="visually-hidden">Previous</span>
                          </button>

                          {/* Dark Next Button */}
                          <button
                            className="carousel-control-next"
                            type="button"
                            data-bs-target={`#carousel-${video.video_id}`}
                            data-bs-slide="next"
                          >
                            <span
                              className="carousel-control-next-icon"
                              aria-hidden="true"
                              style={{ filter: "invert(1)" }} // Makes button dark
                            ></span>
                            <span className="visually-hidden">Next</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()}
            </div>

            {/* Video Title & Views */}
            <div className="d-flex align-items-center">
              {/* Left Side: Title & Views */}
              <div className="flex-grow-1 mt-2" style={{ marginLeft: "10px" }}>
                <h5 className="fw-bold text-truncate">{video.title}</h5>
                <p className="text-muted small m-0">
                  {passedVideo.views} views •{" "}
                  {timeAgo(video.updated_at)}{" "}
                </p>
              </div>
              <div className="d-flex gap-3">
                <Tooltip title="Like" arrow disableInteractive>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "12px",
                      cursor: "pointer",
                    }}
                    onClick={handleLike}
                  >
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      {likes}
                    </div>
                    <ThumbUpIcon
                      sx={{
                        fontSize: 36,
                        color: isLiked ? "blue" : "#263238",
                        "&:hover": { transform: "scale(1.2)" },
                        transition: "all 0.3s ease",
                      }}
                    />
                  </div>
                </Tooltip>

                <Tooltip title="Dislike" arrow disableInteractive>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "12px",
                      cursor: "pointer",
                    }}
                    onClick={handleDislike}
                  >
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      {}
                    </div>
                    <ThumbDownIcon
                      sx={{
                        fontSize: 36,
                        color: isDisliked ? "red" : "#263238",
                        "&:hover": { transform: "scale(1.2)" },
                        transition: "all 0.3s ease",
                      }}
                    />
                  </div>
                </Tooltip>

                <Tooltip title="Comment" arrow disableInteractive>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "12px",
                      cursor: "pointer",
                    }}
                    onClick={toggleComments}
                  >
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      {/* {commentsCount} */}
                    </div>
                    <CommentIcon
                      sx={{
                        fontSize: 36, // Bigger icon
                        color: "#263238",
                        "&:hover": { transform: "scale(1.2)" },
                        transition: "all 0.3s ease",
                      }}
                    />
                  </div>
                </Tooltip>

                <Tooltip title="Share" arrow disableInteractive>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "12px",
                      cursor: "pointer",
                    }}
                  >
                    <ScreenShareIcon
                      sx={{
                        fontSize: 36, // Bigger icon
                        color: "#263238",
                        "&:hover": { transform: "scale(1.2)" },
                        transition: "all 0.3s ease",
                      }}
                    />
                  </div>
                </Tooltip>

                <Tooltip title="Report" arrow disableInteractive>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "12px",
                      cursor: "pointer",
                    }}
                  >
                    <ReportIcon
                      sx={{
                        fontSize: 36, // Bigger icon
                        color: "#263238",
                        "&:hover": { transform: "scale(1.2)" },
                        transition: "all 0.3s ease",
                      }}
                    />
                  </div>
                </Tooltip>
              </div>
            </div>

            {/* Video Description */}
            <p className="text-muted" style={{ marginLeft: "10px" }}>
              {video.description}
            </p>

            {/* Channel Info & Subscribe Button */}
            <div
              className="d-flex justify-content-between align-items-center  border-top"
              style={{ marginLeft: "10px" }}
            >
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
              <button
                className={`btn ${
                  isSubscribed ? "btn-outline-secondary" : "btn-danger"
                } fw-bold`}
                onClick={handleSubscribe}
              >
                {isSubscribed ? "Unsubscribed" : "Subscribe"}
              </button>
            </div>

            {/* Comments Section */}
            {showComments && (
              <div className="mt-3">
                <h6 className="fw-bold">Comments ({comments.length})</h6>
                <div className="d-flex align-items-center my-1">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />

                  {editingComment ? (
                    <>
                      <button
                        className="btn btn-success ms-2"
                        onClick={handleUpdateComment}
                        disabled={!commentText.trim()}
                      >
                        Update
                      </button>
                      <button
                        className="btn btn-secondary ms-2"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn btn-primary ms-2"
                      onClick={handleCommentSubmit}
                      disabled={!commentText.trim()}
                    >
                      Comment
                    </button>
                  )}
                </div>

                <div className="border-top pt-1">
                  {comments.length > 0 ? (
                    comments.map((comment, index) => (
                      <div key={index} className="d-flex mb-3">
                        <img
                          src={
                            comment.comment_user_profile_picture ||
                            "default-user.png"
                          }
                          alt="User"
                          className="rounded-circle me-2"
                          width="40"
                          height="40"
                        />

                        <div className="w-100">
                          <div className="d-flex justify-content-between align-items-start flex-wrap">
                            <div className="me-2">
                              <strong>{comment.comment_user_name}</strong>{" "}
                              <small className="text-muted">
                                {timeAgo(comment.comment_updated_datetime)}
                              </small>
                            </div>
                            <div>
                              {/* Edit icon */}
                              {comment.comment_user_id ===
                                userData.users.id && (
                                <div>
                                  {/* Edit button */}
                                  <button
                                    className="btn btn-link btn-sm"
                                    onClick={() => handleEditComment(comment)}
                                    title="Edit comment"
                                  >
                                    <i className="fas fa-edit"></i>
                                  </button>

                                  {/* Delete button */}
                                  <button
                                    className="btn btn-link btn-sm"
                                    onClick={() =>
                                      handleDeleteComment(comment.comment_id)
                                    }
                                    title="Delete comment"
                                  >
                                    <i className="fas fa-trash-alt"></i>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          <p className="m-0 p-1  text-break">
                            {comment.comment_content}
                          </p>
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
            <h4 className="text-muted">Recommended Videos</h4>
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

export default VideosPlayer;
