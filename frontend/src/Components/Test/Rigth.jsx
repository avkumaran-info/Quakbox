import React from "react";
import India from "../../assets/images/Rigth side property/Flag_of_India.svg.webp";
import news from "../../assets/images/Rigth side property/news.png";
import star from "../../assets/images/Rigth side property/star.png";
import add from "../../assets/images/Rigth side property/add.png";
import groups from "../../assets/images/Rigth side property/groups.png";
import video from "../../assets/images/Rigth side property/video.png";
import event from "../../assets/images/Rigth side property/event-accepted.png";
import adduser from "../../assets/images/Rigth side property/add-user-male.png";
import worldmap from "../../assets/images/Rigth side property/world-map.png";

const Rigth = () => {
  return (
    <div
      className="col-md-3 d-none d-md-block bg-light position-fixed"
      style={{
        height: "100vh",
        top: "56px", // Height of the topbar
        right: "0",
        bottom: "60px",
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
            <h5 className="mt-1 mb-0 text-secondary">INDIA</h5>
          </div>

          {/* Activities Section */}
          <div className="bg-light py-3">
            <h6
              className=" text-center"
              style={{
                background: "linear-gradient(to right, #c0c0c0, #c0c0c0)",
                color: "blue",
                padding: "8px",
                margin: 0,
                fontSize: "16px",
              }}
            >
              Activities
            </h6>
            <ul className="list-unstyled px-3 mt-1">
              <li className="mb-1 d-flex align-items-center">
                <img
                  src={news}
                  alt="News"
                  className="me-2"
                  style={{ width: "14px", height: "14px" }} // Reduced image size
                />
                <a
                  href="#"
                  className="text-decoration-none text-dark"
                  style={{ fontSize: "12px" }}
                >
                  News
                </a>
              </li>
              <li className="mb-1 d-flex align-items-center">
                <img
                  src={add}
                  alt="Add News"
                  className="me-2"
                  style={{ width: "14px", height: "14px" }} // Reduced image size
                />
                <a
                  href="#"
                  className="text-decoration-none text-dark"
                  style={{ fontSize: "12px" }}
                >
                  Add News
                </a>
              </li>
              <li className="mb-1 d-flex align-items-center">
                <img
                  src={groups}
                  alt="Groups"
                  className="me-2"
                  style={{ width: "14px", height: "14px" }} // Reduced image size
                />
                <a
                  href="#"
                  className="text-decoration-none text-dark"
                  style={{ fontSize: "12px" }}
                >
                  Groups
                </a>
              </li>
              <li className="mb-1 d-flex align-items-center">
                <img
                  src="https://img.icons8.com/ios-filled/24/000000/photo-gallery.png"
                  alt="Photos"
                  className="me-2"
                  style={{ width: "14px", height: "14px" }} // Reduced image size
                />
                <a
                  href="#"
                  className="text-decoration-none text-dark"
                  style={{ fontSize: "12px" }}
                >
                  Photos
                </a>
              </li>
              <li className="mb-1 d-flex align-items-center">
                <img
                  src={video}
                  alt="Videos"
                  className="me-2"
                  style={{ width: "14px", height: "14px" }} // Reduced image size
                />
                <a
                  href="#"
                  className="text-decoration-none text-dark"
                  style={{ fontSize: "12px" }}
                >
                  Videos
                </a>
              </li>
              <li className="mb-1 d-flex align-items-center">
                <img
                  src={event}
                  alt="Events"
                  className="me-2"
                  style={{ width: "14px", height: "14px" }} // Reduced image size
                />
                <a
                  href="#"
                  className="text-decoration-none text-dark"
                  style={{ fontSize: "12px" }}
                >
                  Events
                </a>
              </li>
              <li className="mb-1 d-flex align-items-center">
                <img
                  src={adduser}
                  alt="Invite Friends"
                  className="me-2"
                  style={{ width: "14px", height: "14px" }} // Reduced image size
                />
                <a
                  href="#"
                  className="text-decoration-none text-dark"
                  style={{ fontSize: "12px" }}
                >
                  Invite Friends
                </a>
              </li>
              <li className="mb-1 d-flex align-items-center">
                <img
                  src={worldmap}
                  alt="Add Country Member"
                  className="me-2"
                  style={{ width: "14px", height: "14px" }} // Reduced image size
                />
                <a
                  href="#"
                  className="text-decoration-none text-dark"
                  style={{ fontSize: "12px" }}
                >
                  Add Country Member
                </a>
              </li>
              <li className="d-flex align-items-center">
                <img
                  src={star}
                  alt="Add Favourite Country"
                  className="me-2"
                  style={{ width: "14px", height: "14px" }} // Reduced image size
                />
                <a
                  href="#"
                  className="text-decoration-none text-dark"
                  style={{ fontSize: "12px" }}
                >
                  Add Favourite Country
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rigth;
