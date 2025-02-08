import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUpload } from "react-icons/fa";

const QNavBar = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  // Handle upload button click to navigate to /upload
  const handleUpload = () => {
    navigate("/upload");
  };

  return (
    <nav
      className="navbar navbar-light bg-light shadow"
      style={{
        display: "flex",
        alignItems: "center", // Align items vertically in the center
        padding: "10px",
        justifyContent: "center", // Ensures the navbar content is centered
      }}
    >
      {/* Search Box */}
      <input
        type="text"
        className="form-control"
        placeholder="Search..."
        style={{
          width: "50%",
          maxWidth: "500px", // Optional: Limits width on larger screens
          marginRight: "10px", // Adds space between search box and button
          height: "38px", // Same height as the button
        }}
      />

      {/* Button next to the search box */}
      <button
        className="btn btn-outline-primary d-flex align-items-center justify-content-center"
        style={{
          padding: "8px 20px", // Adjust button size
          height: "38px", // Same height as the search box
          display: "flex",
          gap: "8px", // Space between icon and text
        }}
        onClick={handleUpload}
      >
        <FaUpload className="me-1" /> {/* Icon with spacing */}
        Upload Video
      </button>
    </nav>
  );
};

export default QNavBar;
