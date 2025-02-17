import { useState, useEffect } from "react";

const SessionExpiredPopup = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Listen for session expired event
    const handleSessionExpired = () => setShowPopup(true);
    window.addEventListener("sessionExpired", handleSessionExpired);

    return () => {
      window.removeEventListener("sessionExpired", handleSessionExpired);
    };
  }, []);

  if (!showPopup) return null; // Don't render if popup is not needed

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1100,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "8px",
          textAlign: "center",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <p style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px" }}>
          Session Expired
        </p>
        <p>Your session has expired. Please log in again.</p>
        <button
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            cursor: "pointer",
            border: "none",
            backgroundColor: "#007bff",
            color: "#fff",
            borderRadius: "5px",
            fontSize: "16px",
          }}
          onClick={() => {
            setShowPopup(false);
            window.location.href = "/login"; // Redirect to login page
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default SessionExpiredPopup;
