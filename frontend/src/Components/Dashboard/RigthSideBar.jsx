import React, { useEffect, useState } from "react";
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
import {
  Avatar,
  Button,
  Pagination,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import FavoriteSharpIcon from "@mui/icons-material/FavoriteSharp";
import GroupIcon from "@mui/icons-material/Group";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import { Tooltip } from "@mui/material";

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

const dummyProfilePic = "https://via.placeholder.com/40";
const RightSidebar = ({ countryCode, flag, countryName }) => {
  const [countryData, setCountryData] = useState(null);
  const [counts, setCounts] = useState({
    comments: 0,
    likes: 0,
    dislikes: 0,
    shares: 0,
  });

  

  const [favCountries, setFavCountries] = useState([]);
  const [fanCountries, setFanCountries] = useState([]);

  const [navbarHeight, setNavbarHeight] = useState(56);
  const [comments, setComments] = useState([]); // Store comments
  const [showComments, setShowComments] = useState(false); // Controls comment section visibility
  const [showMore, setShowMore] = useState(false); // Show 2 or 10 comments
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const commentsPerPage = 10; // Number of comments per page
  const [newComment, setNewComment] = useState("");
  // console.log("token");
  // console.log(token);

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
      fetchComments();
    }
  }, [countryCode]);

  useEffect(() => {
    fetchCountries();
  }, []);

  // console.log(
  //   "countryName is ",
  //   countryName,
  //   " and countryCode is ",
  //   countryCode
  // );

  const isWorld = location.pathname === "/world"; // Determines if we're in the "world" section

  // useEffect(() => {
  //   // Mock API call to get comments
  //   const fetchComments = () => {
  //     const mockComments = Array.from({ length: 50 }, (_, index) => ({
  //       id: index + 1,
  //       user: `User ${index + 1}`,
  //       text: `This is comment number ${index + 1}`,
  //     }));
  //     setComments(mockComments);
  //   };
  //   fetchComments();
  // }, []);

  const handleCommentClick = () => {
    setCurrentPage(1);
    setShowMore(false);
    setShowComments(!showComments);
  };

  const handleShowMore = () => {
    setShowMore(true);
  };
  const handleShowLess = () => {
    setCurrentPage(1);
    setShowMore(false);
  };
  const paginate = (pageNumber) => {
    console.log("pageNumber - ", pageNumber);
    return setCurrentPage(pageNumber);
  };

  // Get current comments
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = comments.slice(
    indexOfFirstComment,
    indexOfLastComment
  );

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

  const fetchCountries = async () => {
    const token = localStorage.getItem("api_token"); // Get token from localStorage

    if (!token) {
      setError("Authorization token not found. Please log in.");
      return;
    }
    try {
      // Fetch favorite countries
      const favCountriesRes = await axios.get(
        "https://develop.quakbox.com/admin/api/get_favourite_country",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Filter countries
      const favouriteCountries = favCountriesRes.data.favourite_country.filter(
        (country) => country.favourite_country === "1"
      );

      const fanCountriesOnly = favCountriesRes.data.favourite_country.filter(
        (country) =>
          country.favourite_country === "1" || country.favourite_country === "0"
      );

      // Use a Set to filter out duplicates based on the country code
      const uniqueCountries = [
        ...new Map(
          fanCountriesOnly.map((country) => [country.code, country])
        ).values(),
      ];

      // Update state
      setFavCountries(favouriteCountries || []);
      setFanCountries(uniqueCountries || []);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  ////////////////////////
  const handleFavouriteToggle = async () => {
    console.log("Favourite icon clicked");
  };

  const handleFanToggle = async () => {
    console.log("Fan icon clicked");
  };

  const handleShareToggle = async () => {
    console.log("share icon clicked");
  };
  ///////////////////////
  ////////////////////////////
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
  const handleCommentSubmit = async () => {
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

  // console.log("Total Comments:", comments.length);
  // console.log("Total Pages:", Math.ceil(comments.length / commentsPerPage));

  ///////////////////////////
  return (
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
                    onClick={() => handleLikeDislike(`${countryCode}`, true)}
                  />
                  <div style={{ fontSize: "16px", marginTop: "4px" }}>
                    {counts.likes}
                  </div>
                </div>
              </Tooltip>
              <Tooltip title="Dislike" arrow disableInteractive>
                <div style={{ textAlign: "center" }}>
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
                    onClick={() => handleLikeDislike(`${countryCode}`, false)}
                  />
                  <div style={{ fontSize: "16px", marginTop: "4px" }}>
                    {counts.dislikes}
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
          </div>
          <div
            style={{
              maxHeight: "265px", // Adjust the height as needed
              overflowY: "auto",
              // backgroundColor: "red",
            }}
          >
            {/* Comment Section */}
            {showComments ? (
              <div
                style={{
                  maxHeight: "265px", // Adjust the height as needed
                  overflowY: "auto",
                  // backgroundColor: "yellow",
                }}
              >
                <div className="container mt-1 mb-1 p-0">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontSize: { xs: "12px", sm: "16px", md: "18px" },
                      }}
                    >
                      Comments
                    </Typography>
                    {/* Pagination - Keep this unchanged */}
                    {showMore && (
                      <nav
                        className="m-2"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Stack spacing={2}>
                          <Pagination
                            // count={Math.ceil(comments.length / commentsPerPage)}
                            // count={10}
                            count={Math.max(
                              1,
                              Math.ceil(comments.length / commentsPerPage)
                            )}
                            // defaultPage={0}
                            siblingCount={0}
                            boundaryCount={1}
                            // count={10}
                            // showFirstButton
                            // showLastButton
                            // hidePrevButton hideNextButton
                            page={currentPage}
                            onChange={(event, value) => paginate(value)}
                            variant="outlined"
                            shape="rounded"
                            sx={{
                              "& .MuiPaginationItem-root": {
                                fontSize: "12px", // Smaller font size
                                minWidth: "25px", // Reduce width
                                height: "25px", // Reduce height
                                padding: "2px 6px", // Adjust padding
                                margin: "2px", // Reduce margin for compact layout
                              },
                              "@media (max-width: 900px)": {
                                "& .MuiPaginationItem-root": {
                                  fontSize: "8px", // Smaller font on mobile
                                  minWidth: "15px",
                                  height: "15px",
                                  padding: "1px 4px",
                                },
                              },
                            }}
                          />
                        </Stack>
                      </nav>
                    )}
                  </div>

                  <div
                    className="list-group"
                    style={{
                      maxHeight: "300px",
                      overflowY: "auto",
                    }}
                  >
                    {showMore
                      ? currentComments.map((comment) => (
                          <div key={comment.id}>
                            <li
                              key={comment.id}
                              className="list-group-item"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: { xs: "5px", sm: "10px" }, // Responsive gap
                                padding: { xs: "5px", sm: "8px" }, // Responsive padding
                                margin: "2px",
                                fontSize: { xs: "10px", sm: "12px" }, // Responsive font size
                              }}
                            >
                              <Avatar
                                src={dummyProfilePic}
                                alt="User"
                                sx={{
                                  width: { xs: 20, sm: 24 }, // Responsive Avatar size
                                  height: { xs: 20, sm: 24 },
                                  marginRight: 0,
                                }}
                              />
                              <strong style={{ fontSize: "12px" }}>
                                {comment.user}:
                              </strong>{" "}
                              <span style={{ fontSize: "12px" }}>
                                {comment.text}
                              </span>
                            </li>
                          </div>
                        ))
                      : comments.slice(0, 2).map((comment) => (
                          <div key={comment.id}>
                            <li
                              key={comment.id}
                              className="list-group-item"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: { xs: "5px", sm: "10px" },
                                padding: { xs: "5px", sm: "8px" },
                                margin: "2px",
                                fontSize: { xs: "10px", sm: "12px" },
                              }}
                            >
                              <Avatar
                                src={dummyProfilePic}
                                alt="User"
                                sx={{
                                  width: { xs: 20, sm: 24 },
                                  height: { xs: 20, sm: 24 },
                                  marginRight: 0,
                                }}
                              />
                              <strong style={{ fontSize: "12px" }}>
                                {comment.user}:
                              </strong>
                              <span style={{ fontSize: "12px" }}>
                                {comment.text}
                              </span>
                            </li>
                          </div>
                        ))}
                  </div>
                  {!showMore && (
                    <button
                      className="btn btn-link mt-2"
                      onClick={handleShowMore}
                      style={{ fontSize: "12px" }}
                    >
                      Show More
                    </button>
                  )}
                  <div>
                    <TextField
                      label="Add a comment"
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      sx={{
                        // marginBottom: 2,
                        fontSize: { xs: "12px", sm: "14px", md: "16px" }, // Responsive font size
                      }}
                    />
                    <Button
                      onClick={handleCommentSubmit}
                      variant="contained"
                      color="primary"
                      size="small"
                      sx={{
                        margin: 1,
                        fontSize: { xs: "10px", sm: "12px", md: "14px" }, // Responsive font size
                        padding: {
                          xs: "6px 12px",
                          sm: "8px 16px",
                          md: "4px 10px",
                        }, // Responsive padding
                      }}
                    >
                      Add Comment
                    </Button>
                    <Button
                      onClick={() => setNewComment("")}
                      variant="contained"
                      size="small"
                      sx={{
                        margin: 1,
                        fontSize: { xs: "10px", sm: "12px", md: "14px" }, // Responsive font size
                        padding: {
                          xs: "6px 12px",
                          sm: "8px 16px",
                          md: "4px 10px",
                        }, // Responsive padding
                      }}
                    >
                      Cancel Comment
                    </Button>
                    <Button
                      onClick={handleCommentClick}
                      variant="outlined"
                      size="small"
                      sx={{
                        margin: 1,
                        fontSize: { xs: "10px", sm: "12px", md: "14px" }, // Responsive font size
                        padding: {
                          xs: "6px 12px",
                          sm: "8px 16px",
                          md: "4px 10px",
                        }, // Responsive padding
                      }}
                    >
                      Hide Comments Sections
                    </Button>

                    {showMore && (
                      <Button
                        onClick={handleShowLess}
                        variant="outlined"
                        size="small"
                        sx={{
                          margin: 1,
                          fontSize: { xs: "10px", sm: "12px", md: "14px" }, // Responsive font size
                          padding: {
                            xs: "6px 12px",
                            sm: "8px 16px",
                            md: "4px 10px",
                          }, // Responsive padding
                        }}
                      >
                        Show Less
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="mt-3"
                // style={{
                //   overflowY: "auto",
                //   maxHeight: "calc(100vh - 56px - 200px - 54px)",
                // }}
                style={
                  {
                    // backgroundColor: "green",
                  }
                }
              >
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
            )}
            {/* Part 2 & 3: Scrollable Section */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
