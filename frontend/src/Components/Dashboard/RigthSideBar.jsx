import React, { useContext, useEffect, useState } from "react";
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
import axios from "axios";
import CommentIcon from "@mui/icons-material/Comment";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import FavoriteSharpIcon from "@mui/icons-material/FavoriteSharp";
import GroupIcon from "@mui/icons-material/Group";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import { Tooltip } from "@mui/material";
import { StoreContext } from "../../Context/StoreContext";

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

const RightSidebar = ({ countryCode, flag, countryName }) => {
  const { userData, favCountries, fanCountries } = useContext(StoreContext);
  const [countryData, setCountryData] = useState(null);
  const [counts, setCounts] = useState({
    comments: 0,
    likes: 0,
    dislikes: 0,
    shares: 0,
  });

  const [navbarHeight, setNavbarHeight] = useState(56);
  const [comments, setComments] = useState([]); // Store comments
  const [showComments, setShowComments] = useState(false); // Controls comment section visibility
  const [showMore, setShowMore] = useState(false); // Show 2 or 10 comments
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const commentsPerPage = 10; // Number of comments per page
  const [newComment, setNewComment] = useState("");

  // Fetch the data for comments, likes, dislikes, and shares count
  const fetchCountryCounts = async () => {
    try {
      const token = localStorage.getItem("api_token");
      const response = await axios.get(
        `https://develop.quakbox.com/admin/api/get_geo_country/${countryCode}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Authorization header with token
          },
        }
      );
      // console.log("response.data");
      // console.log(response.data);
      if (response.data.success) {
        const country = response.data.geo_countries[0];
        setCounts({
          comments: country.comments_count,
          likes: country.like_cnt,
          dislikes: country.dislikes_count,
          shares: country.shares_count,
        });
      } else {
        console.error("Failed to fetch country data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (countryCode) {
      fetchCountryCounts();
    }
  }, [countryCode]);

  const isWorld = location.pathname === "/world"; // Determines if we're in the "world" section
  const isDashboaed = location.pathname === "/dashboard";

  const handleCommentClick = () => {
    fetchComments();
    setCurrentPage(1);
    setShowMore(false);
    setShowComments(!showComments);
  };

  useEffect(() => {
    const updateNavbarHeight = () => {
      setNavbarHeight(window.innerWidth <= 991 ? 110 : 56);
    };

    updateNavbarHeight();
    window.addEventListener("resize", updateNavbarHeight);

    return () => {
      window.removeEventListener("resize", updateNavbarHeight);
    };
  });

  const handleLikeDislike = async (countryCode, isLike) => {
    const token = localStorage.getItem("api_token");
    const data = {
      country_code: countryCode,
      // user_id: userId,
      is_like: isLike,
    };

    try {
      const response = await axios.post(
        "https://develop.quakbox.com/admin/api/set_country_likes",
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        fetchCountryCounts();
      }
      // console.log("Response:", response.data);
    } catch (error) {
      console.error("Request failed", error);
    }
  };

  const handleFavouriteToggle = async () => {
    console.log("Favourite icon clicked");
  };

  const handleFanToggle = async () => {
    console.log("Fan icon clicked");
  };

  const handleShareToggle = async () => {
    console.log("share icon clicked");
  };

  const fetchComments = async () => {
    try {
      const token = localStorage.getItem("api_token");
      const response = await axios.get(
        `https://develop.quakbox.com/admin/api/get_country_comments/${countryCode}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data && Array.isArray(response.data)) {
        setComments(
          response.data.map((comment) => ({
            id: comment.comment_id,
            user: comment.userName,
            text: comment.comment,
          }))
        );

        fetchCountryCounts();
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const closeCommentPopup = () => {
    setShowComments(false);
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    try {
      const token = localStorage.getItem("api_token");
      await axios.post(
        "https://develop.quakbox.com/admin/api/set_country_comments",
        { country_code: countryCode, comment: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment("");
      fetchComments();
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil(comments.length / commentsPerPage);

  // Get comments for the current page
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = comments.slice(
    indexOfFirstComment,
    indexOfLastComment
  );

  return (
    <>
      {showComments && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              {/* Header */}
              <div className="modal-header">
                <h5 className="modal-title">Country Comments</h5>
                <button
                  className="btn-close"
                  onClick={closeCommentPopup}
                ></button>
              </div>

              {/* Body */}
              <div
                className="modal-body d-flex flex-column"
                style={{ maxHeight: "80vh" }}
              >
                {/* Fixed Post Content */}
                <div className="post-preview" style={{ flexShrink: 0 }}>
                  <img
                    src={flag}
                    alt="Post image"
                    className="img-fluid rounded w-100"
                    style={{
                      height: "150px",
                      objectFit: "contain",
                    }}
                  />
                </div>

                <hr />

                {/* Scrollable Comments Section */}
                <div
                  className="comments-section flex-grow-1 overflow-auto"
                  style={{ maxHeight: "40vh", paddingRight: "10px" }}
                >
                  <h6>Comments</h6>

                  {currentComments.length > 0 ? (
                    currentComments.map((comment, index) => (
                      <div
                        key={index}
                        className="d-flex align-items-start mb-3"
                      >
                        <div>
                          <h6 className="mb-0">{comment.user}</h6>
                          <p className="mb-1">{comment.text}</p>
                          <small className="text-muted">
                            {/* {getTimeAgo(comment.comment_updated_datetime)} */}
                          </small>
                        </div>
                      </div>
                    ))
                  ) : (
                    <>No comments</>
                  )}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="d-flex justify-content-center mt-3">
                    <nav>
                      <ul className="pagination">
                        {[...Array(totalPages)].map((_, index) => (
                          <li
                            key={index}
                            className={`page-item ${
                              currentPage === index + 1 ? "active" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(index + 1)}
                            >
                              {index + 1}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </div>
                )}

                {/* Add a Comment */}
                <div className="mt-3">
                  <textarea
                    className="form-control"
                    rows="2"
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  ></textarea>
                  <button
                    className="btn btn-primary btn-sm mt-2"
                    onClick={handlePostComment}
                  >
                    Post Comment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className="col-md-3 d-none d-md-block bg-light position-fixed"
        style={{
          height: "100vh",
          top: `${navbarHeight}px`,
          right: "0",
          paddingBottom: "54px",
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
              {isDashboaed ? (
                <>
                  <div
                    className="text-center d-flex flex-column align-items-center"
                    style={{
                      backgroundColor: "#fff",
                      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                      padding: "20px",
                      borderRadius: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "75%", // Keeps image size proportional
                        maxWidth: "150px", // Prevents it from becoming too large
                        aspectRatio: "1/1", // Ensures a perfect square
                        borderRadius: "50%",
                        overflow: "hidden",
                        border: "4px solid white",
                        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        margin: "auto", // Centers the div horizontally
                      }}
                    >
                      <img
                        src={userData.profile_image_url}
                        alt="User Profile"
                        className="img-fluid"
                        style={{
                          width: "100%", // Ensures the image takes up the full container
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <h5 className="mt-2 text-dark">
                      {userData.users.username}
                    </h5>
                    <button className="btn btn-primary mt-2">
                      Change Picture
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <img
                    src={flag}
                    alt={countryName}
                    className="img-fluid"
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                    }}
                  />
                  <h5 className="mt-2 mb-2 text-secondary">{countryName}</h5>
                  {/* Like, Dislike, Comment, Share Icons */}
                  <div className="d-flex justify-content-around">
                    <Tooltip title="Like" arrow disableInteractive>
                      <div style={{ textAlign: "center" }}>
                        <ThumbUpIcon
                          sx={{
                            fontSize: 30,
                            color: "#263238",
                            "&:hover": {
                              transform: "scale(1.2)",
                            },
                            transition: "all 0.3s ease",
                            fontWeight: "bold",
                            opacity: 0.8,
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handleLikeDislike(`${countryCode}`, true)
                          }
                        />
                        <div style={{ fontSize: "16px", marginTop: "4px" }}>
                          {counts.likes}
                        </div>
                      </div>
                    </Tooltip>

                    <Tooltip title="Comment" arrow disableInteractive>
                      <div style={{ textAlign: "center" }}>
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
                          onClick={handleCommentClick}
                        />
                        <div style={{ fontSize: "16px", marginTop: "4px" }}>
                          {counts.comments}
                        </div>
                      </div>
                    </Tooltip>
                    <Tooltip title="Favourite" arrow disableInteractive>
                      <div style={{ textAlign: "center" }}>
                        <FavoriteSharpIcon
                          sx={{
                            fontSize: 30,
                            color: favCountries.some(
                              (c) => c.country_code === countryCode
                            )
                              ? "red"
                              : "#263238",
                            "&:hover": {
                              //color: "red",
                              transform: "scale(1.2)",
                            },
                            transition: "all 0.3s ease",
                            fontWeight: "bold",
                            opacity: 0.8,
                            cursor: "pointer",
                          }}
                          onClick={handleFavouriteToggle}
                        />
                        <div style={{ fontSize: "16px", marginTop: "4px" }}>
                          {favCountries.length}
                        </div>
                      </div>
                    </Tooltip>
                    <Tooltip title="Fan" arrow disableInteractive>
                      <div style={{ textAlign: "center" }}>
                        <GroupIcon
                          sx={{
                            fontSize: 30,
                            color: fanCountries.some(
                              (c) => c.country_code === countryCode
                            )
                              ? "blue"
                              : "#263238",
                            "&:hover": {
                              //color: "red",
                              transform: "scale(1.2)",
                            },
                            transition: "all 0.3s ease",
                            fontWeight: "bold",
                            opacity: 0.8,
                            cursor: "pointer",
                          }}
                          onClick={handleFanToggle}
                        />
                        <div style={{ fontSize: "16px", marginTop: "4px" }}>
                          {fanCountries.length}
                        </div>
                      </div>
                    </Tooltip>
                    <Tooltip title="Share" arrow disableInteractive>
                      <div style={{ textAlign: "center" }}>
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
                          onClick={handleShareToggle}
                        />
                        <div style={{ fontSize: "16px", marginTop: "4px" }}>
                          {counts.shares}
                        </div>
                      </div>
                    </Tooltip>
                  </div>
                </>
              )}
            </div>
            <div
              style={{
                maxHeight: "265px", // Adjust the height as needed
                overflowY: "auto",
                // backgroundColor: "red",
              }}
            >
              {/* Comment Section */}
              <div className="mt-3">
                {/* Activity Section */}
                {!isWorld && (
                  <div
                    className="container mt-1"
                    style={{ maxWidth: "400px", marginBottom: "10px" }}
                  >
                    <div
                      className="d-flex align-items-center text-light p-2"
                      style={{
                        background:
                          "linear-gradient(to right, #1e90ff, #87cefa)",
                        color: "white",
                      }}
                    >
                      <h5
                        className="text-center mb-0"
                        style={{ fontSize: "15px" }}
                      >
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
                              <p
                                className="mb-1"
                                style={{ fontSize: "0.9rem" }}
                              >
                                <strong>{update.name}</strong> {update.message}
                              </p>
                              <small className="text-muted">
                                {update.time}
                              </small>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
              {/* Part 2 & 3: Scrollable Section */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RightSidebar;
