import React from "react";

const LeftSidebar = () => {
  return (
    <div
      className="col-3 bg-light position-fixed d-none d-md-block"
      style={{
        // width: "200px",
        height: "100vh",
        top: "56px", // Height of the topbar
        left: "0",
      }}
    >
      <ul className="nav flex-column p-3">
        <li className="nav-item">
          <a className="nav-link text-black" href="#">
            Dashboard
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link text-black" href="#">
            Profile
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link text-black" href="#">
            Settings
          </a>
        </li>
      </ul>
    </div>
  );
};

export default LeftSidebar;
