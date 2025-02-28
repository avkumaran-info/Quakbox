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
import { flagsData } from "../flags";
import { FaPaperPlane } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import { motion } from "framer-motion";
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

const RightSidebar = ({ countryCode, countryName, flag }) => {
  const { userData, favCountries, fanCountries } = useContext(StoreContext);
  const [countryData, setCountryData] = useState(null);
  const [counts, setCounts] = useState({
    comments: 0,
    likes: 0,
    dislikes: 0,
    shares: 0,
  });
  // console.log(countryCode);
  
  const country = flagsData.find((c) => c.code === countryCode);
  // console.log("County",country);
  const userId = userData?.users?.id || localStorage.getItem("user_Id");

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
        `https://${window.APP_DOMAIN}/admin/api/get_geo_country/${countryCode}`,
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

  const currentUser = userData?.name || "Guest";  // ✅ Ensure currentUser is always defined
  const [visibleCount, setVisibleCount] = useState(5); // ✅ Start with 5 comments
  // 🔹 Load initial comments when showComments is toggled
  const handleCommentClick = () => {
      fetchComments();   // Ensure comments are fetched
      setShowMore(false);
      setVisibleCount(5);  // ✅ Reset visibleCount when opening comments
      setShowComments(!showComments);
  };
  
  const [currentComments, setCurrentComments] = useState([]); 
  useEffect(() => {
      setCurrentComments(comments.slice(0, visibleCount));
  }, [comments, visibleCount]);
  
  // 🔹 Scroll event to load more comments
  const handleScroll = (event) => {
      const { scrollTop, scrollHeight, clientHeight } = event.target;
  
      if (scrollTop + clientHeight >= scrollHeight - 10) {
          setVisibleCount((prev) => prev + 5); // ✅ Load 5 more comments
      }
  };
  const [editingCommentId, setEditingCommentId] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");
  const [commentToDelete, setCommentToDelete] = useState(false);

  // Update comment API
  const updateComment = async (commentId) => {
    try {
      const token = localStorage.getItem("api_token");
      await axios.put(
        `https://${window.APP_DOMAIN}/admin/api/update_country_comment/${commentId}`,
        { comment: newCommentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchComments();
      setEditingCommentId(null);
      setNewCommentText("");
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };
  const[isEditCommentPopupOpen,setIsEditCommentPopupOpen] = useState(false);
    const openEditCommentPopup = (comment) => {
      if (comment && comment.id) {
        setEditingCommentId(comment.id);
        setNewCommentText(comment.text || ""); // Set text only if it exists
        setIsEditCommentPopupOpen(true);
      }
    };
    
  // Delete comment API
const deleteComment = async () => {
  if (!commentToDelete) return; // Ensure a comment is selected

  // Optimistically update UI before API call
  setCounts((prev) => ({
    ...prev,
    comments: prev.comments - 1, // Decrease count immediately
  }));

  setCurrentComments((prev) =>
    prev.filter((comment) => comment.id !== commentToDelete)
  );

  try {
    const token = localStorage.getItem("api_token");
    await axios.delete(
      `https://${window.APP_DOMAIN}/admin/api/delete_country_comment/${commentToDelete}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setCommentToDelete(null);
    closeCommentPopup();
  } catch (error) {
    console.error("Error deleting comment:", error);

    // Revert UI on failure
    setCounts((prev) => ({
      ...prev,
      comments: prev.comments + 1, // Restore the original count
    }));

    fetchComments(); // Fetch actual count again to avoid inconsistency
  }
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
  const [isLiked, setIsLiked] = useState(false); // Default not liked

  useEffect(() => {
    // Check if user has liked this country before
    setIsLiked(counts.likes > 0); // Adjust based on API response
  }, [counts]);
  
  const handleLikeDislike = async (countryCode, isLike) => {
    const token = localStorage.getItem("api_token");
  
    // Optimistically update UI
    setCounts((prev) => ({
      ...prev,
      likes: isLike ? prev.likes + 1 : prev.likes - 1,
    }));
    setIsLiked(isLike);
  
    const data = {
      country_code: countryCode,
      user_id: userId,
      is_like: isLike,
    };
  
    try {
      const response = await axios.post(
        `https://${window.APP_DOMAIN}/admin/api/set_country_likes`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (!response.data.success) {
        throw new Error("Like action failed");
      }
    } catch (error) {
      console.error("Request failed", error);
  
      // Revert UI on failure
      setCounts((prev) => ({
        ...prev,
        likes: isLike ? prev.likes - 1 : prev.likes + 1,
      }));
      setIsLiked(!isLike);
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
        `https://${window.APP_DOMAIN}/admin/api/get_country_comments/${countryCode}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (response.data && Array.isArray(response.data)) {
        setComments(
          response.data.map((comment) => ({
            id: comment.comment_id,
            user: comment.userName, // Fallback if username is missing
            text: comment.comment,
            user_id: comment.userID ,
            profilePic: comment.comment_user_profile_picture, // Ensure a default image
            createdAt: comment.created_at ? new Date(comment.created_at).toLocaleString() : "Unknown time",
          }))
        );
      } else {
        setComments([]); // If no valid data, reset the comments array
      }
  
      fetchCountryCounts();
    } catch (error) {
      console.error("Error fetching comments:", error.response?.data || error.message);
    }
  };
  
  const closeCommentPopup = () => {
    setShowComments(false);
    setShowEmojiPicker(false);
    setEditingCommentId(null);
  };
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiClick = (emojiObject) => {
    setNewComment((prev) => prev + emojiObject.emoji);
  };

  const [isPosting, setIsPosting] = useState(false); // Track posting state

  const handlePostComment = async () => {
    if (!newComment.trim() || isPosting) return;
  
    setIsPosting(true); // Disable button
  
    const tempComment = { user: currentUser, text: newComment };
    setCurrentComments((prev) => [...prev, tempComment]); // Optimistic UI update
    setNewComment("");
  
    try {
      const token = localStorage.getItem("api_token");
      await axios.post(
        `https://${window.APP_DOMAIN}/admin/api/set_country_comments`,
        { country_code: countryCode, comment: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      fetchComments(); // Fetch actual data to sync with backend
    } catch (error) {
      console.error("Error posting comment:", error);
  
      // Revert UI if API request fails
      setCurrentComments((prev) => prev.filter((c) => c !== tempComment));
    } finally {
      setIsPosting(false);
    }
  };
  

  // Calculate total pages
  // const totalPages = Math.ceil(comments.length / commentsPerPage);

  // // Get comments for the current page
  // const indexOfLastComment = currentPage * commentsPerPage;
  // const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  // const currentComments = comments.slice(0,5);
  useEffect(() => {
    if (!currentComments || currentComments.length === 0) {
      setEditingCommentId(null);
      setCommentToDelete(null);
    }
  }, [currentComments]);
  
  const getTimeAgo = (timestamp) => {
  const timeDifference = Date.now() - new Date(timestamp);
  const seconds = Math.floor(timeDifference / 1000);
  if (seconds < 60) return `${seconds} sec ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
};

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
                    onScroll={handleScroll}
                  >
                    <h6>Comments</h6>

                    {currentComments && Array.isArray(currentComments) && 
                    currentComments.filter(comment => comment && comment.user_id).length > 0 ? (currentComments
                      .filter(comment => comment && comment.user_id && comment.text) // Remove invalid comments
                      .map((comment, index) => {
                       const isUserComment = Number(comment.user_id) === Number(userId);
                       
                        return (
                          <div key={comment.id || index} className="d-flex align-items-start mb-3">
                            <img
                              src={comment.profilePic}
                              alt="User Avatar"
                              className="rounded-circle me-2"
                              style={{ width: "35px", height: "35px" }}
                            />
                            <div className="flex-grow-1">
                              <div className="d-flex justify-content-between align-items-center">
                                <h6 className="mb-0">{comment.user}</h6>

                                {isUserComment && ( // Only show edit & delete for the user's own comments
                                  <div className="d-flex">
                                    <i
                                      className="bi bi-pencil-square me-2"
                                      onClick={() => openEditCommentPopup(comment)}
                                      style={{ cursor: "pointer", fontSize: "16px" }}
                                    ></i>
                                    <i
                                      className="bi bi-trash"
                                      onClick={() => setCommentToDelete(comment.id)}
                                      style={{ cursor: "pointer", fontSize: "16px" }}
                                    ></i>
                                  </div>
                                )}
                              </div>

                              {editingCommentId === comment.id ? (
                                <div className="d-flex align-items-center mt-2">
                                  <input
                                    type="text"
                                    className="form-control form-control-sm me-2"
                                    value={newCommentText}
                                    onChange={(e) => setNewCommentText(e.target.value)}
                                  />
                                  <button
                                    className="btn btn-sm btn-success"
                                    onClick={() => updateComment(comment.id)}
                                  >
                                    Save
                                  </button>
                                  <button
                                    className="btn btn-sm btn-secondary ms-2"
                                    onClick={() => setEditingCommentId(null)}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <>
                                  {comment.text && comment.text.trim() ? (
                                    <p className="mb-1">{comment.text}</p>
                                  ) : (
                                    <p className="mb-1 text-muted">No content available</p>
                                  )}
                                  <small className="text-muted">{getTimeAgo(comment.createdAt)}</small>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-center text-muted mt-3">No comments yet.</p>
                    )}


                 {/* Delete Confirmation Modal */}
                  {commentToDelete && (
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
                        zIndex: 1050,
                      }}
                    >
                      <div
                        style={{
                          background: "#fff",
                          padding: "20px",
                          borderRadius: "8px",
                          boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
                          width: "350px",
                          textAlign: "center",
                        }}
                      >
                        {/* Header */}
                        <div
                          style={{
                            borderBottom: "1px solid #ddd",
                            paddingBottom: "10px",
                            marginBottom: "15px",
                          }}
                        >
                          <h4 style={{ margin: 0 }}>Confirm Deletion</h4>
                        </div>
                  
                        {/* Body */}
                        <div style={{ marginBottom: "15px" }}>
                          <p>Are you sure you want to delete this comment?</p>
                        </div>
                  
                        {/* Footer */}
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <button
                            style={{
                              background: "#6c757d",
                              color: "#fff",
                              padding: "8px 15px",
                              border: "none",
                              borderRadius: "5px",
                              cursor: "pointer",
                            }}
                            onClick={() => setCommentToDelete(null)}
                          >
                            Cancel
                          </button>
                          <button
                            style={{
                              background: "#dc3545",
                              color: "#fff",
                              padding: "8px 15px",
                              border: "none",
                              borderRadius: "5px",
                              cursor: "pointer",
                            }}
                            onClick={deleteComment}
                          >
                            Confirm
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Pagination Controls
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
                )} */}

                      {/* Post Comment Section */}
              <div className="mt-3 d-flex align-items-center" style={{ position: "relative" }}>
               {/* Textarea */}
                  <textarea
                    className="form-control me-2"
                    rows="1"
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    style={{ paddingRight: "80px" }} // Space for emoji button
                  />

                  {/* Emoji Button */}
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    style={{
                      position: "absolute",
                      right: "50px",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "20px",
                    }}
                  >
                    😀
                  </button>
                  {/* Send Button */}
                    <motion.button
                      className="btn btn-primary btn-sm"
                      onClick={handlePostComment}
                      whileTap={{ scale: 0.9 }} // Click animation
                      tabIndex="0"
                      style={{
                        transform: "none",
                        paddingTop: "4px",
                        paddingBottom: "6px",
                        paddingRight: "10px",
                      }}
                    >
                      <FaPaperPlane />
                    </motion.button>
                  {/* Emoji Picker Popup */}
                  {showEmojiPicker && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "40px",
                        right: "50px",
                        zIndex: "1000",
                        background: "white",
                        borderRadius: "10px",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                        padding: "10px",
                      }}
                    >
                      <EmojiPicker onEmojiClick={handleEmojiClick} width={300} height={350} />
                    </div>
                  )}
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
                        width: "140px", // Keep width fixed for proper oval shape
                        height: "180px", // Adjust height slightly for a better fit
                        borderRadius: "50%", // Ensures an accurate oval proportion
                        overflow: "hidden",
                        border: "4px solid white",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        margin: "auto",
                      }}
                    >
                      <img
                        src={userData.profile_image_url}
                        alt="User Profile"
                        className="img-fluid"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover", // Maintains aspect ratio while filling the oval
                          transform: "scale(1.1)", // Slight zoom-in to remove unwanted gaps
                        }}
                      />
                    </div>
                    <h5 className="mt-2 text-dark fw-bold text-uppercase">
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
                    // src={country.flag} // Use the imported flag image
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
                              color: counts.likes > 0 ? "blue" : "#263238", // Change color if liked
                              "&:hover": {
                                color: "blue",
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

                    <Tooltip title="Comment" arrow disableInteractive>
                      <div style={{ textAlign: "center" }}>
                        <CommentIcon
                          sx={{
                            fontSize: 30,
                            color: "#263238",
                            "&:hover": {
                              color: "blue",
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
                              color: "red",
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
                              color: "blue",
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
                              color: "blue",
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
