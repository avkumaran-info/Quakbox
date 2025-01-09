import React from "react";

const Footer = () => {
  return (
    <>
      <footer
        className="bg-dark text-white fixed-bottom"
        style={{
          background: "linear-gradient(90deg, #1e90ff, #87cefa)",
          padding: "0.4rem 0.5rem", // Compact padding
          fontSize: "0.8rem", // Smaller font size
        }}
      >
        <div className="container-fluid">
          <div className="row text-center py-1 d-flex justify-content-center flex-wrap">
            {/* Icons with Labels */}
            <div className="col-auto d-flex flex-column justify-content-center align-items-center">
              <i className="fa-solid fa-globe"></i>
              <span className="d-none d-sm-block">Home</span>{" "}
              {/* Hide text on small screens */}
            </div>
            <div className="col-auto d-flex flex-column justify-content-center align-items-center">
              <i className="fa-solid fa-arrow-right"></i>
              <span className="d-none d-sm-block">Chat Room</span>
            </div>
            <div className="col-auto d-flex flex-column justify-content-center align-items-center">
              <i className="fa fa-language" aria-hidden="true"></i>
              <span className="d-none d-sm-block">Translate</span>
            </div>
            <div className="col-auto d-flex flex-column justify-content-center align-items-center">
              <i className="fas fa-stop-circle"></i>
              <span className="d-none d-sm-block">Translate page</span>
            </div>
            <div className="col-auto d-flex flex-column justify-content-center align-items-center">
              <i className="fa-solid fa-gamepad"></i>
              <span className="d-none d-sm-block">Single Player Games</span>
            </div>
            <div className="col-auto d-flex flex-column justify-content-center align-items-center">
              <i className="fa fa-bullhorn" aria-hidden="true"></i>
              <span className="d-none d-sm-block">Announcement</span>
            </div>
            <div className="col-auto d-flex flex-column justify-content-center align-items-center">
              <i className="fa-solid fa-share"></i>
              <span className="d-none d-sm-block">Share</span>
            </div>
            <div className="col-auto d-flex flex-column justify-content-center align-items-center">
              <i className="fa-solid fa-arrow-up"></i>
              <span className="d-none d-sm-block">Scroll to Top</span>
            </div>
            <div className="col-auto d-flex flex-column justify-content-center align-items-center">
              <i className="fas fa-broadcast-tower"></i>
              <span className="d-none d-sm-block">Broadcast</span>
            </div>
            <div className="col-auto d-flex flex-column justify-content-center align-items-center d-none d-sm-block">
              <i className="fa-brands fa-facebook-f"></i>
              <span className="d-none d-sm-block">Facebook</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
