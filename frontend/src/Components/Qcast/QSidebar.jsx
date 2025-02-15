import React from "react";
import { NavLink } from "react-router-dom";

const QSidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div
      style={{
        width: isOpen ? "250px" : "60px",
        height: "100vh",
        background: "linear-gradient(to bottom, #6a11cb, #2575fc)",
        position: "fixed",
        right: "0",
        top: "0",
        marginTop: "56px",
        transition: "width 0.3s ease-in-out",
        overflowX: "hidden",
        color: "white",
        paddingTop: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Toggle Button (☰ / ✖) - Fixed Position */}
      <button
        onClick={toggleSidebar}
        style={{
          position: "absolute",
          top: "10px",
          right: "15px",
          background: "transparent",
          border: "white",
          fill: "white",
          color: "white",
          fontSize: "22px",
          cursor: "pointer",
          transition: "all 0.3s ease-in-out",
        }}
      >
        {isOpen ? "✖" : "☰"}
      </button>

      {/* Sidebar Menu */}
      <ul
        className="list-unstyled w-100"
        style={{
          paddingLeft: "0",
          textAlign: "center",
          transition: "all 0.3s ease-in-out",
          marginTop: "50px",
          width: "100%",
        }}
      >
        {[
          { to: "#", icon: "fa-solid fa-user", label: "My Stations" },
          { to: "/myvideo", icon: "fa-solid fa-video", label: "My Video" },
          {
            to: "#",
            icon: "fa-solid fa-camera",
            label: "My Live Video",
          },
        ].map((item, index) => (
          <li
            key={index}
            style={{
              padding: "10px", // Reduced padding for a compact look
              marginBottom: isOpen ? "6px" : "12px", // ✅ Reduced gap when open
              display: "flex",
              alignItems: "center",
              justifyContent: isOpen ? "flex-start" : "center",
              transition: "all 0.3s ease-in-out",
              width: "100%",
              whiteSpace: "nowrap",
            }}
          >
            {/* FontAwesome Icon */}
            <i
              className={`${item.icon} fa-lg`}
              style={{
                width: "30px",
                textAlign: "center",
                marginRight: isOpen ? "8px" : "0", // Adjusted spacing
              }}
            ></i>

            {/* Sidebar Label */}
            {isOpen && (
              <span
                style={{
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? "translateX(0)" : "translateX(-15px)",
                  transition:
                    "opacity 0.3s ease-in-out, transform 0.3s ease-in-out",
                }}
              >
                <NavLink
                  to={item.to}
                  className="text-white text-decoration-none"
                >
                  {item.label}
                </NavLink>
              </span>
            )}
          </li>
        ))}
        <hr />
        <li
          style={{
            padding: "10px", // Reduced padding for a compact look
            marginBottom: isOpen ? "6px" : "12px", // ✅ Reduced gap when open
            display: "flex",
            alignItems: "center",
            justifyContent: isOpen ? "flex-start" : "center",
            transition: "all 0.3s ease-in-out",
            width: "100%",
            whiteSpace: "nowrap",
          }}
        >
          {/* FontAwesome Icon */}
          <i
            className={`fa-solid fa-user fa-lg`}
            style={{
              width: "30px",
              textAlign: "center",
              marginRight: isOpen ? "8px" : "0", // Adjusted spacing
            }}
          ></i>

          {/* Sidebar Label */}
          {isOpen && (
            <span
              style={{
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? "translateX(0)" : "translateX(-15px)",
                transition:
                  "opacity 0.3s ease-in-out, transform 0.3s ease-in-out",
              }}
            >
              <NavLink
                to="/my_subscriptions"
                className="text-white text-decoration-none"
              >
                My Subscription
              </NavLink>
            </span>
          )}
        </li>
        <li
          style={{
            padding: "10px", // Reduced padding for a compact look
            marginBottom: isOpen ? "6px" : "12px", // ✅ Reduced gap when open
            display: "flex",
            alignItems: "center",
            justifyContent: isOpen ? "flex-start" : "center",
            transition: "all 0.3s ease-in-out",
            width: "100%",
            whiteSpace: "nowrap",
          }}
        >
          {/* FontAwesome Icon */}
          <i
            className="fa-regular fa-square-plus fa-lg"
            style={{
              width: "30px",
              textAlign: "center",
              marginRight: isOpen ? "8px" : "0", // Adjusted spacing
            }}
          ></i>

          {/* Sidebar Label */}
          {isOpen && (
            <span
              style={{
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? "translateX(0)" : "translateX(-15px)",
                transition:
                  "opacity 0.3s ease-in-out, transform 0.3s ease-in-out",
              }}
            >
              <NavLink
                to="/browse_channel"
                className="text-white text-decoration-none"
                style={{ display: "inline-block" }}
              >
                Browse Stations
              </NavLink>
            </span>
          )}
        </li>
      </ul>
    </div>
  );
};

export default QSidebar;
