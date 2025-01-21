import React, { useEffect, useState } from "react";

const Tests = () => {
  const [navbarHeight, setNavbarHeight] = useState(54); // Default height for larger screens

  useEffect(() => {
    // Function to update the navbar height based on screen size
    const updateNavbarHeight = () => {
      if (window.innerWidth <= 768) {
        setNavbarHeight(91); // Height for smaller screens
      } else {
        setNavbarHeight(54); // Height for larger screens
      }
    };

    // Update navbar height on load and window resize
    updateNavbarHeight();
    window.addEventListener("resize", updateNavbarHeight);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener("resize", updateNavbarHeight);
    };
  }, []);

  return (
    <div className="app">
      {/* Navbar */}
      <nav
        className="fixed-top d-flex align-items-center justify-content-start"
        style={{
          backgroundColor: "rgb(122, 129, 135)",
          borderBottom: "3px solid blue",
          height: `${navbarHeight}px`,
          color: "white",
          padding: "0 1rem",
        }}
      >
        NavBar
      </nav>

      {/* Content */}
      <div className="container-fluid mt-4">
        <div className="row" style={{ marginTop: `${navbarHeight}px` }}>
          {/* Left Sidebar */}
          <div
            className="col-md-3 d-none d-md-block bg-light position-fixed"
            style={{
              top: `${navbarHeight}px`,
              bottom: "60px", // Height of the footer
              left: "0",
              overflowY: "auto",
            }}
          >
            LEFT
          </div>

          {/* Feed Section */}
          <div
            className="col-12 col-md-6 offset-md-3 p-2"
            style={{
              marginBottom: "60px", // Space for the footer
            }}
          >
            <div className="bg-primary text-white p-4 rounded">
              <h5 className="text-center">FEED</h5>
              <p>
                This is the main content area. It is centered on medium and
                larger screens and adjusts for smaller screens.
              </p>
            </div>
          </div>

          {/* Right Sidebar */}
          <div
            className="col-md-3 d-none d-md-block bg-light position-fixed"
            style={{
              top: `${navbarHeight}px`,
              bottom: "60px", // Height of the footer
              right: "0",
              overflowY: "auto",
            }}
          >
            RIGHT
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="bg-dark text-white fixed-bottom d-flex justify-content-center align-items-center"
        style={{
          background: "linear-gradient(90deg, #1e90ff, #87cefa)",
          height: "60px",
          fontSize: "0.8rem",
        }}
      >
        Footer
      </footer>
    </div>
  );
};

export default Tests;
