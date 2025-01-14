import React from "react";

const Footer = () => {
  return (
    <>
      <footer
        className="bg-dark text-white fixed-bottom d-flex justify-content-center align-items-center"
        style={{
          background: "linear-gradient(90deg, #c0c0c0, #c0c0c0)",
          padding: "0.2rem 0.2rem", // Minimal padding for compactness
          fontSize: "0.6rem", // Even smaller font size
          height: "auto", // Auto height to fit content
        }}
      >
        <div className="container-fluid">
          <div className="row text-center py-1 d-flex justify-content-center flex-wrap">
            {/* Icons with Labels */}
            <div className="col-auto d-flex flex-column justify-content-center align-items-center">
              <i className="fa-solid fa-globe" style={{ fontSize: "1rem" }}></i>
              <span
                className="d-none d-sm-block"
                style={{ fontSize: "0.6rem" }}
              >
                Home
              </span>
            </div>
            <div className="col-auto d-flex flex-column justify-content-center align-items-center">
              <i
                className="fa-solid fa-arrow-right"
                style={{ fontSize: "1rem" }}
              ></i>
              <span
                className="d-none d-sm-block"
                style={{ fontSize: "0.6rem" }}
              >
                Chat Room
              </span>
            </div>
            <div className="col-auto d-flex flex-column justify-content-center align-items-center">
              <i
                className="fa fa-language"
                aria-hidden="true"
                style={{ fontSize: "1rem" }}
              ></i>
              <span
                className="d-none d-sm-block"
                style={{ fontSize: "0.6rem" }}
              >
                Translate
              </span>
            </div>
            <div className="col-auto d-flex flex-column justify-content-center align-items-center">
              <i
                className="fas fa-stop-circle"
                style={{ fontSize: "1rem" }}
              ></i>
              <span
                className="d-none d-sm-block"
                style={{ fontSize: "0.6rem" }}
              >
                Translate page
              </span>
            </div>
            <div className="col-auto d-flex flex-column justify-content-center align-items-center">
              <i
                className="fa-solid fa-gamepad"
                style={{ fontSize: "1rem" }}
              ></i>
              <span
                className="d-none d-sm-block"
                style={{ fontSize: "0.6rem" }}
              >
                Games
              </span>
            </div>
            <div className="col-auto d-flex flex-column justify-content-center align-items-center">
              <i
                className="fa fa-bullhorn"
                aria-hidden="true"
                style={{ fontSize: "1rem" }}
              ></i>
              <span
                className="d-none d-sm-block"
                style={{ fontSize: "0.6rem" }}
              >
                Announcement
              </span>
            </div>
            <div className="col-auto d-flex flex-column justify-content-center align-items-center">
              <i className="fa-solid fa-share" style={{ fontSize: "1rem" }}></i>
              <span
                className="d-none d-sm-block"
                style={{ fontSize: "0.6rem" }}
              >
                Share
              </span>
            </div>
            <div className="col-auto d-flex flex-column justify-content-center align-items-center">
              <i
                className="fa-solid fa-arrow-up"
                style={{ fontSize: "1rem" }}
              ></i>
              <span
                className="d-none d-sm-block"
                style={{ fontSize: "0.6rem" }}
              >
                Scroll
              </span>
            </div>
            <div className="col-auto d-flex flex-column justify-content-center align-items-center">
              <i
                className="fas fa-broadcast-tower"
                style={{ fontSize: "1rem" }}
              ></i>
              <span
                className="d-none d-sm-block"
                style={{ fontSize: "0.6rem" }}
              >
                Broadcast
              </span>
            </div>
            <div className="col-auto d-flex flex-column justify-content-center align-items-center d-none d-sm-block">
              <i
                className="fa-brands fa-facebook-f"
                style={{ fontSize: "1rem" }}
              ></i>
              <span
                className="d-none d-sm-block"
                style={{ fontSize: "0.6rem" }}
              >
                Facebook
              </span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
