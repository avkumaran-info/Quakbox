import React from "react";

const Topbar = ({ toggleLeftSidebar, toggleRightSidebar }) => {
  return (
    <nav className="navbar navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          Responsive Layout
        </a>
      </div>
    </nav>
  );
};

export default Topbar;
