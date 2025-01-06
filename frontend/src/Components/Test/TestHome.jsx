import React, { useState } from "react";
import LeftSidebar from "./LeftSidebar ";
import Topbar from "./Topbar";
import Content from "./Content ";
import RightSidebar from "./RightSidebar ";

const TestHome = () => {
  return (
    <div>
      {/* Topbar */}
      <Topbar />

      {/* Layout */}
      <div className="d-flex" style={{ height: "100vh", overflow: "hidden" }}>
        {/* Left Sidebar (Hidden on Small Screens) */}
        <LeftSidebar />

        {/* Main Content */}
        <div
          className="flex-grow-1 overflow-auto"
          style={{
            marginTop: "56px", // Height of the topbar
          }}
        >
          <Content />
        </div>

        {/* Right Sidebar (Hidden on Small Screens) */}
        <RightSidebar />
      </div>
    </div>
  );
};

export default TestHome;
