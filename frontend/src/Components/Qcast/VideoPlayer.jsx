import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import NavBar from "../Dashboard/NavBar";
import axios from "axios"; // Ensure axios is imported

const VideoPlayer = () => {
  const { videoId } = useParams(); // Get videoId from URL params
  const location = useLocation();
  const navigate = useNavigate();

  const [video, setVideo] = useState(null); // State to store the current video
  const [recommendedVideos, setRecommendedVideos] = useState([]);
  const [message, setMessage] = useState("");

  // Get the video from location.state if available (from previous navigation)
  const passedVideo = location.state?.video;
  console.log(passedVideo.file_path);
  

  useEffect(() => {
    console.log("useEffect triggered");
  
    const fetchVideo = async () => {
      try {
        const token = localStorage.getItem("api_token");
        console.log(token);
        
        if (!token) {
          setMessage("❌ Authorization token missing. Please log in.");
          console.log("Authorization token is missing.");
          return;
        }
  
        const response = await axios.get(`https://develop.quakbox.com/admin/api/videos/${videoId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        console.log("API Response:", response.data);
        if (response.status === 200) {
          setVideo(response.data); // Set the fetched video details
          console.log("Video data has been set:", response.data);
        } else {
          console.error("Error fetching video:", response);
        }
      } catch (error) {
        console.error("Error fetching video:", error);
      }
    };
  
    if (!passedVideo) {
      fetchVideo(); // Only fetch video if it wasn't passed via state
      console.log("Fetching video from API...");
    } else {
      setVideo(passedVideo); // If video was passed from state, use it
      console.log("Using passed video from state.");
    }
  }, [videoId, passedVideo]);
   // Dependency array includes videoId to refetch if it changes

  // useEffect(() => {
  //   const fetchRecommendedVideos = async () => {
  //     try {
  //       const response = await fetch("http://localhost:3002/api/videos/recommended");
  //       const data = await response.json();
  //       setRecommendedVideos(data); // Set the fetched recommended videos
  //     } catch (error) {
  //       console.error("Error fetching recommended videos:", error);
  //     }
  //   };

  //   fetchRecommendedVideos();
  // }, []);

  // Handle clicking on recommended videos
  const handleVideoClick = (recVideo) => {
    navigate(`/videos/${encodeURIComponent(recVideo.video_id)}`, {
      state: { video: recVideo },
    });
  };

  if (!video) {
    return <h2 className="text-center mt-5">Video not found or loading...</h2>;
  }

  return (
    <>
      <NavBar />
      <div className="g-light text-dark min-vh-100 d-flex flex-column p-4" style={{ marginTop: "56px" }}>
        <div className="row flex-grow-1">
          {/* Left Side - Video Section */}
          <div className="col-lg-9 d-flex flex-column">
            <div className="ratio ratio-16x9">
              <video controls autoPlay className="w-100">
                <source src={`${video.file_path}`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="p-3">
              <h5 className="mt-3 fw-bold">{video.title}</h5>

              {/* Channel Info */}
              <div className="d-flex align-items-center mt-2">
                <img
                  src="your-channel-logo.png"
                  alt="Channel Logo"
                  className="rounded-circle me-2 shadow-sm"
                  width="40"
                  height="40"
                />
                <div>
                  <span className="fw-bold">Moviebuff Tamil</span>
                  <br />
                  <small className="text-muted">2.75M subscribers</small>
                </div>
                <button className="btn btn-danger ms-3 fw-bold">
                  Subscribe
                </button>
              </div>

              {/* Action Buttons */}
              <div className="mt-3 d-flex gap-2">
                <button className="btn btn-outline-secondary">👍 11K</button>
                <button className="btn btn-outline-secondary">👎</button>
                <button className="btn btn-outline-secondary">Share</button>
                <button className="btn btn-outline-secondary">Download</button>
                <button className="btn btn-outline-secondary">Clip</button>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Recommended Videos */}
          <div className="col-lg-3 bg-white p-3 overflow-hidden">
            <h6 className="text-muted">Recommended Videos</h6>
            {/* {recommendedVideos.length > 0 ? (
              recommendedVideos.map((recVideo) => (
                <div
                  key={recVideo.video_id}
                  className="d-flex mb-3"
                  onClick={() => handleVideoClick(recVideo)} // Added onClick handler
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={`${recVideo.file_path}`} // Fixed to use correct path for thumbnail
                    alt="Thumbnail"
                    className="rounded"
                    style={{ width: "120px", height: "70px", objectFit: "cover" }}
                  />
                  <div className="ms-2">
                    <p className="small m-0">{recVideo.title}</p>
                    <span className="text-muted small">Channel Name</span>
                    <br />
                    <span className="text-muted small">1.5M views</span>
                  </div>
                </div>
              ))
            ) : (
              <p>No recommended videos</p>
            )} */}
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoPlayer;
