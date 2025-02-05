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
import { FaThumbsUp, FaThumbsDown, FaComment, FaShare } from "react-icons/fa";
import {
  FaGlobe,
  FaHandPaper,
  FaUserPlus,
  FaBroadcastTower,
} from "react-icons/fa"; // Import icons
import "./LeftsideBar.css";
const LeftSidebar = ({ countryCode, flag, countryName }) => {
  const videos = [video4, video1, video2, video3];
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1); // Default volume is 100%
  const [isLoading, setIsLoading] = useState(true); // Loading state for video
  const [navbarHeight, setNavbarHeight] = useState(56);
  const [showIcons, setShowIcons] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedPrivacy, setSelectedPrivacy] = useState("");

  // Function to handle icon click
  const handleIconClick = (privacy) => {
    console.log(privacy);
    console.log("hiii");
    setIsPopupOpen(true);
    console.log(isPopupOpen);

    setSelectedPrivacy(privacy);
  };

  // Function to close the popup
  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const groups = [
    "Group 1",
    "Group 2",
    "Group 3",
    "Group 4",
    "Group 5",
    "Group 6",
    "Group 7",
    "Group 8",
    "Group 9",
    "Group 10",
    "Group 11",
    "Group 12",
    "Group 13",
  ];
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
    <>
      {/* Popup */}
      {isPopupOpen && (
        <>
          {/* Background Overlay */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0, 0, 0, 0.3)", // Light transparent overlay for popup effect
              zIndex: "99",
            }}
            onClick={closePopup} // Close when clicking outside
          ></div>

          {/* Popup Box */}
          <div
            className="popup-box"
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "white", // White background
              color: "black",
              width: "420px",
              padding: "20px",
              borderRadius: "15px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Softer shadow
              textAlign: "center",
              zIndex: "100",
            }}
          >
            {/* Close Button in Top Right Corner */}
            <button
              onClick={closePopup}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "transparent",
                border: "none",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              ✖
            </button>

            <h4
              style={{
                fontSize: "18px",
                fontWeight: "600",
                marginBottom: "15px",
              }}
            >
              Live setup
            </h4>

            {/* Privacy Option */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#f3f3f3",
                padding: "12px",
                borderRadius: "10px",
                marginBottom: "10px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <i className="fas fa-user-friends"></i>
                <div>
                  <p style={{ margin: 0, fontWeight: "500" }}>
                    {selectedPrivacy}
                  </p>
                </div>
              </div>
            </div>

            {/* Input Fields */}
            <input
              type="text"
              placeholder="Add a title (optional)"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #ddd",
                background: "#f9f9f9",
                color: "black",
                marginBottom: "10px",
              }}
            />

            {/* Toggle Button */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#f9f9f9",
                padding: "12px",
                borderRadius: "10px",
                marginBottom: "10px",
              }}
            >
              <span>Allow in-room chat</span>
              <input
                type="checkbox"
                checked={true}
                style={{ transform: "scale(1.2)" }}
              />
            </div>

            {/* Pinned Link */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#f9f9f9",
                padding: "12px",
                borderRadius: "10px",
                marginBottom: "15px",
              }}
            >
              <span>Pinned link</span>
              <i className="fas fa-chevron-right"></i>
            </div>

            {/* Go Live Button */}
            <button
              onClick={closePopup}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "50px",
                border: "none",
                background: "#007bff",
                color: "white",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              🎙️ Go Live
            </button>
          </div>
        </>
      )}

      <div
        className="col-md-3 d-none d-md-block bg-light position-fixed responsive-div"
        style={{
          height: "100vh",
          top: "56px",
          left: "0",
          paddingBottom: "54px",
        }}
      >
        <div className="card" style={{ height: "100%" }}>
          <div className="container p-0">
            {/* Video Section */}
            <Box
              sx={{
                height: "50vh",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "2px",
                position: "relative", // Ensure hover works
                // border: "1px solid yellow",
                "@media (max-width: 991px)": {
                  width: "100%",
                  // maxWidth: "30rem",
                  height: "50vh",
                  // maxHeight: "10rem",
                  position: "relative",
                  top: "0px",
                  bottom: "0px",
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
                disablePictureInPicture
                controlsList="nodownload nofullscreen"
                onClick={(e) => {
                  if (e.target.paused) {
                    e.target.play();
                  } else {
                    e.target.pause();
                  }
                }}
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
              {/* {isHovered && (
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
               
              </div>
            )} */}
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
                    bottom: "90px",
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
                      fontSize: "15px",
                      cursor: "pointer",
                    }}
                    title="Like"
                  />
                  <p
                    style={{
                      color: "white",
                      margin: "2px 0",
                      fontSize: "10px",
                    }}
                  >
                    7.5K
                  </p>

                  <FaThumbsDown
                    style={{
                      color: "white",
                      fontSize: "15px",
                      cursor: "pointer",
                    }}
                    title="Dislike"
                  />
                  <p
                    style={{
                      color: "white",
                      margin: "2px 0",
                      fontSize: "10px",
                    }}
                  >
                    Dislike
                  </p>

                  <FaComment
                    style={{
                      color: "white",
                      fontSize: "15px",
                      cursor: "pointer",
                    }}
                    title="Comment"
                  />
                  <p
                    style={{
                      color: "white",
                      margin: "2px 0",
                      fontSize: "10px",
                    }}
                  >
                    18K
                  </p>

                  <FaShare
                    style={{
                      color: "white",
                      fontSize: "15px",
                      cursor: "pointer",
                    }}
                    title="Share"
                  />
                  <p
                    style={{
                      color: "white",
                      margin: "2px 0",
                      fontSize: "10px",
                    }}
                  >
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
                    left: "15%", // Default value for larger screens
                    top: "40%",
                    transform: "translateY(-50%)",
                    fontSize: "40px",
                    color: "#FFFFFF", // White arrow color
                    cursor: "pointer",
                    border: "none",
                    background: "none", // Ensure no background
                    zIndex: "5",
                    "@media (max-width: 991px)": {
                      left: "20%", // Adjust for medium to small screens
                    },
                    "@media (max-width: 576px)": {
                      left: "20%", // Adjust for very small screens
                    },
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
                    right: "15%", // Default value for larger screens
                    top: "40%",
                    transform: "translateY(-50%)",
                    fontSize: "40px",
                    color: "#FFFFFF", // White arrow color
                    cursor: "pointer",
                    border: "none",
                    background: "none", // Ensure no background
                    zIndex: "5",
                    "@media (max-width: 991px)": {
                      right: "20%", // Adjust for medium to small screens
                    },
                    "@media (max-width: 576px)": {
                      right: "20%", // Adjust for very small screens
                    },
                  }}
                  onClick={() => handleArrowClick("left")}
                >
                  →
                </button>
              )}
            </Box>
            {/* Groups Section */}
            <Box
              className="mb-5"
              sx={{
                height: "35%",
                maxHeight: "calc(100vh - 56px - 200px - 54px)",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                margin: "0px",
                padding: "0px",
                paddingBottom: showIcons ? "60px" : "0px", // Add padding when icons are visible
                "@media (max-width: 991px)": {
                  width: "100%",
                  height: "50vh",
                  position: "relative",
                  top: "0px",
                },
              }}
            >
              {/* Groups Heading - Fixed on Top */}
              <div
                className="d-flex justify-content-between align-items-center p-2 text-white rounded-top"
                style={{
                  background: "linear-gradient(to right, #1e90ff, #87cefa)",
                  color: "white",
                  position: "sticky",
                  top: "0", // Make it stick at the top
                  zIndex: "10", // Ensure it stays above the content
                }}
              >
                <h5 className="text-center mb-0" style={{ fontSize: "15px" }}>
                  Groups
                </h5>
                <div className="d-flex align-items-center">
                  <div
                    className="rounded-circle bg-light text-dark d-flex align-items-center justify-content-center me-2"
                    style={{
                      width: "30px",
                      height: "30px",
                      fontSize: "18px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                    onClick={() => setShowIcons(!showIcons)} // Toggle visibility
                  >
                    +
                  </div>
                </div>
              </div>

              {/* Groups List */}
              <div className="list-group p-1">
                {groups.map((group, index) => (
                  <div
                    key={index}
                    className="list-group-item d-flex justify-content-between align-items-center border rounded mb-2 shadow-sm"
                  >
                    <span>{group}</span>
                    <div className="d-flex align-items-center">
                      <img
                        src="https://randomuser.me/api/portraits/men/1.jpg"
                        alt="User"
                        className="rounded-circle me-1"
                        style={{ width: "30px", height: "30px" }}
                      />
                      <img
                        src="https://randomuser.me/api/portraits/women/1.jpg"
                        alt="User"
                        className="rounded-circle me-1"
                        style={{ width: "30px", height: "30px" }}
                      />
                      <div
                        className="rounded-circle bg-light text-dark d-flex align-items-center justify-content-center"
                        style={{
                          width: "30px",
                          height: "30px",
                          fontSize: "14px",
                        }}
                      >
                        +25
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Icons Section */}
              {showIcons && (
                <div
                  className="d-flex justify-content-around align-items-center p-2"
                  style={{
                    position: "absolute",
                    bottom: "0",
                    left: "0",
                    width: "100%",
                    background: "#7a8187", // Semi-transparent background
                    color: "white",
                    zIndex: "20",
                  }}
                >
                  <div
                    className="d-flex flex-column align-items-center"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleIconClick("Public")}
                  >
                    <i className="fa-solid fa-earth-americas"></i>{" "}
                    <span style={{ fontSize: "8px" }}>Pubilc</span>
                  </div>
                  <div
                    className="d-flex flex-column align-items-center"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleIconClick("Friends of Friends")}
                  >
                    <i className="fa-solid fa-hands-clapping"></i>{" "}
                    <span style={{ fontSize: "8px" }}>Friends of friends</span>
                  </div>
                  <div
                    className="d-flex flex-column align-items-center"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleIconClick("Friends Only")}
                  >
                    <i className="fa-solid fa-user-group"></i>{" "}
                    <span style={{ fontSize: "8px" }}>Friends Only</span>
                  </div>
                  <div
                    className="d-flex align-items-center"
                    style={{
                      background: "#6c757d", // Background color from image
                      color: "white", // Text color
                      borderRadius: "20px", // Rounded background
                      padding: "6px 12px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px", // Space between icon and text
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        background: "#007bff", // Blue circular button
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <i className="fa-solid fa-broadcast-tower"></i>{" "}
                      {/* Live stream icon */}
                    </div>
                    <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                      tap to go live
                    </span>
                  </div>
                </div>
              )}
            </Box>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeftSidebar;
