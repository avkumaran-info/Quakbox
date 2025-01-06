import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from "../../assets/images/quak_logo.png";
import userImage from "../../assets/images/vector-users-icon.jpg";
const NavBar = () => {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await axios.get("https://restcountries.com/v3.1/all");
        setCountries(res.data);
        console.log(res.data);

        console.log(countries);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  return (
    <>
      {/* Navbar */}
      <nav
        className="navbar navbar-expand-lg navbar-light fixed-top"
        style={{
          background: "linear-gradient(90deg, #1e90ff, #87cefa)",
          padding: "0.6rem 1rem",
        }}
      >
        <div className="container-fluid">
          {/* Company Logo and Name for larger screens */}
          <div
            className="navbar-brand d-flex align-items-center"
            style={{ cursor: "pointer" }}
          >
            <img
              src={logo}
              alt="QuakBox Logo"
              style={{ width: "40px", borderRadius: "50%" }}
            />
            <span
              className="d-none d-lg-block"
              style={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                marginLeft: "10px",
                color: "#ffffff",
              }}
            >
              QuakBox
            </span>

            {/* Add 3 images to the right of the company name (visible only on large screens) */}
            <div
              className="d-none d-lg-flex"
              style={{
                display: "flex",
                marginLeft: "15px",
                position: "relative",
                alignItems: "center",
                gap: "20px", // Add spacing
              }}
              onMouseEnter={(e) => {
                const allFlags = e.currentTarget.querySelector(".all-flags");
                if (allFlags) {
                  allFlags.style.display = "grid";
                }
              }}
              onMouseLeave={(e) => {
                const allFlags = e.currentTarget.querySelector(".all-flags");
                if (allFlags) {
                  allFlags.style.display = "none";
                }
              }}
            >
              {/* Display only the first 3 flags */}
              <div style={{ display: "flex", gap: "10px" }}>
                {countries.slice(0, 3).map((country, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      cursor: "pointer", // Make it clear that it's clickable
                    }}
                    onClick={() => {
                      // Update the URL to include the country code
                      const countryCode = country.cca2.toLowerCase();
                      window.location.href = `/d/${countryCode}`;
                    }}
                  >
                    <img
                      src={country.flags.png}
                      alt={country.name.common}
                      style={{
                        width: "35px",
                        height: "35px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "2px solid #ffffff",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "#ffffff",
                        marginTop: "5px",
                        textAlign: "center",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {country.name.common}
                    </span>
                  </div>
                ))}
              </div>

              {/* Full list of flags with country names in a grid layout */}
              <div
                className="all-flags"
                style={{
                  display: "none",
                  position: "absolute",
                  top: "50px",
                  left: "0",
                  backgroundColor: "#ffffff",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  padding: "10px",
                  maxHeight: "300px",
                  overflowY: "auto",
                  zIndex: 1000,
                  width: "400px",
                  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                  gap: "10px",
                }}
              >
                {countries.map((country, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      cursor: "pointer", // Make it clear that it's clickable
                    }}
                    onClick={() => {
                      // Update the URL to include the country code
                      const countryCode = country.cca2.toLowerCase();
                      window.location.href = `/${countryCode}`;
                    }}
                  >
                    <img
                      src={country.flags.png}
                      alt={country.name.common}
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "1px solid #ddd",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: "#333",
                        textAlign: "left",
                      }}
                    >
                      {country.name.common}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Company Name for smaller screens */}
          <div
            className="navbar-brand d-flex align-items-center d-block d-lg-none"
            style={{
              cursor: "pointer",
              color: "#ffffff",
              fontWeight: "bold",
            }}
          >
            QuakBox
          </div>

          {/* Mobile Icons (Top Right) */}
          <div className="d-lg-none d-flex align-items-center ms-auto">
            <div
              style={{
                color: "#ffffff",
                fontSize: "1.4rem",
                marginRight: "10px",
                cursor: "pointer",
              }}
            >
              <i className="fa-solid fa-search"></i>
            </div>

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#mobileMenu"
              aria-controls="mobileMenu"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>

          {/* Desktop Full Menu */}
          <div
            className="collapse navbar-collapse d-none d-lg-flex"
            id="navbarNav"
          >
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <a
                  href="#"
                  className="nav-link"
                  style={{ color: "#ffffff", fontSize: "1rem" }}
                >
                  <i className="fa-solid fa-house"></i> Home
                </a>
              </li>
              <li className="nav-item">
                <a
                  href="#"
                  className="nav-link"
                  style={{ color: "#ffffff", fontSize: "1rem" }}
                >
                  <i className="fa-solid fa-globe"></i> Explore
                </a>
              </li>
              <li className="nav-item">
                <a
                  href="#"
                  className="nav-link"
                  style={{ color: "#ffffff", fontSize: "1rem" }}
                >
                  <i className="fa-solid fa-user-friends"></i> Friends
                </a>
              </li>
              <li className="nav-item">
                <a
                  href="#"
                  className="nav-link"
                  style={{ color: "#ffffff", fontSize: "1rem" }}
                >
                  <i className="fa-solid fa-bell"></i> Notifications
                </a>
              </li>
            </ul>

            {/* Right Section (Profile and Search Bar) */}
            <div
              className="d-flex align-items-center"
              style={{ marginLeft: "auto" }}
            >
              {/* Search Input (Visible Only on Larger Screens) */}
              <div
                className="d-none d-lg-block"
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginRight: "15px",
                }}
              >
                <input
                  type="text"
                  placeholder="Search"
                  style={{
                    padding: "5px",
                    borderRadius: "15px",
                    border: "1px solid #ffffff",
                    outline: "none",
                    fontSize: "0.9rem",
                    width: "200px",
                  }}
                />
              </div>

              {/* Profile Image */}
              <div
                style={{
                  borderRadius: "50%",
                  width: "35px",
                  height: "35px",
                  overflow: "hidden",
                  marginLeft: "10px",
                  border: "2px solid #ffffff",
                }}
              >
                <img
                  src={userImage}
                  alt="User"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Icon Row (Just Below the Logo) */}
      <div
        className="d-lg-none bg-light d-flex justify-content-around py-2"
        style={{
          borderTop: "1px solid #ddd",
          padding: "10px",
        }}
      >
        <a href="#" className="text-dark text-center">
          <i className="fa-solid fa-house" style={{ fontSize: "1.5rem" }}></i>
          <p style={{ fontSize: "0.75rem", margin: 0 }}>Home</p>
        </a>
        <a href="#" className="text-dark text-center">
          <i className="fa-solid fa-globe" style={{ fontSize: "1.5rem" }}></i>
          <p style={{ fontSize: "0.75rem", margin: 0 }}>World</p>
        </a>
        <a href="#" className="text-dark text-center">
          <i
            className="fa-solid fa-user-friends"
            style={{ fontSize: "1.5rem" }}
          ></i>
          <p style={{ fontSize: "0.75rem", margin: 0 }}>Friends</p>
        </a>
        <a href="#" className="text-dark text-center">
          <i className="fa-solid fa-bell" style={{ fontSize: "1.5rem" }}></i>
          <p style={{ fontSize: "0.75rem", margin: 0 }}>Alerts</p>
        </a>
        <a href="#" className="text-dark text-center">
          <div
            style={{
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              overflow: "hidden",
              margin: "0 auto",
            }}
          >
            <img
              src={userImage}
              alt="User"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <p style={{ fontSize: "0.75rem", margin: 0 }}>Profile</p>
        </a>
      </div>
    </>
  );
};

export default NavBar;
