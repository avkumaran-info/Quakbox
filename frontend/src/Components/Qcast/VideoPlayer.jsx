import React from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import NavBar from "../Dashboard/NavBar";

const VideoPlayer = () => {
  const { videoTitle } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  
const link =
"https://create.microsoft.com/_next/image?url=https%3A%2F%2Fcdn.create.microsoft.com%2Fcmsassets%2FyoutubeBanner-Hero.webp&w=1920&q=75";
  // Get the video from state
  const video = location.state?.video;

  if (!video) {
    return <h2 className="text-center mt-5">No video selected</h2>;
  }

  return (
    <>
      <NavBar />
      <div
        className="g-light text-dark min-vh-100 d-flex flex-column p-4"
        style={{ marginTop: "56px" }}
      >
        <div className="row flex-grow-1">
          {/* Left Side - Video Section */}
          <div className="col-lg-9 d-flex flex-column">
            <div className="ratio ratio-16x9">
              <video controls autoPlay className="w-100">
                <source src={video.src} type="video/mp4" />
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
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="d-flex mb-3">
                <img
                  src={link}
                  alt="Thumbnail"
                  className="rounded"
                  style={{ width: "120px", height: "70px", objectFit: "cover" }}
                />
                <div className="ms-2">
                  <p className="small m-0">Video Title {i}</p>
                  <span className="text-muted small">Channel Name</span>
                  <br />
                  <span className="text-muted small">1.5M views</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoPlayer;
