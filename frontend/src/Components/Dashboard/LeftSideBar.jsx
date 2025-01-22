import React, { useEffect, useRef, useState } from "react";
import { FaThumbsUp, FaThumbsDown, FaComment, FaShare } from "react-icons/fa";
import video1 from "../../assets/images/leftside videos/v1.mp4";
import video2 from "../../assets/images/leftside videos/v2.mp4";
import video3 from "../../assets/images/leftside videos/v3.mp4";
import video4 from "../../assets/images/leftside videos/v4.mp4";

// Polyfill for smooth scrolling in older browsers
import smoothscroll from "smoothscroll-polyfill";
smoothscroll.polyfill();

const LeftSidebar = () => {
  const videos = [video4, video1, video2, video3];
  const videoRefs = useRef([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleVideoClick = (index) => {
    const currentVideo = videoRefs.current[index];
    if (currentVideo.paused) {
      playSingleVideo(index);
    } else {
      currentVideo.pause();
    }
  };

  const playSingleVideo = (index) => {
    videoRefs.current.forEach((video, idx) => {
      if (video) {
        if (idx === index) {
          if (video.readyState >= 3) {
            video.play();
          } else {
            video.addEventListener("canplay", () => video.play(), { once: true });
          }
          video.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        } else {
          video.pause();
        }
      }
    });
    setCurrentVideoIndex(index);
  };

  const handleArrowClick = (direction) => {
    let newIndex = currentVideoIndex;
    if (direction === "up") {
      newIndex =
        currentVideoIndex > 0 ? currentVideoIndex - 1 : videos.length - 1;
    } else if (direction === "down") {
      newIndex = (currentVideoIndex + 1) % videos.length;
    }
    playSingleVideo(newIndex);
  };

  useEffect(() => {
    if (videoRefs.current[currentVideoIndex]) {
      playSingleVideo(currentVideoIndex);
    }
  }, [currentVideoIndex]);

  return (
    <div
      className="col-md-3 d-none d-md-block bg-light position-fixed mb-5 h-100"
      style={{
        top: "55px",
        left: "0",
        boxSizing: "border-box",
        paddingBottom: "100px",
      }}
    >
      <div className="card mb-5">
        <div
          className="d-flex align-items-center text-light p-1"
          style={{
            background: "linear-gradient(to right, #1e90ff, #87cefa)",
            color: "white",
          }}
        >
          <h5 className="text-center mb-0" style={{ fontSize: "15px" }}>
            Shorts Video Player
          </h5>
        </div>

        <div
          className="scroll-container"
          style={{ textAlign: "center", maxHeight: "calc(100vh - 125px)", overflowY: "auto" }}
        >
          {videos.map((video, index) => (
            <div
              key={index}
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
                ref={(el) => (videoRefs.current[index] = el)}
                src={video}
                width="100%"
                height="500px"
                controls={false}
                muted={false}
                loop={true}
                style={{
                  border: "1px solid #ccc",
                  backgroundColor: "#000",
                  left: "0",
                  borderRadius: "25px",
                }}
                onClick={() => handleVideoClick(index)}
              />

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
                  }}
                >
                  <FaThumbsUp
                    style={{ color: "white", fontSize: "24px", cursor: "pointer" }}
                    title="Like"
                  />
                  <p style={{ color: "white", margin: "5px 0" }}>7.5K</p>

                  <FaThumbsDown
                    style={{ color: "white", fontSize: "24px", cursor: "pointer" }}
                    title="Dislike"
                  />
                  <p style={{ color: "white", margin: "5px 0" }}>Dislike</p>

                  <FaComment
                    style={{ color: "white", fontSize: "24px", cursor: "pointer" }}
                    title="Comment"
                  />
                  <p style={{ color: "white", margin: "5px 0" }}>18K</p>

                  <FaShare
                    style={{ color: "white", fontSize: "24px", cursor: "pointer" }}
                    title="Share"
                  />
                  <p style={{ color: "white", margin: "5px 0" }}>Share</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
