import React, { useState } from "react";
import QNavBar from "./QNavBar";
import QSidebar from "./QSidebar";
import NavBar from "../Dashboard/NavBar";
import QVideos from "./QVideos";

const QHomw = () => {
  // Initialize the sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Toggle the sidebar open/close state
  const toggleSidebar = () => {
    setSidebarOpen((prevState) => !prevState);
  };

  return (
    <>
      <NavBar />
      <div
        style={{
          marginTop: "56px",
          flex: 1,
          transition: "margin 0.3s",
          marginRight: sidebarOpen ? "250px" : "60px", // Adjust margin when sidebar is toggled
        }}
      >
        {/* Pass the isOpen prop and toggleSidebar to QNavBar */}
        <QNavBar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        <div className="">
          <div
            style={{
              padding: "5px",
              transition: "margin 0.3s",
            }}
          >
            <QVideos isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          </div>

          {/* Pass the isOpen prop and toggleSidebar to QSidebar */}
          <QSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        </div>
      </div>
    </>
  );
};

export default QHomw;
