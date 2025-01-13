import React, { useEffect, useRef, useState } from "react";
import logo from "../../assets/logo/logo.png";
import profileImage from "../../assets/images/vector-users-icon.jpg";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const dropdownRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [showAllFlags, setShowAllFlags] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search input

  const handleLogout = async () => {
    const token = localStorage.getItem("api_token");

    if (!token) {
      console.log("No token found, user may not be logged in.");
      return;
    }

    try {
      // Make the API call with the token in the header
      const response = await axios.post(
        "https://develop.quakbox.com/admin/api/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in Authorization header
          },
        }
      );
      console.log(response);

      // Clear local storage and redirect
      localStorage.clear();
      navigate("/", { replace: true }); // Redirect to login page
    } catch (error) {
      // Handle error from the API
      if (error.response) {
        console.error("Error Response:", error.response.data);
      } else {
        console.error("Logout Error:", error.message);
      }
    }
  };

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await axios.get("https://restcountries.com/v3.1/all");
        setCountries(res.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Filter and sort countries
  const filteredCountries = countries
    .filter((country) =>
      country.name.common.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.name.common.localeCompare(b.name.common)); // Sort A-Z

  return (
    <div>
      <nav
        className="fixed-top d-flex align-items-center justify-content-start"
        style={{
          backgroundColor: "rgb(122, 129, 135)",
          borderBottom: "3px solid",
          // borderImage: "linear-gradient(to right, #1e90ff, #87cefa) 1",
          borderColor: "blue",
          height: "54px",
        }}
      >
        <div className="container-fluid ">
          <div
            className="navbar-brand d-flex align-items-center"
            style={{
              width: "100%", // Ensures navbar uses full width
              justifyContent: "space-evenly", // Distribute elements evenly
              flexWrap: "nowrap", // Prevent wrapping
            }}
          >
            {/* Logo */}
            <div
              className="d-flex align-items-center g-1"
              style={{ position: "relative" }}
            >
              <img
                className="d-none d-lg-block"
                src={logo}
                alt="QuakBox Logo"
                style={{
                  filter: "brightness(1)",
                  width: "40px",
                  height: "40px",
                  marginRight: "10px", // Add space between logo and name
                }}
              />
              {/* Company Name */}
              <span
                className="d-none d-lg-block"
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  color: "#ffffff",
                }}
              >
                QuakBox
              </span>
            </div>

            {/* Flags section */}
            <div
              className="d-none d-lg-flex"
              style={{
                gap: "10px", // Reduced gap between flags
                alignItems: "center",
                position: "relative",
              }}
              onMouseEnter={() => setShowAllFlags(true)}
              onMouseLeave={() => setShowAllFlags(false)}
            >
              {/* Display only the first 3 flags */}
              <div style={{ display: "flex", gap: "3px" }}>
                {countries.slice(0, 3).map((country, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      const countryCode = country.cca2.toLowerCase();
                      window.location.href = `/d/${countryCode}`;
                    }}
                  >
                    <img
                      src={country.flags.png}
                      alt={country.name.common}
                      style={{
                        width: "40px",
                        height: "20px",
                        objectFit: "cover",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "0.6rem",
                        color: "#ffffff",
                        // marginTop: "5px",
                        textAlign: "center",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "50px",
                      }}
                    >
                      {country.name.common}
                    </span>
                  </div>
                ))}
              </div>

              {/* Full list of flags with search input */}
              {showAllFlags && (
                <div
                  className="all-flags"
                  style={{
                    position: "absolute",
                    top: "35px",
                    left: "-220px",
                    backgroundColor: "#ffffff",
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                    padding: "10px",
                    maxHeight: "500px",
                    overflowY: "auto",
                    zIndex: 1000,
                    width: "1000px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {/* Search input */}
                  <div style={{ textAlign: "center" }}>
                    <h5 className="d-flex align-items-center justify-content-start p-2 ">
                      All Countries
                    </h5>
                    <input
                      type="text"
                      placeholder="Search countries..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        width: "95%",
                        padding: "10px",
                        fontSize: "1rem",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        marginBottom: "10px",
                      }}
                    />
                  </div>

                  {/* Filtered and sorted countries */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(70px, 1fr))",
                      gap: "1px",
                    }}
                  >
                    {filteredCountries.map((country, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          const countryCode = country.cca2.toLowerCase();
                          window.location.href = `/${countryCode}`;
                        }}
                      >
                        <img
                          src={country.flags.png}
                          alt={country.name.common}
                          style={{
                            width: "65px",
                            height: "40px",
                            objectFit: "cover",
                            border: "1px solid black",
                            borderRadius: "3px",
                          }}
                        />
                        <span
                          style={{
                            fontSize: "0.75rem",
                            color: "#333",
                            marginTop: "5px",
                            textAlign: "center",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "70px",
                          }}
                        >
                          {country.name.common}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* World Icon */}

            <i
              className="fas fa-globe d-none d-lg-block"
              style={{ color: "white" }}
            ></i>

            {/* Video Icon */}
            <i
              className="fas fa-video d-none d-lg-block"
              style={{ color: "white" }}
            ></i>

            {/* Go Live Icon */}
            <i
              className="fas fa-broadcast-tower d-none d-lg-block"
              style={{ color: "white" }}
            ></i>

            {/* Friends Icon */}
            <i
              className="fas fa-user-friends d-none d-lg-block"
              style={{ color: "white" }}
            ></i>

            {/* Notification Icon */}
            <i
              className="fas fa-bell d-none d-lg-block"
              style={{ color: "white" }}
            ></i>

            {/* Message Icon */}
            <i
              className="fas fa-envelope d-none d-lg-block"
              style={{ color: "white" }}
            ></i>

            {/* Mail Icon */}
            <i
              className="fas fa-inbox d-none d-lg-block"
              style={{ color: "white" }}
            ></i>

            {/* Heart Icon */}
            <i
              className="fas fa-heart d-none d-lg-block"
              style={{ color: "white" }}
            ></i>
            {/* Search Input */}
            <div className="d-none d-lg-block " style={{ width: "250px" }}>
              {/* Smaller width for input */}
              <input
                type="text"
                placeholder="Search..."
                style={{
                  width: "100%",
                  padding: "2px 15px",
                  fontSize: "1rem",
                  border: "1px solid #ccc",
                  borderRadius: "20px",
                }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Profile Section */}
            <div
              ref={dropdownRef}
              style={{
                position: "relative",
              }}
            >
              {/* Profile Image */}

              <div
                className=" d-none d-lg-block"
                style={{ position: "relative" }}
                ref={dropdownRef}
              >
                <div
                  style={{
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    overflow: "hidden",
                    cursor: "pointer",
                    border: "2px solid #ffffff",
                  }}
                  onClick={() => setShowDropdown((prev) => !prev)}
                >
                  <img
                    src={profileImage}
                    alt="User"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                {/* Dropdown Menu */}
                {showDropdown && (
                  <div
                    style={{
                      position: "absolute",
                      top: "50px",
                      right: "0",
                      backgroundColor: "#ffffff",
                      border: "1px solid #ddd",
                      borderRadius: "5px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                      zIndex: 1000,
                      width: "200px",
                    }}
                  >
                    <a
                      href="#"
                      style={{
                        display: "block",
                        padding: "10px 15px",
                        textDecoration: "none",
                        color: "#333",
                        fontSize: "0.9rem",
                      }}
                      onClick={() =>
                        console.log("Change Profile Picture clicked")
                      }
                    >
                      Change Profile Picture
                    </a>
                    <a
                      href="#"
                      style={{
                        display: "block",
                        padding: "10px 15px",
                        textDecoration: "none",
                        color: "#333",
                        fontSize: "0.9rem",
                      }}
                      onClick={() => console.log("Change Password clicked")}
                    >
                      Change Password
                    </a>
                    <div
                      style={{
                        borderTop: "1px solid #ddd",
                        margin: "5px 0",
                      }}
                    ></div>
                    <a
                      href="#"
                      style={{
                        display: "block",
                        padding: "10px 15px",
                        textDecoration: "none",
                        color: "#333",
                        fontSize: "0.9rem",
                      }}
                      onClick={handleLogout}
                    >
                      Logout
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Mobile Icon Row (Just Below the Logo) */}
          <div className="d-flex align-items-center">
            <img
              className="navbar-brand d-flex align-items-center d-block d-lg-none"
              src={logo}
              alt="QuakBox Logo"
              style={{
                width: "25px",
              }}
            />
            <div
              className="navbar-brand d-flex align-items-center d-block d-lg-none"
              style={{
                fontSize: "1rem",
                cursor: "pointer",
                color: "#ffffff",
                fontWeight: "bold",
                marginLeft: "10px", // Add space between logo and company name
              }}
            >
              QuakBox
            </div>
            {/* Mobile Icons (Top Right) */}
            <div className="d-lg-none d-flex align-items-center ms-auto">
              <div
                style={{
                  color: "#ffffff",
                  fontSize: "1.0rem",
                  marginRight: "10px",
                  cursor: "pointer",
                }}
              >
                <i className="fa-solid fa-search"></i>
              </div>

              <a
                href="#"
                className="nav-link"
                style={{ color: "#ffffff", fontSize: "1.0rem" }}
              >
                <i className="fa-regular fa-comments"></i>
              </a>
            </div>
          </div>

          <div
            className="d-lg-none bg-light d-flex justify-content-around fixed-top"
            style={{
              borderTop: "1px solid #ddd",
              marginTop: "45px",
            }}
          >
            <a href="/dashboard" className="text-dark text-center">
              <i
                className="fa-solid fa-house"
                style={{ fontSize: "0.8rem" }}
              ></i>
              <p style={{ fontSize: "0.5rem", margin: 0 }}>Home</p>
            </a>
            <a href="#" className="text-dark text-center">
              <i
                className="fa-solid fa-globe"
                style={{ fontSize: "0.8rem" }}
              ></i>
              <p style={{ fontSize: "0.5rem", margin: 0 }}>World</p>
            </a>
            <a href="#" className="text-dark text-center">
              <i
                className="fa-solid fa-user-friends"
                style={{ fontSize: "0.8rem" }}
              ></i>
              <p style={{ fontSize: "0.5rem", margin: 0 }}>Friends</p>
            </a>
            <a href="#" className="text-dark text-center">
              <i
                className="fa-solid fa-bell"
                style={{ fontSize: "0.8rem" }}
              ></i>
              <p style={{ fontSize: "0.5rem", margin: 0 }}>Alerts</p>
            </a>

            <a href="#" className="text-dark text-center">
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
                onClick={() => {
                  setDropdown((prev) => !prev);
                }}
              >
                <img
                  src={profileImage}
                  alt="User"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              {dropdown && (
                <div
                  className="dropdown-menu "
                  style={{
                    position: "absolute",
                    top: "40px",
                    right: "0",
                    backgroundColor: "#ffffff",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    borderRadius: "5px",
                    zIndex: 1000,
                    width: "150px",
                    display: "block",
                  }}
                >
                  <a
                    href="#"
                    className="dropdown-item"
                    style={{
                      //   padding: "10px 15px",
                      color: "#333",
                      fontSize: "0.8rem",
                    }}
                    onClick={() =>
                      console.log("Change Profile Picture clicked")
                    }
                  >
                    Change Profile Picture
                  </a>
                  <a
                    href="#"
                    className="dropdown-item"
                    style={{
                      //   padding: "10px 15px",
                      color: "#333",
                      fontSize: "0.8rem",
                    }}
                    onClick={() => console.log("Change Password clicked")}
                  >
                    Change Password
                  </a>
                  <div className="dropdown-divider"></div>
                  <a
                    href="#"
                    className="dropdown-item"
                    style={{
                      //   padding: "10px 15px",
                      color: "#333",
                      fontSize: "0.8rem",
                    }}
                    onClick={handleLogout}
                  >
                    Logout
                  </a>
                </div>
              )}
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
