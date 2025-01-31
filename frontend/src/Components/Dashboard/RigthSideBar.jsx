import React from "react";
import { FaThumbsUp, FaThumbsDown, FaComment, FaShare } from "react-icons/fa"; // Import FontAwesome icons
import India from "../../assets/images/Rigth side property/Flag_of_India.svg.webp"; // Your flag image
import banner from "../../assets/images/Rigth side property/banner.jpeg"; // Banner image
import user1 from "../../assets/images/Rigth side property/user.jpg"; // User image 1
import user2 from "../../assets/images/Rigth side property/user2.jpeg"; // User image 2
import user3 from "../../assets/images/Rigth side property/user3.jpg"; // User image 3
import user from "../../assets/images/Rigth side property/user.png"; // Profile avatar image
import feed from "../../assets/images/Rigth side property/1.png"; // Feed icon
import news from "../../assets/images/Rigth side property/Lnews.png"; // News icon
import event from "../../assets/images/Rigth side property/7.png"; // Event icon
import group from "../../assets/images/Rigth side property/group.png"; // Group icon
import notification from "../../assets/images/Rigth side property/not.png"; // Notification icon
import set from "../../assets/images/Rigth side property/set.webp"; // Settings icon
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import CommentIcon from "@mui/icons-material/Comment";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonIcon from "@mui/icons-material/Person";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteSharpIcon from "@mui/icons-material/FavoriteSharp";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import SportsBaseballIcon from "@mui/icons-material/SportsBaseball";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import SportsFootballIcon from "@mui/icons-material/SportsFootball";
import StarIcon from "@mui/icons-material/Star";
import GroupIcon from "@mui/icons-material/Group";
import SendIcon from "@mui/icons-material/Send";
import ShareIcon from "@mui/icons-material/Share";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import { Tooltip } from "@mui/material";

const RightSidebar = ({
  countryCode,
  flag,
  countryName,
  handleCountryChange,
}) => {
  const updates = [
    {
      id: 1,
      name: "John",
      message: "posted an update",
      avatar: user, // Replace with actual image URL
      time: "a year ago",
    },
    {
      id: 2,
      name: "Adele",
      message: "posted an update",
      avatar: user1, // Replace with actual image URL
      time: "a year ago",
    },
    {
      id: 3,
      name: "John",
      message: "posted an update",
      avatar: user2, // Replace with actual image URL
      time: "2 years ago",
    },
    {
      id: 4,
      name: "John",
      message: "posted an update in the group ☕ Coffee Addicts",
      avatar: user3, // Replace with actual image URL
      time: "2 years ago",
    },
    {
      id: 5,
      name: "John",
      message: "posted an update",
      avatar: user, // Replace with actual image URL
      time: "2 years ago",
    },
  ];

  const isWorld = location.pathname === "/world"; // Determines if we're in the "world" section

  return (
    <div
      className="col-md-3 d-none d-md-block bg-light position-fixed"
      style={{
        height: "100vh",
        top: "56px", // Height of the topbar
        right: "0",
        paddingBottom: "54px", // Ensures space for footer
      }}
    >
      <div className="card" style={{ height: "100%" }}>
        <div className="container p-0">
          {/* Part 1: Fixed Flag Section */}
          <div
            className="bg-light text-center border-bottom sticky-top"
            style={{
              top: "0",
              zIndex: "10",
              backgroundColor: "#fff",
              padding: "10px",
              position: "sticky",
            }}
          >
            <img
              src={flag}
              alt={countryName}
              className="img-fluid"
              style={{
                width: "100%", // Makes the image fit the div width
                height: "200px", // Fixed height for uniformity
                objectFit: "cover", // Ensures image covers the space without distortion
              }}
            />
            <h5 className="mt-2 mb-2 text-secondary">{countryName}</h5>
            {/* Like, Dislike, Comment, Share Icons */}
            <div className="d-flex justify-content-around">
              {/* <img
                src={like}
                alt="Like"
                style={{
                  width: "25px",
                  height: "25px",
                  cursor: "pointer",
                  marginRight: "10px",
                }}
              /> */}
              <Tooltip title="Like" arrow disableInteractive>
                <ThumbUpIcon
                  sx={{
                    fontSize: 30,
                    color: "#263238",
                    "&:hover": {
                      //color: "red",
                      transform: "scale(1.2)",
                    },
                    transition: "all 0.3s ease",
                    fontWeight: "bold",
                    opacity: 0.8,
                    cursor: "pointer",
                  }}
                  onClick={() => console.log("Icon clicked")}
                />
              </Tooltip>
              <Tooltip title="Dislike" arrow disableInteractive>
                <ThumbDownIcon
                  sx={{
                    fontSize: 30,
                    color: "#263238",
                    "&:hover": {
                      //color: "red",
                      transform: "scale(1.2)",
                    },
                    transition: "all 0.3s ease",
                    fontWeight: "bold",
                    opacity: 0.8,
                    cursor: "pointer",
                  }}
                  onClick={() => console.log("Icon clicked")}
                />
              </Tooltip>

              <Tooltip title="Comment" arrow disableInteractive>
                <CommentIcon
                  sx={{
                    fontSize: 30,
                    color: "#263238",
                    "&:hover": {
                      //color: "red",
                      transform: "scale(1.2)",
                    },
                    transition: "all 0.3s ease",
                    fontWeight: "bold",
                    opacity: 0.8,
                    cursor: "pointer",
                  }}
                  onClick={() => console.log("Icon clicked")}
                />
              </Tooltip>
              <Tooltip title="Follow" arrow disableInteractive>
                <FavoriteSharpIcon
                  sx={{
                    fontSize: 30,
                    color: "#263238",
                    "&:hover": {
                      //color: "red",
                      transform: "scale(1.2)",
                    },
                    transition: "all 0.3s ease",
                    fontWeight: "bold",
                    opacity: 0.8,
                    cursor: "pointer",
                  }}
                  onClick={() => console.log("Icon clicked")}
                />
              </Tooltip>
              <Tooltip title="Fans" arrow disableInteractive>
                <GroupIcon
                  sx={{
                    fontSize: 30,
                    color: "#263238",
                    "&:hover": {
                      //color: "red",
                      transform: "scale(1.2)",
                    },
                    transition: "all 0.3s ease",
                    fontWeight: "bold",
                    opacity: 0.8,
                    cursor: "pointer",
                  }}
                  onClick={() => console.log("Icon clicked")}
                />
              </Tooltip>
              <Tooltip title="Share" arrow disableInteractive>
                <ScreenShareIcon
                  sx={{
                    fontSize: 30,
                    color: "#263238",
                    "&:hover": {
                      //color: "red",
                      transform: "scale(1.2)",
                    },
                    transition: "all 0.3s ease",
                    fontWeight: "bold",
                    opacity: 0.8,
                    cursor: "pointer",
                  }}
                  onClick={() => console.log("Icon clicked")}
                />
              </Tooltip>
              {/* <img
                src={dislike}
                alt="Dislike"
                style={{
                  width: "25px",
                  height: "25px",
                  cursor: "pointer",
                  marginRight: "10px",
                }}
              /> */}
              {/* <img
                src={comment}
                alt="Comment"
                style={{
                  width: "25px",
                  height: "25px",
                  cursor: "pointer",
                  marginRight: "10px",
                }}
              /> */}
              {/* <img
                src={followers}
                alt="Comment"
                style={{
                  width: "25px",
                  height: "25px",
                  cursor: "pointer",
                  marginRight: "10px",
                }}
              /> */}
              {/* <img
                src={fans}
                alt="Comment"
                style={{
                  width: "25px",
                  height: "25px",
                  cursor: "pointer",
                  marginRight: "10px",
                }}
              /> */}
              {/* <img
                src={share}
                alt="Share"
                style={{
                  width: "25px",
                  height: "25px",
                  cursor: "pointer",
                }}
              /> */}
            </div>
          </div>
          {/* Part 2 & 3: Scrollable Section */}
          <div
            style={{
              overflowY: "auto",
              maxHeight: "calc(100vh - 56px - 200px - 54px)", // Adjust height to exclude the flag section and footer
            }}
          >
            {/* Activity Section */}
            {!isWorld && (
              <div
                className="container mt-1"
                style={{ maxWidth: "400px", marginBottom: "110px" }}
              >
                <div
                  className="d-flex align-items-center text-light p-2"
                  style={{
                    background: "linear-gradient(to right, #1e90ff, #87cefa)",
                    color: "white",
                  }}
                >
                  <h5 className="text-center mb-0" style={{ fontSize: "15px" }}>
                    Activities
                  </h5>
                </div>
                <div
                  className="card shadow-sm"
                  style={{ backgroundColor: "#ffffff" }}
                >
                  <div className="card-body text-center">
                    <ul className="list-group list-group-flush text-start">
                      <li
                        className="list-group-item"
                        style={{ fontSize: "0.85rem" }}
                      >
                        <img
                          src={feed}
                          alt="Add News"
                          className="me-2"
                          style={{ width: "20px", height: "20px" }}
                        />
                        Feed
                      </li>
                      <li
                        className="list-group-item"
                        style={{ fontSize: "0.85rem" }}
                      >
                        <img
                          src={user}
                          alt="Add News"
                          className="me-2"
                          style={{ width: "20px", height: "20px" }}
                        />
                        Connections
                      </li>
                      <li
                        className="list-group-item"
                        style={{ fontSize: "0.85rem" }}
                      >
                        <img
                          src={news}
                          alt="Add News"
                          className="me-2"
                          style={{ width: "20px", height: "20px" }}
                        />
                        Latest News
                      </li>
                      <li
                        className="list-group-item"
                        style={{ fontSize: "0.85rem" }}
                      >
                        <img
                          src={event}
                          alt="Add News"
                          className="me-2"
                          style={{ width: "20px", height: "20px" }}
                        />
                        Events
                      </li>
                      <li
                        className="list-group-item"
                        style={{ fontSize: "0.85rem" }}
                      >
                        <img
                          src={group}
                          alt="Add News"
                          className="me-2"
                          style={{ width: "20px", height: "20px" }}
                        />
                        Groups
                      </li>
                      <li
                        className="list-group-item"
                        style={{ fontSize: "0.85rem" }}
                      >
                        <img
                          src={notification}
                          alt="Add News"
                          className="me-2"
                          style={{ width: "20px", height: "20px" }}
                        />
                        Videos
                      </li>
                      <li
                        className="list-group-item"
                        style={{ fontSize: "0.85rem" }}
                      >
                        <img
                          src={set}
                          alt="Add News"
                          className="me-2"
                          style={{ width: "20px", height: "20px" }}
                        />
                        Photos
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Latest Updates Section */}
            {isWorld && (
              <div
                className="container mt-1"
                style={{
                  maxWidth: "400px",
                  marginBottom: "110px",
                  maxHeight: "calc(100vh - 56px - 200px)",
                }}
              >
                <div
                  className="card shadow-sm p-3"
                  style={{ borderRadius: "10px" }}
                >
                  <h5 className="mb-4">Latest updates</h5>
                  <ul className="list-unstyled">
                    {updates.map((update) => (
                      <li
                        key={update.id}
                        className="d-flex align-items-start mb-3"
                        style={{ gap: "10px" }}
                      >
                        <img
                          src={update.avatar}
                          alt={update.name}
                          className="rounded-circle"
                          style={{ width: "40px", height: "40px" }}
                        />
                        <div>
                          <p className="mb-1" style={{ fontSize: "0.9rem" }}>
                            <strong>{update.name}</strong> {update.message}
                          </p>
                          <small className="text-muted">{update.time}</small>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
