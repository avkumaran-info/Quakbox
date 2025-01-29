import React, { useState, useRef, useEffect } from "react";
import {
  FaThumbsUp,
  FaThumbsDown,
  FaComment,
  FaShare,
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaVolumeDown,
} from "react-icons/fa";
import video1 from "../../assets/images/leftside videos/v1.mp4";
import video2 from "../../assets/images/leftside videos/v2.mp4";
import video3 from "../../assets/images/leftside videos/v3.mp4";
import video4 from "../../assets/images/leftside videos/v4.mp4";
import user1 from "../../assets/images/Rigth side property/user.jpg";
import user3 from "../../assets/images/Rigth side property/user3.jpg";
import user2 from "../../assets/images/Rigth side property/user2.jpeg";
import user from "../../assets/images/Rigth side property/user.png";

const LeftSidebar = ({
  countryCode,
  flag,
  countryName,
  handleCountryChange,
}) => {
  const videos = [video4, video1, video2, video3];
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1); // Default volume is 100%
  const [isLoading, setIsLoading] = useState(true); // Loading state for video

  const videoRef = useRef(null);

  const updates = [
    {
      id: 1,
      name: "John",
      message: "posted an update",
      avatar: user,
      time: "a year ago",
    },
    {
      id: 2,
      name: "Adele",
      message: "posted an update",
      avatar: user1,
      time: "a year ago",
    },
    {
      id: 3,
      name: "John",
      message: "posted an update",
      avatar: user2,
      time: "2 years ago",
    },
    {
      id: 4,
      name: "John",
      message: "posted an update in the group ☕ Coffee Addicts",
      avatar: user3,
      time: "2 years ago",
    },
    {
      id: 5,
      name: "John",
      message: "posted an update",
      avatar: user,
      time: "2 years ago",
    },
  ];

  const handleArrowClick = (direction) => {
    if (direction === "left") {
      setCurrentVideoIndex(
        currentVideoIndex > 0 ? currentVideoIndex - 1 : videos.length - 1
      );
    } else if (direction === "right") {
      setCurrentVideoIndex((currentVideoIndex + 1) % videos.length);
    }
    setIsPlaying(true); // Automatically play the next video
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeToggle = () => {
    if (volume === 0) {
      setVolume(1); // Unmute the video (volume 100%)
    } else {
      setVolume(0); // Mute the video (volume 0)
    }

    if (videoRef.current) {
      videoRef.current.volume = volume === 0 ? 1 : 0; // Set video volume
    }
  };

  const handleLoadedData = () => {
    setIsLoading(false); // Set loading to false when the video is ready
  };

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [currentVideoIndex, isPlaying]);

  return (
    <div
      className="col-md-3 d-none d-md-block bg-light position-fixed mb-5"
      style={{
        top: "55px",
        left: "0",
        boxSizing: "border-box",
        paddingBottom: "100px",
        overflowY: "auto",
        height: "calc(100vh - 55px - 50px)", // Adjusted height for the sidebar
        position: "relative", // Ensure it holds the position of elements within it
      }}
    >
      <div className="card mb-1">
        <div
          className="video-container"
          style={{
            textAlign: "center",
            position: "relative",
            marginBottom: "clamp(8px, 2vh, 16px)",
            paddingBottom: "1rem",
          }}
        >
          <div
            style={{
              marginBottom: "5px",
              width: "100%",
              maxWidth: "400px",
              margin: "0 auto",
              position: "relative",
              minHeight: "220px", // Ensure the video section has a minimum height, so the group section stays in place
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <video
              ref={videoRef}
              src={videos[currentVideoIndex]}
              width="100%"
              height="100%"
              controls={false}
              muted={false}
              loop={true}
              autoPlay={false}
              style={{
                border: "1px solid #ccc",
                backgroundColor: "#000",
                left: "0",
                position: "sticky",
                top: "0",
                zIndex: "1",
              }}
              onLoadedData={handleLoadedData}
            />

            {/* Show loading screen when the video is loading */}
            {isLoading && (
              <div
                style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  width: "100%",
                  height: videoRef.current
                    ? videoRef.current.clientHeight
                    : "100%", // Match spinner height to video height
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: "5",
                }}
              >
                {/* Loading Spinner */}
                <div
                  style={{
                    border:
                      "6px solid #f3f3f3" /* Light background color for the spinner */,
                    borderTop: "6px solid #3498db" /* Spinner color */,
                    borderRadius: "50%",
                    width: "50px" /* Size of the spinner */,
                    height: "50px" /* Size of the spinner */,
                    animation:
                      "spin 2s linear infinite" /* Spinner animation */,
                  }}
                ></div>
              </div>
            )}

            {isHovered && (
              <>
                <button
                  onClick={togglePlayPause}
                  style={{
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    padding: "10px",
                    cursor: "pointer",
                    fontSize: "18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: "10",
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = "rgba(0, 0, 0, 0.9)")
                  }
                  onMouseOut={(e) =>
                    (e.target.style.backgroundColor = "rgba(0, 0, 0, 0.7)")
                  }
                >
                  {isPlaying ? <FaPause /> : <FaPlay />}
                </button>

                {/* Mute button positioned on top right */}
                <button
                  onClick={handleVolumeToggle}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px", // Positioned to the top-right corner
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    padding: "10px",
                    cursor: "pointer",
                    fontSize: "18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: "10",
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = "rgba(0, 0, 0, 0.9)")
                  }
                  onMouseOut={(e) =>
                    (e.target.style.backgroundColor = "rgba(0, 0, 0, 0.7)")
                  }
                >
                  {volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
                </button>

                {/* Arrow buttons */}
                <button
                  style={{
                    position: "absolute",
                    bottom: "45px",
                    left: "10px",
                    transform: "translateY(0)",
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    color: "#FFFFFF",
                    fontSize: "24px",
                    fontWeight: "bold",
                    padding: "12px 16px",
                    borderRadius: "50%",
                    cursor: "pointer",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
                    transition: "all 0.3s ease-in-out",
                    border: "none",
                    zIndex: "5",
                  }}
                  onClick={() => handleArrowClick("left")}
                >
                  ← {/* Left Arrow */}
                </button>

                <button
                  style={{
                    position: "absolute",
                    bottom: "45px",
                    right: "10px",
                    transform: "translateY(0)",
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    color: "#FFFFFF",
                    fontSize: "24px",
                    fontWeight: "bold",
                    padding: "12px 16px",
                    borderRadius: "50%",
                    cursor: "pointer",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
                    transition: "all 0.3s ease-in-out",
                    border: "none",
                    zIndex: "5",
                  }}
                  onClick={() => handleArrowClick("right")}
                >
                  → {/* Right Arrow */}
                </button>
              </>
            )}

            {/* Arrow buttons */}
            {isHovered && (
              <>
                <button
                  style={{
                    position: "absolute",
                    bottom: "45px",
                    left: "10px",
                    transform: "translateY(0)",
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    color: "#FFFFFF",
                    fontSize: "24px",
                    fontWeight: "bold",
                    padding: "12px 16px",
                    borderRadius: "50%",
                    cursor: "pointer",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
                    transition: "all 0.3s ease-in-out",
                    border: "none",
                    zIndex: "5",
                  }}
                  onClick={() => handleArrowClick("left")}
                >
                  ← {/* Left Arrow */}
                </button>

                <button
                  style={{
                    position: "absolute",
                    bottom: "45px",
                    right: "10px",
                    transform: "translateY(0)",
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    color: "#FFFFFF",
                    fontSize: "24px",
                    fontWeight: "bold",
                    padding: "12px 16px",
                    borderRadius: "50%",
                    cursor: "pointer",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
                    transition: "all 0.3s ease-in-out",
                    border: "none",
                    zIndex: "5",
                  }}
                  onClick={() => handleArrowClick("right")}
                >
                  → {/* Right Arrow */}
                </button>
              </>
            )}

            {/* Icons section */}
            {isHovered && (
              <div
                style={{
                  position: "absolute",
                  bottom: "120px",
                  right: "10px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: "10px",
                  zIndex: "10",
                }}
              >
                <FaThumbsUp
                  style={{
                    color: "white",
                    fontSize: "24px",
                    cursor: "pointer",
                  }}
                  title="Like"
                />
                <p
                  style={{ color: "white", margin: "5px 0", fontSize: "14px" }}
                >
                  7.5K
                </p>

                <FaThumbsDown
                  style={{
                    color: "white",
                    fontSize: "24px",
                    cursor: "pointer",
                  }}
                  title="Dislike"
                />
                <p
                  style={{ color: "white", margin: "5px 0", fontSize: "14px" }}
                >
                  Dislike
                </p>

                <FaComment
                  style={{
                    color: "white",
                    fontSize: "24px",
                    cursor: "pointer",
                  }}
                  title="Comment"
                />
                <p
                  style={{ color: "white", margin: "5px 0", fontSize: "14px" }}
                >
                  18K
                </p>

                <FaShare
                  style={{
                    color: "white",
                    fontSize: "24px",
                    cursor: "pointer",
                  }}
                  title="Share"
                />
                <p
                  style={{ color: "white", margin: "5px 0", fontSize: "14px" }}
                >
                  Share
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Second Topic: Groups */}
        <div className="card mt-4" style={{ zIndex: 1 }}>
          <div
            className="d-flex align-items-center text-light p-2"
            style={{
              background: "linear-gradient(to right, #1e90ff, #87cefa)",
              color: "white",
            }}
          >
            <h5 className="text-center mb-0" style={{ fontSize: "15px" }}>
              Groups
            </h5>
          </div>
        </div>
      </div>
      <div className="p-1">
        <ul className="list-unstyled">
          {updates.map((update) => (
            <li
              key={update.id}
              className="d-flex align-items-start mb-3"
              style={{ gap: "10px" }}
            >
              <img
                src={update.avatar}
                alt={update.name}
                className="rounded-circle"
                style={{ width: "40px", height: "40px" }}
              />
              <div>
                <p className="mb-1" style={{ fontSize: "0.9rem" }}>
                  <strong>{update.name}</strong> {update.message}
                </p>
                <small className="text-muted">{update.time}</small>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LeftSidebar;
