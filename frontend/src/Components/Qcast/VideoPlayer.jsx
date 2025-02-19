import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import NavBar from "../Dashboard/NavBar";
import axios from "axios"; // Ensure axios is imported
import user from "../../assets/images/user1.png";
const VideoPlayer = () => {
  const { videoId } = useParams(); // Get videoId from URL params
  const location = useLocation();
  const navigate = useNavigate();
  const [id, setId] = useState();
  const [video, setVideo] = useState(null); // State to store the current video
  const [recommendedVideos, setRecommendedVideos] = useState([]);
  const [message, setMessage] = useState("");
  const [showComments, setShowComments] = useState(false); // Toggle comments visibility
  const [comments, setComments] = useState([]); // Store comments
  // Get the video from location.state if available (from previous navigation)
  // const passedVideo = location.state?.video;

  // console.log(passedVideo);
  // console.log(videoId);

  // Default comments JSON
  const defaultComments = [
    {
      username: "John Doe",
      text: "Awesome video! Thanks for sharing.",
      timestamp: "2 hours ago",
      user_profile: user,
    },
    {
      username: "Priya Sharma",
      text: "This was really informative. Keep it up!",
      timestamp: "5 hours ago",
      user_profile: user,
    },
    {
      username: "Rajesh Kumar",
      text: "Loved the editing and presentation!",
      timestamp: "1 day ago",
      user_profile: user,
    },
  ];

  useEffect(() => {
    if (!passedVideo) {
      fetchVideo(); // Only fetch video if it wasn't passed via state
      console.log("Fetching video from API...");
    } else {
      setVideo(passedVideo); // If video was passed from state, use it
      console.log("Using passed video from state.");
    }
  }, [videoId, passedVideo]);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const token = localStorage.getItem("api_token");
        if (!token) {
          setMessage("❌ Authorization token missing. Please log in.");
          return;
        }
  
        const response = await axios.get(
          `https://develop.quakbox.com/admin/api/videos/${videoId}/show`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
  
        if (response.status === 200) {
          setVideo(response.data);
        } else {
          console.error("Error fetching video:", response);
        }
      } catch (error) {
        console.error("Error fetching video:", error);
      }
    };
  
    if (!location.state?.video) {
      fetchVideo(); // Fetch from server if no state video is passed
    } else {
      setVideo(location.state.video); // Use state if available
    }
  }, [videoId]); // ⬅️ Now it listens for `videoId` changes

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

        const allVideos = response.data.data;

        if (!passedVideo) {
          setMessage("❌ No video data found.");
          return;
        }
        // console.log(allVideos);

        // Filter videos that have the same category_name as passedVideo but exclude the current video
        // const relatedVideos = allVideos.filter(
        //   (video) =>
        //     video.category_name === "Comedy" &&
        //     video.video_id !== passedVideo.video_id
        // );

        const relatedVideos = allVideos.filter(
          (video) =>
            video.category_name === passedVideo.category_name &&
            video.video_id !== passedVideo.video_id
        );

        console.log("Recommended Videos:", relatedVideos);
        setRecommendedVideos(relatedVideos); // Store in state
      } catch (error) {
        setMessage("❌ No videos to display");
      }
    };

    fetchVideos();
  }, [passedVideo]); // Runs when passedVideo changes

  // Handle clicking on recommended videos
const handleVideoClick = (recVideo) => {
  navigate(`/videos/${recVideo.video_id}`, { state: { video: recVideo } });
  setVideo(null); // Ensure video updates correctly
};

  // Toggle Comments Section
  const toggleComments = () => {
    setShowComments((prev) => !prev);
    if (!showComments) {
      setComments(defaultComments); // Set default comments when opening
    }
  };

  if (!video) {
    return <h2 className="text-center mt-5">Video not found or loading...</h2>;
  }

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
                  <img src={video.defaultthumbnail} alt="" />
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
                  {video.views} views {video.upload_date}
                </p>
              </div>

              {/* Right Side: Action Buttons */}
              <div className="d-flex gap-2">
                <button className="btn btn-outline-secondary">
                  👍 {video.likes}
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
                  src={video.user_profile_image}
                  alt="Channel Logo"
                  className="rounded-circle me-2"
                  width="40"
                  height="40"
                />
                <div>
                  <span className="fw-bold">{video.user_name}</span>
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

export default VideoPlayer;
