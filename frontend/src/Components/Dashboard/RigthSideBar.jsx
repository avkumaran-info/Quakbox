import React from "react";
import India from "../../assets/images/Rigth side property/Flag_of_India.svg.webp";
import banner from "../../assets/images/Rigth side property/banner.jpeg";
import user1 from "../../assets/images/Rigth side property/user.jpg";
import user3 from "../../assets/images/Rigth side property/user3.jpg";
import user2 from "../../assets/images/Rigth side property/user2.jpeg";
import photo from "../../assets/images/Rigth side property/2.png";
import feed from "../../assets/images/Rigth side property/1.png";
import user from "../../assets/images/Rigth side property/user.png";
import news from "../../assets/images/Rigth side property/Lnews.png";
import event from "../../assets/images/Rigth side property/7.png";
import group from "../../assets/images/Rigth side property/group.png";
import notification from "../../assets/images/Rigth side property/not.png";
import set from "../../assets/images/Rigth side property/set.webp";

const RightSidebar = () => {
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

  return (
    <div
      className="col-md-3 d-none d-md-block bg-light position-fixed"
      style={{
        height: "100vh",
        top: "56px", // Height of the topbar
        right: "0",
        // bottom: "60px",
        overflowY: "auto",
      }}
    >
      <div className="card bg-light" style={{ bottom: "100px", top: "0px" }}>
        <div className="container p-0">
          {/* Country Flag */}
          <div className="bg-light text-center border-bottom">
            <img
              src={India}
              alt="India Flag"
              className="img-fluid"
              style={{
                width: "100%", // Makes the image fit the div width
                height: "200px", // Fixed height for uniformity
                objectFit: "cover", // Ensures image covers the space without distortion
              }}
            />
            <h5 className="mt-2 mb-2 text-secondary">INDIA</h5>
          </div>
          {/* ProfileCompletion */}
          {/*<div className="container mt-2 mb-1" style={{ maxWidth: "400px" }}>
            <div
              className="card shadow-sm p-1 d-flex flex-column align-items-center"
              style={{ borderRadius: "10px", border: "none" }}
            >
              <h5 className="text-center">Complete Your Profile</h5>
              <div
                className="d-flex justify-content-center align-items-center"
                style={{
                  position: "relative",
                  width: "100%",
                  height: "120px",
                  display: "flex", // Ensure it's a flex container
                  justifyContent: "center", // Horizontally center
                  alignItems: "center", // Vertically center
                }}
              >
                <svg
                  width="100"
                  height="100"
                  viewBox="0 0 36 36"
                  style={{ transform: "rotate(-90deg)" }}
                >
                  <path
                    d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#eee"
                    strokeWidth="3.8"
                  />
                  <path
                    d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#28a745"
                    strokeWidth="3.8"
                    strokeDasharray="73, 100" // Adjust the percentage dynamically here
                    strokeLinecap="round"
                    style={{
                      transition: "stroke-dasharray 1s ease-out",
                    }}
                  />
                </svg>
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                  }}
                >
                  73%
                </div>
              </div>

              <ul className="list-unstyled">
                <li className="mb-2">
                  <div className="d-flex align-items-center">
                    <input
                      className="form-check-input me-2"
                      type="checkbox"
                      checked
                      readOnly
                      style={{ width: "18px", height: "18px" }}
                    />
                    <span>Profile Photo</span>
                    <span className="ms-auto text-success fw-bold">1/1</span>
                  </div>
                </li>
                <li className="mb-2">
                  <div className="d-flex align-items-center">
                    <input
                      className="form-check-input me-2"
                      type="checkbox"
                      checked
                      readOnly
                      style={{ width: "18px", height: "18px" }}
                    />
                    <span>Cover Photo</span>
                    <span className="ms-auto text-success fw-bold">1/1</span>
                  </div>
                </li>
                <li className="mb-2">
                  <div className="d-flex align-items-center">
                    <input
                      className="form-check-input me-2"
                      type="checkbox"
                      style={{ width: "18px", height: "18px" }}
                    />
                    <span>General Information</span>
                    <span className="ms-auto text-muted">5/6</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>*/}
          {/* Profile */}
          <div className="container mt-1" style={{ maxWidth: "400px" }}>
            <div
            className="d-flex align-items-center text-light p-2"
            style={{
              background: "linear-gradient(to right, #1e90ff, #87cefa)",
              color: "white",
            }}
          >
            <h5 className="text-center mb-0" style={{ fontSize: "15px" }}>
              Activities
            </h5>
          </div>
            <div
              className="card shadow-sm"
              style={{
                backgroundColor: "#ffffff", // White background
              }}
            >
              {/* <div className="card-header p-0">
                <img
                  src={banner} // Replace with a proper banner URL
                  className="img-fluid"
                  alt="Banner"
                  style={{
                    width: "100%",
                    height: "80px",
                  }}
                />
              </div> */}
              <div className="card-body text-center">
                {/* <div
                  className="rounded-circle border border-2 mx-auto mb-2"
                  style={{
                    width: "80px",
                    height: "80px",
                    overflow: "hidden",
                    marginTop: "-50px",
                  }}
                >
                  <img
                    src={photo} // Replace with a proper profile image URL
                    className="img-fluid"
                    alt="Profile"
                  />
                </div>
                <h5 className="card-title mb-0" style={{ fontSize: "1rem" }}>
                  Sam Lanson
                </h5>
                <p className="text-muted mb-0" style={{ fontSize: "0.85rem" }}>
                  Web Developer at Webestica
                </p>
                <p className="card-text mb-1" style={{ fontSize: "0.85rem" }}>
                  I'd love to change the world, but they won’t give me the
                  source code.
                </p>
                <div className="d-flex justify-content-center mb-1">
                  <div className="me-4 text-center">
                    <h6 className="mb-0" style={{ fontSize: "0.9rem" }}>
                      256
                    </h6>
                    <small
                      className="text-muted"
                      style={{ fontSize: "0.75rem" }}
                    >
                      Post
                    </small>
                  </div>
                  <div className="me-4 text-center">
                    <h6 className="mb-0" style={{ fontSize: "0.9rem" }}>
                      2.5K
                    </h6>
                    <small
                      className="text-muted"
                      style={{ fontSize: "0.75rem" }}
                    >
                      Followers
                    </small>
                  </div>
                  <div className="text-center">
                    <h6 className="mb-0" style={{ fontSize: "0.9rem" }}>
                      365
                    </h6>
                    <small
                      className="text-muted"
                      style={{ fontSize: "0.75rem" }}
                    >
                      Following
                    </small>
                  </div>
                </div> */}
                <ul className="list-group list-group-flush text-start">
                  <li
                    className="list-group-item"
                    style={{ fontSize: "0.85rem" }}
                  >
                    <img
                      src={feed}
                      alt="Add News"
                      className="me-2"
                      style={{ width: "20px", height: "20px" }}
                    />
                    Feed
                  </li>
                  <li
                    className="list-group-item"
                    style={{ fontSize: "0.85rem" }}
                  >
                    <img
                      src={user}
                      alt="Add News"
                      className="me-2"
                      style={{ width: "20px", height: "20px" }}
                    />
                    Connections
                  </li>
                  <li
                    className="list-group-item"
                    style={{ fontSize: "0.85rem" }}
                  >
                    <img
                      src={news}
                      alt="Add News"
                      className="me-2"
                      style={{ width: "20px", height: "20px" }}
                    />
                    Latest News
                  </li>
                  <li
                    className="list-group-item"
                    style={{ fontSize: "0.85rem" }}
                  >
                    <img
                      src={event}
                      alt="Add News"
                      className="me-2"
                      style={{ width: "20px", height: "20px" }}
                    />
                    Events
                  </li>
                  <li
                    className="list-group-item"
                    style={{ fontSize: "0.85rem" }}
                  >
                    <img
                      src={group}
                      alt="Add News"
                      className="me-2"
                      style={{ width: "20px", height: "20px" }}
                    />
                    Groups
                  </li>
                  <li
                    className="list-group-item"
                    style={{ fontSize: "0.85rem" }}
                  >
                    <img
                      src={notification}
                      alt="Add News"
                      className="me-2"
                      style={{ width: "20px", height: "20px" }}
                    />
                    Notifications
                  </li>
                  <li
                    className="list-group-item"
                    style={{ fontSize: "0.85rem" }}
                  >
                    <img
                      src={set}
                      alt="Add News"
                      className="me-2"
                      style={{ width: "20px", height: "20px" }}
                    />
                    Settings
                  </li>
                </ul>
                {/* <button
                  className="btn btn-primary mt-1 w-100"
                  style={{ fontSize: "0.85rem" }}
                >
                  View Profile
                </button> */}
              </div>
            </div>
          </div>
          {/* Latest updates */}
          {/*<div
            className="container mt-1"
            style={{ maxWidth: "400px", marginBottom: "110px" }}
          >
            <div
              className="card shadow-sm p-3"
              style={{ borderRadius: "10px" }}
            >
              <h5 className="mb-4">Latest updates</h5>
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
          </div>*/}
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
