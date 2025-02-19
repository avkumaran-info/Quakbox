import React, { useContext, useEffect, useRef, useState } from "react";
import logo from "../../assets/logo/logo.png";
import profileImage from "../../assets/images/vector-users-icon.jpg";
import axios from "axios";
import { Tooltip } from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";
import VideocamIcon from "@mui/icons-material/Videocam";
import PodcastsIcon from "@mui/icons-material/Podcasts";
import GroupIcon from "@mui/icons-material/Group";
import NotificationsIcon from "@mui/icons-material/Notifications";
import EmailIcon from "@mui/icons-material/Email";
import InboxIcon from "@mui/icons-material/Inbox";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { StoreContext } from "../../Context/StoreContext";

const NavBar = () => {
  const { userData, favCountries } = useContext(StoreContext);
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const dropdownRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [showAllFlags, setShowAllFlags] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const [showPopup, setShowPopup] = useState(false);

  const userDatas = async () => {
    const storedCountries =
      JSON.parse(localStorage.getItem("geo_country")) || [];
    setCountries(storedCountries);
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("api_token");

    if (!token) {
      console.log("No token found, user may not be logged in.");
      confirmLogout(); // Directly log out if no token
      return;
    }

    try {
      const response = await axios.post(
        "https://develop.quakbox.com/admin/api/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      confirmLogout();
    } catch (error) {
      console.error(
        "Logout Error:",
        error.response ? error.response.data : error.message
      );

      if (error.response && error.response.status === 401) {
        console.log("Token might be expired or invalid. Logging out.");
        confirmLogout();
      }
    }
  };

  const confirmLogout = () => {
    setShowPopup(false); // Close the popup
    localStorage.clear(); // Clear local storage
    navigate("/", { replace: true }); // Redirect to login page
  };

  useEffect(() => {
    userDatas(); // Ensure userDatas is defined
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
    .filter(
      (country) =>
        country.country_name.toLowerCase() !== "earth" && // Exclude "Earth"
        country.code !== "99" && // Additional safety: exclude code 99
        country.country_name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.country_name.localeCompare(b.country_name)); // Sort A-Z

  return (
    <div>
      <nav
        className="fixed-top d-flex align-items-center justify-content-start"
        style={{
          backgroundColor: "rgb(122, 129, 135)",
          borderBottom: "3px solid",
          borderColor: "blue",
          height: "54px",
          padding: "0 1rem",
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
              style={{ position: "relative", cursor: "pointer" }}
              onClick={(e) => {
                e.preventDefault();
                navigate("/dashboard");
              }}
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
                {countries?.slice(0, 3).map((country, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/country/${country.code}`);
                      // handleCountryChange(
                      //   country.code,
                      //   country.country_image,
                      //   country.country_name
                      // );
                      setShowAllFlags(false);
                    }}
                  >
                    <img
                      src={country.country_image}
                      alt={country.country_name}
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
                      {country.country_name}
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
                      name="country"
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
                        // onClick={() => {
                        //   handleCountryChange(
                        //     country.code,
                        //     country.country_image,
                        //     country.country_name
                        //   );
                        //   setShowAllFlags(false);
                        // }}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/country/${country.code}`);
                          setShowAllFlags(false);
                        }}
                      >
                        <img
                          src={country.country_image}
                          alt={country.country_name}
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
                          {country.country_name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* World Icon */}

            {/* <i
              className="fas fa-globe d-none d-lg-block"
              style={{ color: "white", cursor: "pointer" }}
              onClick={() => {
                handleCountryChange("99");
              }}
            ></i> */}

            <Tooltip
              className="d-none d-lg-block"
              title="Global"
              arrow
              disableInteractive
            >
              <PublicIcon
                sx={{
                  fontSize: 25,
                  color: "white",
                  cursor: "pointer",

                  margin: "0px 15px",

                  "&:hover": {
                    transform: "scale(1.2)",
                    // color: "#1e90ff",
                  },
                  transition: "all 0.3s ease",
                }}
                // onClick={() => handleCountryChange("99")}
                onClick={(e) => {
                  e.preventDefault();
                  // handleCountryChange("99");
                  navigate("/world");
                }}
              />
            </Tooltip>
            {/* Video Icon */}
            {/* <i
              className="fas fa-video d-none d-lg-block"
              style={{ color: "white", cursor: "pointer" }}
              onClick={handleIconClick} // Handle the click event
            ></i> */}
            <Tooltip
              className="d-none d-lg-block"
              title="Record Video"
              arrow
              disableInteractive
            >
              <VideocamIcon
                sx={{
                  fontSize: 25,
                  color: "white",
                  cursor: "pointer",

                  margin: "0px 15px",

                  "&:hover": {
                    transform: "scale(1.2)",
                    // color: "#1e90ff",
                  },
                  transition: "all 0.3s ease",
                }}
                // onClick={handleIconClick} // Handle the click event
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/qcast");
                }}
              />
            </Tooltip>
            {/* Go Live Icon */}
            {/* <i
              onClick={(e) => {
                e.preventDefault();
                navigate("/golive");
              }}
              className="fas fa-broadcast-tower d-none d-lg-block"
              style={{ color: "white", cursor: "pointer" }}
            ></i> */}
            <Tooltip
              className="d-none d-lg-block"
              title="Go Live"
              arrow
              disableInteractive
            >
              <PodcastsIcon
                sx={{
                  fontSize: 25,
                  color: "white",
                  cursor: "pointer",

                  margin: "0px 15px",

                  "&:hover": {
                    transform: "scale(1.2)",
                    // color: "#ff1744",
                  },
                  transition: "all 0.3s ease",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/golive");
                }}
              />
            </Tooltip>
            {/* Friends Icon */}
            {/* <i
              className="fas fa-user-friends d-none d-lg-block"
              style={{ color: "white", cursor: "pointer" }}
            ></i> */}
            <Tooltip
              className="d-none d-lg-block"
              title="Friends"
              arrow
              disableInteractive
            >
              <GroupIcon
                sx={{
                  fontSize: 25,
                  color: "white",
                  cursor: "pointer",

                  margin: "0px 15px",

                  "&:hover": {
                    transform: "scale(1.2)",
                    // color: "#4caf50",
                  },
                  transition: "all 0.3s ease",
                }}
              />
            </Tooltip>
            {/* Notification Icon */}
            {/* <i
              className="fas fa-bell d-none d-lg-block"
              style={{ color: "white", cursor: "pointer" }}
            ></i> */}
            <Tooltip
              className="d-none d-lg-block"
              title="Notifications"
              arrow
              disableInteractive
            >
              <NotificationsIcon
                sx={{
                  fontSize: 25,
                  color: "white",
                  cursor: "pointer",

                  margin: "0px 15px",

                  "&:hover": {
                    transform: "scale(1.2)",
                    // color: "#ff9800",
                  },
                  transition: "all 0.3s ease",
                }}
              />
            </Tooltip>
            {/* Message Icon */}
            {/* <i
              className="fas fa-envelope d-none d-lg-block"
              style={{ color: "white", cursor: "pointer" }}
            ></i> */}
            <Tooltip
              className="d-none d-lg-block"
              title="Messages"
              arrow
              disableInteractive
            >
              <EmailIcon
                sx={{
                  fontSize: 25,
                  color: "white",
                  cursor: "pointer",

                  margin: "0px 15px",

                  "&:hover": {
                    transform: "scale(1.2)",
                    // color: "#4caf50",
                  },
                  transition: "all 0.3s ease",
                }}
              />
            </Tooltip>
            {/* Mail Icon */}
            {/* <i
              className="fas fa-inbox d-none d-lg-block"
              style={{ color: "white", cursor: "pointer" }}
            ></i> */}
            <Tooltip
              className="d-none d-lg-block"
              title="Inbox"
              arrow
              disableInteractive
            >
              <InboxIcon
                sx={{
                  fontSize: 25,
                  color: "white",
                  cursor: "pointer",

                  margin: "0px 15px",

                  "&:hover": {
                    transform: "scale(1.2)",
                    // color: "#4caf50",
                  },
                  transition: "all 0.3s ease",
                }}
              />
            </Tooltip>
            {/* Heart Icon */}
            {/* <i
              className="fas fa-heart d-none d-lg-block"
              style={{ color: "white", cursor: "pointer" }}
              onClick={(e) => {
                e.preventDefault();
                navigate("/favouriteCountires");
              }}
            ></i> */}
            <Tooltip
              className="d-none d-lg-block"
              title="Favourite Countries"
              arrow
              disableInteractive
            >
              <FavoriteIcon
                sx={{
                  fontSize: 25,
                  color: "white",
                  cursor: "pointer",

                  margin: "0px 15px",

                  "&:hover": {
                    transform: "scale(1.2)",
                    // color: "#ff4081",
                  },
                  transition: "all 0.3s ease",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/favouriteCountires"); // Navigate to Favourite Countries page
                }}
              />
            </Tooltip>

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
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {/* Favourite countries section */}
            {/* Display Favorite Countries: Only Name and Image */}
            <div
              className="d-none d-lg-flex"
              style={{
                gap: "10px", // Reduced gap between flags
                alignItems: "center",
                position: "relative",
              }}
            >
              <div style={{ display: "flex", gap: "7px" }}>
                {favCountries.length > 0
                  ? favCountries.map((fav, index) => {
                      // Find the matched country in allCountries based on the name
                      const matchedCountry = countries.find(
                        (c) => c.country_name === fav.code
                      );
                      // console.log(matchedCountry);

                      // Only render the country if it's matched (found)
                      return (
                        matchedCountry && (
                          <div
                            key={index}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              cursor: "pointer",
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              // navigate(`/country/${fav.country_code}`);
                              console.log(fav);
                            }}
                          >
                            <img
                              src={matchedCountry.country_image}
                              alt={matchedCountry.country_name}
                              className="card-img-top img-fluid"
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
                              {matchedCountry.country_name}
                            </span>
                          </div>
                        )
                      );
                    })
                  : ""}
              </div>
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
                    src={userData.profile_image_url}
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
                      onClick={(e) => {
                        e.preventDefault();
                        navigate("/dashboard");
                        setShowDropdown((prev) => !prev);
                      }}
                    >
                      {userData.users.username}
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
                      onClick={() => setShowPopup(true)} // Show the popup
                    >
                      Logout
                    </a>
                  </div>
                )}
              </div>
            </div>
            {showPopup && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: "rgba(0, 0, 0, 0.6)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 1100,
                }}
              >
                <div
                  style={{
                    background: "#fff",
                    padding: "25px",
                    borderRadius: "8px",
                    textAlign: "center",
                    boxShadow: "0 6px 15px rgba(0, 0, 0, 0.3)",
                    width: "320px",
                  }}
                >
                  {/* Popup Title */}
                  <h3 style={{ color: "#333", marginBottom: "10px" }}>
                    Confirmation
                  </h3>

                  {/* Message */}
                  <p
                    style={{
                      color: "#555",
                      fontSize: "14px",
                      marginBottom: "20px",
                    }}
                  >
                    Are you sure you want to log out?
                  </p>

                  {/* Buttons Container */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "15px",
                    }}
                  >
                    {/* Cancel Button */}
                    <button
                      style={{
                        padding: "10px 18px",
                        cursor: "pointer",
                        border: "none",
                        backgroundColor: "#ddd",
                        color: "#333",
                        borderRadius: "5px",
                        fontSize: "14px",
                        transition: "background 0.3s",
                      }}
                      onClick={() => setShowPopup(false)}
                      onMouseOver={(e) =>
                        (e.target.style.backgroundColor = "#ccc")
                      }
                      onMouseOut={(e) =>
                        (e.target.style.backgroundColor = "#ddd")
                      }
                    >
                      Cancel
                    </button>

                    {/* Logout Button */}
                    <button
                      style={{
                        padding: "10px 18px",
                        cursor: "pointer",
                        border: "none",
                        backgroundColor: "#007bff",
                        color: "#fff",
                        borderRadius: "5px",
                        fontSize: "14px",
                        transition: "background 0.3s",
                      }}
                      onClick={() => {
                        setShowPopup(false);
                        handleLogout();
                      }}
                      onMouseOver={(e) =>
                        (e.target.style.backgroundColor = "#0056b3")
                      }
                      onMouseOut={(e) =>
                        (e.target.style.backgroundColor = "#007bff")
                      }
                    >
                      Okay
                    </button>
                  </div>
                </div>
              </div>
            )}
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
            className="d-lg-none bg-light d-flex align-items-center justify-content-evenly fixed-top"
            style={{
              borderTop: "1px solid #ddd",
              marginTop: "54px",
              padding: "10px 0",
            }}
          >
            {/* Home */}
            <div className="text-dark text-center">
              <i
                className="fa-solid fa-house"
                style={{ fontSize: "0.8rem" }}
              ></i>
              <p style={{ fontSize: "0.5rem", margin: 0 }}>Home</p>
            </div>

            {/* World */}
            <div className="text-dark text-center">
              <i
                className="fa-solid fa-globe"
                style={{ fontSize: "0.8rem" }}
              ></i>
              <p style={{ fontSize: "0.5rem", margin: 0 }}>World</p>
            </div>

            {/* Friends */}
            <div className="text-dark text-center">
              <i
                className="fa-solid fa-user-friends"
                style={{ fontSize: "0.8rem" }}
              ></i>
              <p style={{ fontSize: "0.5rem", margin: 0 }}>Friends</p>
            </div>

            {/* Alerts */}
            <div className="text-dark text-center">
              <i
                className="fa-solid fa-bell"
                style={{ fontSize: "0.8rem" }}
              ></i>
              <p style={{ fontSize: "0.5rem", margin: 0 }}>Alerts</p>
            </div>

            {/* Profile */}
            <div className="text-dark text-center position-relative">
              <div
                style={{
                  borderRadius: "50%",
                  width: "35px",
                  height: "35px",
                  overflow: "hidden",
                  border: "2px solid #ffffff",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setDropdown((prev) => !prev);
                }}
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
              {dropdown && (
                <div
                  className="dropdown-menu"
                  style={{
                    position: "absolute",
                    top: "45px",
                    right: "0",
                    backgroundColor: "#ffffff",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    borderRadius: "5px",
                    zIndex: 1000,
                    width: "150px",
                  }}
                >
                  <a
                    href="#"
                    className="dropdown-item"
                    style={{
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
                      color: "#333",
                      fontSize: "0.8rem",
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
      </nav>
    </div>
  );
};

export default NavBar;
