import React, { useState, useRef, useEffect } from "react";
import video1 from "../../assets/images/leftside videos/v1.mp4";
import video2 from "../../assets/images/leftside videos/v2.mp4";
import video3 from "../../assets/images/leftside videos/v3.mp4";
import video4 from "../../assets/images/leftside videos/v4.mp4";
import user1 from "../../assets/images/Rigth side property/user.jpg";
import user3 from "../../assets/images/Rigth side property/user3.jpg";
import user2 from "../../assets/images/Rigth side property/user2.jpeg";
import user from "../../assets/images/Rigth side property/user.png";
import { Box, Typography } from "@mui/material";

const LeftSidebar = ({ countryCode, flag, countryName }) => {
  const videos = [video4, video1, video2, video3];
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1); // Default volume is 100%
  const [isLoading, setIsLoading] = useState(true); // Loading state for video
  const [navbarHeight, setNavbarHeight] = useState(56);

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
    // <Box
    //   sx={{
    //     width: "370px",
    //     position: "fixed",
    //     height: "85vh",
    //     backgroundColor: "#f5f5f5",
    //     display: "flex",
    //     flexDirection: "column",
    //     // margin: "10px",
    //     padding: "2px",
    //     borderRadius: "10px",
    //     // border: "1px solid red",
    //   }}
    // >
    <Box
      className="col-md-3 d-none d-md-block bg-light position-fixed"
      sx={{

        width: "100%",
        maxWidth: "21rem",

        position: "fixed",
        height: "85vh",
        backgroundColor: "#f5f5f5",
        display: "flex",
        flexDirection: "column",
        padding: "2px",
        borderRadius: "10px",
        "@media (max-width: 991px)": {
          width: "100%",
          maxWidth: "30rem",
          height: "100vh",
          // maxHeight: "10rem",
          position: "relative",
        },
      }}
    >
      {/* Video Section */}
      <Box
        sx={{
          height: "50%",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative", // Ensure hover works
          // border: "1px solid yellow",
          "@media (max-width: 991px)": {
            width: "100%",
            // maxWidth: "30rem",
            height: "100vh",
            // maxHeight: "10rem",
            position: "relative",
            top: "112px",
          },
        }}
        onMouseEnter={() => setIsHovered(true)} // Show buttons on hover
        onMouseLeave={() => setIsHovered(false)} // Hide buttons when not hovering
      >
        <video
          ref={videoRef}
          src={videos[currentVideoIndex]}
          width="100%"
          height="100%"
          controls
          muted={volume === 0}
          loop={false}
          autoPlay={false}
          style={{
            backgroundColor: "#000",
            border: "1px solid #ccc",
            zIndex: "0",
          }}
          onLoadedData={handleLoadedData}
        >
          <source src={videos[currentVideoIndex]} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Loading Spinner */}
        {isLoading && (
          <div
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: "5",
            }}
          >
            <div
              style={{
                border: "6px solid #f3f3f3",
                borderTop: "6px solid #3498db",
                borderRadius: "50%",
                width: "50px",
                height: "50px",
                animation: "spin 2s linear infinite",
              }}
            ></div>
          </div>
        )}

        {/* Video Controls */}
        {/* Video Controls 1 */}
        {isHovered && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              zIndex: "10", // Ensure controls are above video
              display: "flex",
              justifyContent: "space-between",
              width: "calc(100% - 20px)",
            }}
          >
            {/* Play/Pause Button */}
            {/* <button
              onClick={togglePlayPause}
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                color: "white",
                border: "none",
                borderRadius: "50%",
                padding: "10px",
                cursor: "pointer",
              }}
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button> */}

            {/* Mute Button */}
            {/* <button
              onClick={handleVolumeToggle}
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                color: "white",
                border: "none",
                borderRadius: "50%",
                padding: "10px",
                cursor: "pointer",
              }}
            >
              {volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
            </button> */}
          </div>
        )}
        {/* Video Controls 2 */}
        {/* {isHovered && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              zIndex: "10",
              display: "flex",
              justifyContent: "space-between",
              gap: "10px",
              width: "calc(100% - 20px)",
            }}
          >
            <button
              onClick={togglePlayPause}
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                color: "white",
                border: "none",
                borderRadius: "50%",
                padding: "10px",
                cursor: "pointer",
              }}
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => {
                  const newVolume = parseFloat(e.target.value);
                  setVolume(newVolume);
                  if (videoRef.current) {
                    videoRef.current.volume = newVolume; 
                  }
                }}
                style={{
                  width: "100px",
                  cursor: "pointer",
                  background: "#ccc",
                  appearance: "none",
                  height: "5px",
                  borderRadius: "5px",
                  transition: "opacity 0.3s",
                }}
              />
              <button
                onClick={handleVolumeToggle}
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  padding: "10px",
                  cursor: "pointer",
                }}
              >
                {volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
              </button>
            </div>
          </div>
        )} */}
        {/* Video Controls end */}
        {/* Icons section */}
        {isHovered && (
          <div
            style={{
              position: "absolute",
              bottom: "65px",
              right: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "5px",
              zIndex: "10",
            }}
          >
            <FaThumbsUp
              style={{
                color: "white",
                fontSize: "17px",
                cursor: "pointer",
              }}
              title="Like"
            />
            <p style={{ color: "white", margin: "5px 0", fontSize: "12px" }}>
              7.5K
            </p>

            <FaThumbsDown
              style={{
                color: "white",
                fontSize: "17px",
                cursor: "pointer",
              }}
              title="Dislike"
            />
            <p style={{ color: "white", margin: "5px 0", fontSize: "14px" }}>
              Dislike
            </p>

            <FaComment
              style={{
                color: "white",
                fontSize: "17px",
                cursor: "pointer",
              }}
              title="Comment"
            />
            <p style={{ color: "white", margin: "5px 0", fontSize: "14px" }}>
              18K
            </p>

            <FaShare
              style={{
                color: "white",
                fontSize: "17px",
                cursor: "pointer",
              }}
              title="Share"
            />
            <p style={{ color: "white", margin: "5px 0", fontSize: "14px" }}>
              Share
            </p>
          </div>
        )}
        {/* Left Arrow Button */}

        {/* <button
          style={{
            position: "absolute",
            left: "70px",
            top: "40%", // Center vertically
            transform: "translateY(-50%)", // Align center
            // transform: "translateY(0)",
            // backgroundColor: "rgba(0, 0, 0, 0.7)",
            // color: "#FFFFFF",
            fontSize: "40px",
            // fontWeight: "bold",
            // padding: "12px 16px",
            borderRadius: "50%",
            cursor: "pointer",
            // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
            transition: "all 0.3s ease-in-out",
            border: "none",
            zIndex: "5",
          }}
          onClick={() => handleArrowClick("left")}
        >
          ← 
        </button> */}
        {isHovered && (
          <button
            style={{
              position: "absolute",
              left: "70px",
              top: "40%",
              transform: "translateY(-50%)",
              fontSize: "40px",
              color: "#FFFFFF", // White arrow color
              cursor: "pointer",
              border: "none",
              background: "none", // Ensure no background
              zIndex: "5",
            }}
            onClick={() => handleArrowClick("left")}
          >
            ← {/* Left Arrow */}
          </button>
        )}

        {/* Right Arrow Button */}
        {/* {isHovered && ( */}
        {/* <button
          style={{
            position: "absolute",
            right: "70px",
            top: "40%", // Center vertically
            transform: "translateY(-50%)", // Align center
            // transform: "translateY(0)",
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
          → 
        </button> */}
        {isHovered && (
          <button
            style={{
              position: "absolute",
              right: "70px",
              top: "40%",
              transform: "translateY(-50%)",
              fontSize: "40px",
              color: "#FFFFFF", // White arrow color
              cursor: "pointer",
              border: "none",
              background: "none", // Ensure no background
              zIndex: "5",
            }}
            onClick={() => handleArrowClick("left")}
          >
            →
          </button>
        )}
      </Box>

      {/* Groups Section */}
      <Box
        sx={{
          height: "50%",
          overflowY: "auto",
          // border: "1px solid blue",
          // padding: "10px",
          display: "flex",
          flexDirection: "column",
          margin: "0px",
          padding: "0px",
          "@media (max-width: 991px)": {
            width: "100%",
            // maxWidth: "30rem",
            height: "100vh",
            // maxHeight: "10rem",
            position: "relative",
            top: "115px",
          },
        }}
      >
        {/* Groups Heading */}
        <div
          className="d-flex align-items-center text-light p-2"
          style={{
            background: "linear-gradient(to right, #1e90ff, #87cefa)",
            color: "white",
            height: "15%", // Adjust this value to 10% or 20% as per your preference
            justifyContent: "flex-start",
            position: "sticky", // Ensures the header stays at the top when scrolling
            top: "0", // Ensures it sticks to the top of the container
            zIndex: "1",
            marginBottom: "0px",
            margin: "0px",
            padding: "0px",
          }}
        >
          <h5
            className="text-center mb-0"
            style={{ fontSize: "15px", marginLeft: "10px" }}
          >
            Groups
          </h5>
        </div>

        {/* List of Comments (taking the remaining space) */}
        <ul
          className="list-unstyled"
          style={{
            overflowY: "auto",
            height: "80%", // Adjust this value to 80% or 90% based on the Groups heading height
            padding: "0px",
            margin: "0px",
            // marginLeft: "5px",
          }}
        >
          {updates.map((update) => (
            <li
              key={update.id}
              className="d-flex align-items-start m-1"
              style={{
                gap: "10px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
                borderRadius: "10px",
                margin: "0px",
              }}
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
      </Box>
    </Box>
  );
};

export default LeftSidebar;
