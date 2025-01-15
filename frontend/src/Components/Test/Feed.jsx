import React, { useEffect, useState } from "react";
import userImage from "../../assets/images/vector-users-icon.jpg";
import logo from "../../assets/images/quak_logo.png";
import imag3 from "../../assets/images/login-illustration .png";

const Feed = () => {
  const [navbarHeight, setNavbarHeight] = useState(52); // Default navbar height

  useEffect(() => {
    // Function to determine the navbar height based on screen size
    const updateNavbarHeight = () => {
      if (window.innerWidth <= 768) {
        setNavbarHeight(90); // Smaller screen height
      } else {
        setNavbarHeight(48); // Larger screen height
      }
    };

    // Update navbar height on load and when the window is resized
    updateNavbarHeight();
    window.addEventListener("resize", updateNavbarHeight);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener("resize", updateNavbarHeight);
    };
  }, []);
  return (
    <>
      <div
        className="col-12 col-md-6 offset-md-3 p-2"
        style={{
          marginTop: `${navbarHeight}px`,
          marginBottom: "60px",
          // paddingBottom: "100px",
        }}
      >
        <div className="text-white p-0 rounded">
          {/* Post Input Section */}
          <div className="card p-3 mb-4">
            <div className="d-flex align-items-center">
              <img
                src={userImage}
                alt="Profile"
                className="rounded-circle me-2"
                style={{ width: "40px", height: "40px" }}
              />
              <input
                type="text"
                className="form-control"
                placeholder="What's on your mind?"
                style={{ fontSize: "16px" }}
              />
            </div>
            <div className="d-flex justify-content-between flex-wrap mt-3">
              <button className="btn btn-light d-flex align-items-center flex-grow-1 m-1">
                <i className="fa fa-video me-2 text-danger"></i> Live video
              </button>
              <button className="btn btn-light d-flex align-items-center flex-grow-1 m-1">
                <i className="fa fa-image me-2 text-success"></i> Photo/video
              </button>
            </div>
          </div>

          {/* Example Posts */}
          {[1, 2, 3].map((_, index) => (
            <div className="card mb-4" key={index}>
              <div className="card-header d-flex align-items-center bg-white border-0">
                <img
                  src={userImage}
                  alt="User Avatar"
                  className="rounded-circle me-2"
                  style={{ width: "40px", height: "40px" }}
                />
                <div>
                  <h6 className="mb-0">Pream Ba</h6>
                  <small className="text-muted">
                    January 1 at 11:21 PM · 🌎
                  </small>
                </div>
              </div>
              <div className="card-body p-0">
                <img
                  src={index === 0 ? userImage : imag3}
                  alt="Post Content"
                  className="img-fluid w-100"
                />
              </div>
              <div className="card-footer bg-white d-flex justify-content-between align-items-center border-0">
                <span className="text-muted">16 others</span>
                <div className="d-flex">
                  <button className="btn btn-light btn-sm me-2">
                    <i className="bi bi-hand-thumbs-up"></i> Like
                  </button>
                  <button className="btn btn-light btn-sm me-2">
                    <i className="bi bi-chat"></i> Comment
                  </button>
                  <button className="btn btn-light btn-sm">
                    <i className="bi bi-share"></i> Share
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Feed;
