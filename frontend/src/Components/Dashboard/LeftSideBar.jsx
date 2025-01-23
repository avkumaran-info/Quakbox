import React, { useState, useRef } from "react";
import {
  FaThumbsUp,
  FaThumbsDown,
  FaComment,
  FaShare,
  FaPlay,
  FaPause,
} from "react-icons/fa";
import video1 from "../../assets/images/leftside videos/v1.mp4";
import video2 from "../../assets/images/leftside videos/v2.mp4";
import video3 from "../../assets/images/leftside videos/v3.mp4";
import video4 from "../../assets/images/leftside videos/v4.mp4";
import user1 from "../../assets/images/Rigth side property/user.jpg";
import user3 from "../../assets/images/Rigth side property/user3.jpg";
import user2 from "../../assets/images/Rigth side property/user2.jpeg";
import user from "../../assets/images/Rigth side property/user.png";

const LeftSidebar = () => {
  const videos = [video4, video1, video2, video3];
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true); // Track play/pause state
  const videoRef = useRef(null);

  const updates = [
    {
      id: 1,
      name: "John",
      message: "posted an update",
      avatar: user, // Replace with actual image URL
      time: "a year ago",
    },
    {
      id: 2,
      name: "Adele",
      message: "posted an update",
      avatar: user1, // Replace with actual image URL
      time: "a year ago",
    },
    {
      id: 3,
      name: "John",
      message: "posted an update",
      avatar: user2, // Replace with actual image URL
      time: "2 years ago",
    },
    {
      id: 4,
      name: "John",
      message: "posted an update in the group ☕ Coffee Addicts",
      avatar: user3, // Replace with actual image URL
      time: "2 years ago",
    },
    {
      id: 5,
      name: "John",
      message: "posted an update",
      avatar: user, // Replace with actual image URL
      time: "2 years ago",
    },
  ];

  const handleArrowClick = (direction) => {
    if (direction === "up") {
      setCurrentVideoIndex(
        currentVideoIndex > 0 ? currentVideoIndex - 1 : videos.length - 1
      );
    } else if (direction === "down") {
      setCurrentVideoIndex((currentVideoIndex + 1) % videos.length);
    }
    setIsPlaying(true); // Reset to playing state when changing videos
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

  return (
    <div
      className="col-md-3 d-none d-md-block bg-light position-fixed mb-5 h-100"
      style={{
        top: "55px",
        left: "0",
        height: "550px !important",
        boxSizing: "border-box",
        paddingBottom: "100px",
        overflowY: "auto", // Make the entire sidebar scrollable
      }}
    >
      <div className="card mb-5">
        <div
          className="video-container"
          style={{
            textAlign: "center",
            maxHeight: "calc(100vh - 125px)",
            position: "relative",
            marginBottom: "28px", // Space between video and groups
          }}
        >
          <div
            style={{
              marginBottom: "5px",
              width: "100%",
              maxWidth: "400px",
              margin: "0 auto",
              position: "relative",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <video
              ref={videoRef}
              src={videos[currentVideoIndex]}
              width="100%"
              height="545px"
              controls={false}
              muted={false}
              loop={true}
              autoPlay={true}
              style={{
                border: "1px solid #ccc",
                backgroundColor: "#000",
                left: "0",
                borderTopLeftRadius: "0px", // No border radius for top left corner
                borderTopRightRadius: "0px", // No border radius for top right corner
                borderBottomLeftRadius: "15px", // Rounded bottom left corner
                borderBottomRightRadius: "15px", // Rounded bottom right corner
                position: "sticky", // Keep the video sticky at the top
                top: "0", // Fix the video at the top of the sidebar
                zIndex: "1", // Ensure it's on top of other content
              }}
            />

            {/* Pause/Play Button in Top-Left Corner (Visible on Hover) */}
            {isHovered && (
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
                  zIndex: "10", // Ensure the button is on top of the video
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
            )}

            {/* Up and Down Arrow Buttons */}
            {isHovered && (
              <>
                <button
                  style={{
                    position: "absolute",
                    top: "10px",
                    left: "50%",
                    transform: "translateX(-50%)",
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
                    zIndex: "10", // Ensure it's on top of the video
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = "rgba(0, 0, 0, 0.9)")
                  }
                  onMouseOut={(e) =>
                    (e.target.style.backgroundColor = "rgba(0, 0, 0, 0.7)")
                  }
                  onClick={() => handleArrowClick("up")}
                >
                  ↑
                </button>

                <button
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    left: "50%",
                    transform: "translateX(-50%)",
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
                    zIndex: "10", // Ensure it's on top of the video
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = "rgba(0, 0, 0, 0.9)")
                  }
                  onMouseOut={(e) =>
                    (e.target.style.backgroundColor = "rgba(0, 0, 0, 0.7)")
                  }
                  onClick={() => handleArrowClick("down")}
                >
                  ↓
                </button>
              </>
            )}

            {/* All icons appear on hover */}
            {isHovered && (
              <div
                style={{
                  position: "absolute",
                  bottom: "60px",
                  right: "10px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                  zIndex: "10", // Ensure the icons appear on top
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
                <p style={{ color: "white", margin: "5px 0" }}>7.5K</p>

                <FaThumbsDown
                  style={{
                    color: "white",
                    fontSize: "24px",
                    cursor: "pointer",
                  }}
                  title="Dislike"
                />
                <p style={{ color: "white", margin: "5px 0" }}>Dislike</p>

                <FaComment
                  style={{
                    color: "white",
                    fontSize: "24px",
                    cursor: "pointer",
                  }}
                  title="Comment"
                />
                <p style={{ color: "white", margin: "5px 0" }}>18K</p>

                <FaShare
                  style={{
                    color: "white",
                    fontSize: "24px",
                    cursor: "pointer",
                  }}
                  title="Share"
                />
                <p style={{ color: "white", margin: "5px 0" }}>Share</p>
              </div>
            )}
          </div>
        </div>

        {/* Second Topic: Groups */}
        <div className="card">
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

          <div className="card shadow-sm p-3">
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
      </div>
    </div>
  );
};

export default LeftSidebar;
