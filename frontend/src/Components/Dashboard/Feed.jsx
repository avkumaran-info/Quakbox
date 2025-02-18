import React, { useContext, useEffect, useState } from "react";
import defaultUserImage from "../../assets/images/vector-users-icon.jpg";
import axios from "axios";
import CommentIcon from "@mui/icons-material/Comment";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ShareIcon from "@mui/icons-material/Share";
import { StoreContext } from "../../Context/StoreContext";

const Feed = ({ countryCode, flag, countryName, handleCountryChange }) => {
  const { userData } = useContext(StoreContext);
  const [navbarHeight, setNavbarHeight] = useState(56);
  const [likedPosts, setLikedPosts] = useState([]);
  const [dislikedPosts, setDislikedPosts] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [data, setData] = useState({ posts: [] });
  const [message, setMessage] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [postToEdit, setPostToEdit] = useState(null);
  const [editedMessage, setEditedMessage] = useState("");
  const [editedMediaFile, setEditedMediaFile] = useState(null);
  const [editedMediaPreview, setEditedMediaPreview] = useState(null);

  const userId = localStorage.getItem("user_Id");

  // Functions to handle popup visibility
  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  const [isCommentPopupOpen, setCommentPopupOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [visibleComments, setVisibleComments] = useState(10);
  const [comments, setComments] = useState([]); // Store comments
  const [newComment, setNewComment] = useState(""); // Store new comment input
  const [loading, setLoading] = useState(false);

  const [commentText, setCommentText] = useState("");

  const getCommets = async (post) => {
    try {
      const token = localStorage.getItem("api_token");

      const response = await axios.get(
        `https://develop.quakbox.com/admin/api/get_posts_comment/${post.id}/comment`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to header
          },
        }
      );
      setComments(response.data.data || []);
      console.log(response.data.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const postComment = async (postId, commentText) => {
    try {
      const token = localStorage.getItem("api_token");
      if (!token) {
        console.error("No API token found");
        return;
      }

      const response = await axios.post(
        `https://develop.quakbox.com/admin/api/set_posts_comment/${postId}/comment`,
        {
          comment: commentText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // console.log("Comment posted successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  // Calling the function inside the comment modal
  const handlePostComment = async () => {
    // console.log("hi");
    // console.log(selectedPost.id);
    // console.log(commentText);

    if (!selectedPost || !commentText.trim()) return;
    await postComment(selectedPost.id, commentText);
    setCommentText(""); // Clear the input after posting
    getCommets(selectedPost); // Refresh comments
  };

  const openCommentPopup = async (post) => {
    await getCommets(post);
    setSelectedPost(post);
    setCommentPopupOpen(true);
  };

  const closeCommentPopup = () => {
    setSelectedPost(null);
    setCommentPopupOpen(false);
  };

  const loadMoreComments = () => {
    setVisibleComments((prev) => prev + 10); // Load 10 more comments on click
  };

  const deleteComment = async (postId, commentId) => {
    try {
      const token = localStorage.getItem("api_token");
      if (!token) {
        console.error("No API token found");
        return;
      }
  
      const response = await axios.delete(
        `https://develop.quakbox.com/admin/api/del_posts/${postId}/comments/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("Comment deleted:", response.data);
      // After deletion, refresh the comments
      getCommets(selectedPost);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };  
  // Open Delete Popup
  const openDeletePopup = (post) => {
    setPostToDelete(post);
    setIsDeletePopupOpen(true);
  };

  // Close Delete Popup
  const closeDeletePopup = () => {
    setPostToDelete(null);
    setIsDeletePopupOpen(false);
  };

  // Open Edit Popup
  const openEditPopup = (post) => {
    setPostToEdit(post);
    setEditedMessage(post.message);
    setEditedMediaPreview(post.attachments?.data?.[0]?.media?.[0]?.url || null);
    setIsEditPopupOpen(true);
  };

  // Close Edit Popup
  const closeEditPopup = () => {
    setPostToEdit(null);
    setEditedMessage("");
    setEditedMediaFile(null);
    setEditedMediaPreview(null);
    setIsEditPopupOpen(false);
  };

  // Handle Edit Media Change
  const handleEditFileChange = (event) => {
    const file = event.target.files[0];
    setEditedMediaFile(file);
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setEditedMediaPreview(previewURL);
    }
  };

  // Handle Delete Confirmation
  const handleDeletePost = async () => {
    if (!postToDelete) return;
    const token = localStorage.getItem("api_token");
    if (!token) return;
    try {
      const res = await axios.delete(
        `https://develop.quakbox.com/admin/api/del_posts/${postToDelete.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        setData((prevData) => ({
          ...prevData,
          posts: prevData.posts.filter((post) => post.id !== postToDelete.id),
        }));
        closeDeletePopup();
      } else {
        alert("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("An error occurred while deleting the post");
    }
  };

  // Handle Edit Post Submission
  const handleEditSubmit = async () => {
    if (!postToEdit) return;

    const token = localStorage.getItem("api_token");
    if (!token) {
      alert("Authorization token missing. Please log in.");
      return;
    }

    // ✅ Log the edited message to check if it's updating
    console.log("Edited message:", editedMessage);

    try {
      const res = await axios.put(
        `https://develop.quakbox.com/admin/api/put_posts/${postToEdit.id}`,
        { message: editedMessage }, // ✅ Sending message as JSON instead of FormData
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // ✅ API might expect JSON, not FormData
          },
        }
      );

      if (res.status === 200 && res.data.post) {
        // ✅ Ensure the new message from response is used
        setData((prevData) => ({
          ...prevData,
          posts: prevData.posts.map((post) =>
            post.id === postToEdit.id
              ? {
                  ...post,
                  message: res.data.post.message, // ✅ Use updated message from API response
                }
              : post
          ),
        }));

        closeEditPopup();
      } else {
        alert("Failed to edit post.");
      }
    } catch (error) {
      console.error("Error editing post:", error);
      alert("An error occurred while editing the post.");
    }
  };

  // Function to calculate relative time
  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const seconds = Math.floor((now - postTime) / 1000);

    if (seconds < 5) return `Now`;
    if (seconds < 60) return `${seconds} sec ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks} week ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month ago`;
    const years = Math.floor(days / 365);
    return `${years} year ago`;
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setMediaFile(file);
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setMediaPreview(previewURL);
    }
  };

  // const userData = async () => {
  //   const token = localStorage.getItem("api_token");
  //   if (!token) {
  //     return;
  //   }
  //   try {
  //     const res = await axios.get(
  //       "https://develop.quakbox.com/admin/api/user",
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );
  //     setUserDetails(res.data);
  //     setUserName(res.data.users);
  //     setCurrentUserId(userData.users.id);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleSubmit = async () => {
    const token = localStorage.getItem("api_token");

    if (!message && !mediaFile) {
      alert("Empty post not created");
      return;
    }

    const formData = new FormData();
    formData.append("message", message);
    formData.append("country_code", countryCode);
    if (mediaFile) {
      formData.append("media", mediaFile);
    }
    console.log(formData);

    try {
      const response = await axios.post(
        "https://develop.quakbox.com/admin/api/set_posts",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            ContentType: "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        const newPost = {
          id: response.data.id,
          message: message,
          created_time: new Date().toISOString(),
          from: {
            name: userData.users.username,
            profile_image: userData.profile_image_url,
          },
          attachments: mediaFile
            ? {
                data: [
                  {
                    type: mediaFile.type.startsWith("image/")
                      ? "image"
                      : "video",
                    media: [
                      {
                        url: mediaPreview,
                        alt_text: "Uploaded media",
                      },
                    ],
                  },
                ],
              }
            : null,
          likes: { count: 0 },
          liked_users: [],
          dislikes: { count: 0 },
          comments: { count: 0 },
          shares: { count: 0 },
        };

        // setData((prevData) => ({
        //   ...prevData,
        //   posts: [newPost, ...prevData.posts],
        // }));
        getPost();

        setMessage("");
        setMediaFile(null);
        setMediaPreview(null);
        closePopup();
      } else {
        alert("Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("An error occurred while creating the post");
    }
  };

  // // Handle Like Click
  // const handleLikeClick = async (postId) => {
  //   const token = localStorage.getItem("api_token");

  //   const currentUser = {
  //     id: currentUserId,
  //     name: userName.username || "Unknown User",
  //   };

  //   setData((prevData) =>
  //     Array.isArray(prevData.posts)
  //       ? {
  //           ...prevData,
  //           posts: prevData.posts.map((post) =>
  //             post.id === postId
  //               ? {
  //                   ...post,
  //                   likes: {
  //                     count: (post.likes?.count || 0) + 1,
  //                   },
  //                   liked_users: [...(post.liked_users || []), currentUser],
  //                 }
  //               : post
  //           ),
  //         }
  //       : prevData
  //   );

  //   try {
  //     const res = await axios.post(
  //       `https://develop.quakbox.com/admin/api/set_posts_like/${postId}/like`,
  //       {},
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );

  //     if (res.status !== 200) {
  //       console.error("Failed to save the like in the database.");
  //       revertLike(postId);
  //     }
  //   } catch (error) {
  //     console.error("Error liking the post:", error);
  //     revertLike(postId);
  //   }
  // };
  // // handleDislikeClick
  // ///////////////////////////
  // // Helper function to revert the like action
  // const revertLike = (postId) => {
  //   setData((prevData) =>
  //     Array.isArray(prevData.posts)
  //       ? {
  //           ...prevData,
  //           posts: prevData.posts.map((post) =>
  //             post.id === postId
  //               ? {
  //                   ...post,
  //                   likes: {
  //                     count: Math.max((post.likes?.count || 0) - 1, 0),
  //                   },
  //                   liked_users: (post.liked_users || []).filter(
  //                     (user) => user.id !== currentUserId
  //                   ),
  //                 }
  //               : post
  //           ),
  //         }
  //       : prevData
  //   );
  // };

  // // Handle dislike Click

  // const handleDislikeClick = (postId) => {
  //   if (dislikedPosts.includes(postId)) {
  //     // Remove from dislikedPosts if already disliked
  //     setDislikedPosts(dislikedPosts.filter((id) => id !== postId));
  //   } else {
  //     // Add to dislikedPosts
  //     setDislikedPosts([...dislikedPosts, postId]);

  //     // Optional: Remove from likedPosts if it's there
  //     if (likedPosts.includes(postId)) {
  //       setLikedPosts(likedPosts.filter((id) => id !== postId));
  //     }
  //   }
  // };

  const handleLikeClick = async (postId) => {
    const token = localStorage.getItem("api_token");

    const currentUser = {
      user_id: userData.users.id, // Correct field name based on your API response
      name: userData.users.username || "Unknown User",
    };

    setData((prevData) =>
      Array.isArray(prevData.posts)
        ? {
            ...prevData,
            posts: prevData.posts.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    likes: {
                      count: (post.likes?.count || 0) + 1,
                      liked_users: [
                        ...(post.likes?.liked_users || []),
                        currentUser,
                      ],
                    },
                    // Remove dislike if user had disliked before
                    disliked_users: (post.disliked_users || []).filter(
                      (user) => user.user_id !== userData.users.id
                    ),
                  }
                : post
            ),
          }
        : prevData
    );

    try {
      const res = await axios.post(
        `https://develop.quakbox.com/admin/api/set_posts_like/${postId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status !== 200) {
        console.error("Failed to save the like in the database.");
        revertLike(postId);
      }
    } catch (error) {
      console.error("Error liking the post:", error);
      revertLike(postId);
    }
  };

  // Revert Like (Rollback if API call fails)
  const revertLike = (postId) => {
    setData((prevData) =>
      Array.isArray(prevData.posts)
        ? {
            ...prevData,
            posts: prevData.posts.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    likes: {
                      count: Math.max((post.likes?.count || 0) - 1, 0),
                      liked_users: (post.likes?.liked_users || []).filter(
                        (user) => user.user_id !== userData.users.id
                      ),
                    },
                  }
                : post
            ),
          }
        : prevData
    );
  };

  // // Handle Dislike Click
  const handleDislikeClick = async (postId) => {
    const token = localStorage.getItem("api_token");

    const currentUser = {
      user_id: userData.users.id,
      name: userData.users.username || "Unknown User",
    };

    setData((prevData) =>
      Array.isArray(prevData.posts)
        ? {
            ...prevData,
            posts: prevData.posts.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    disliked_users: [
                      ...(post.disliked_users || []),
                      currentUser,
                    ],
                    // Remove like if user had liked before
                    likes: {
                      count: Math.max((post.likes?.count || 0) - 1, 0),
                      liked_users: (post.likes?.liked_users || []).filter(
                        (user) => user.user_id !== userData.users.id
                      ),
                    },
                  }
                : post
            ),
          }
        : prevData
    );

    try {
      const res = await axios.post(
        `https://develop.quakbox.com/admin/api/set_posts_like/${postId}/dislike`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status !== 200) {
        console.error("Failed to save the dislike in the database.");
        revertDislike(postId);
      }
    } catch (error) {
      console.error("Error disliking the post:", error);
      revertDislike(postId);
    }
  };

  // Revert Dislike (Rollback if API call fails)
  const revertDislike = (postId) => {
    setData((prevData) =>
      Array.isArray(prevData.posts)
        ? {
            ...prevData,
            posts: prevData.posts.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    disliked_users: (post.disliked_users || []).filter(
                      (user) => user.user_id !== userData.users.id
                    ),
                  }
                : post
            ),
          }
        : prevData
    );
  };

  // const getPost = async () => {
  //   const token = localStorage.getItem("api_token");

  //   if (!token) {
  //     console.log("No token found, user may not be logged in.");
  //     return;
  //   }
  //   try {
  //     const res = await axios.get(
  //       `https://develop.quakbox.com/admin/api/get_posts/${countryCode}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           ContentType: "contentType",
  //         },
  //       }
  //     );
  //     console.log(res.data);

  //     setData(res.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // Fetch posts function
  const getPost = async () => {
    const token = localStorage.getItem("api_token");
    if (!token) {
      console.log("No token found, user may not be logged in.");
      return;
    }
    console.log(countryCode);

    try {
      const res = await axios.get(
        `https://develop.quakbox.com/admin/api/get_posts/${countryCode}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Extract posts only if status is true
      if (res.data.status && Array.isArray(res.data.posts)) {
        const formattedPosts = res.data.posts.map((post) => ({
          ...post,
          created_time: post.created_time || new Date().toISOString(),
          timeAgo: getTimeAgo(post.created_time),
        }));

        setData({ posts: formattedPosts });
        // console.log(data);
      } else {
        console.log("Invalid API response structure.");
      }
    } catch (error) {
      console.log("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    // Cleanup the preview URL to avoid memory leaks
    return () => {
      if (mediaPreview) {
        URL.revokeObjectURL(mediaPreview);
      }
    };
  }, [mediaPreview]);

  useEffect(() => {
    // userData();
    getPost();

    // Update "time ago" dynamically every 60 seconds
    const interval = setInterval(() => {
      setData((prevData) => ({
        ...prevData,
        posts: prevData.posts.map((post) => ({
          ...post,
          timeAgo: getTimeAgo(post.created_time),
        })),
      }));
    }, 60000);

    return () => clearInterval(interval);
  }, [countryCode]);
  useEffect(() => {
    const updateNavbarHeight = () => {
      setNavbarHeight(window.innerWidth <= 991 ? 110 : 56);
    };

    updateNavbarHeight();
    window.addEventListener("resize", updateNavbarHeight);

    return () => {
      window.removeEventListener("resize", updateNavbarHeight);
    };
  }, []);

  return (
    <div
      className="col-12 col-md-6 offset-md-3 p-1"
      style={{
        marginTop: `${navbarHeight}px`,
        marginBottom: "60px",
      }}
    >
      <div className="text-white p-0 rounded">
        {/* Post Input Section */}
        <div className="card p-1 mb-1">
          <div className="d-flex align-items-center">
            <img
              src={userData.profile_image_url}
              alt="Profile"
              className="rounded-circle me-2"
              style={{ width: "40px", height: "40px" }}
            />
            <input
              type="text"
              className="form-control"
              placeholder="Trend the Quakpost"
              onClick={openPopup}
              style={{ fontSize: "16px", cursor: "pointer" }}
            />
            <button className="btn btn-light d-flex align-items-center flex-grow-1 m-1">
              <i className="fa fa-video text-danger"></i>
            </button>
          </div>
          <div className="d-flex justify-content-between flex-wrap">
            {/*<button className="btn btn-light d-flex align-items-center flex-grow-1 m-1">
              <i className="fa fa-video me-2 text-danger"></i> Live video
            </button>*/}

            {/* Button to trigger the popup */}

            {/*<button
              className="btn btn-light d-flex align-items-center flex-grow-1 m-1"
              onClick={openPopup}
            >
              <i className="fa fa-image me-2 text-success"></i> Photo/video
            </button>*/}

            {/* Popup Modal */}
            {isPopupOpen && (
              <div
                className="modal fade show d-block"
                style={{ background: "rgba(0, 0, 0, 0.5)" }}
                tabIndex="-1"
              >
                <div
                  className="modal-dialog modal-dialog-centered modal-lg"
                  style={{ maxWidth: "600px" }}
                >
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Create Post</h5>

                      <button
                        type="button"
                        className="btn-close"
                        aria-label="Close"
                        onClick={() => {
                          closePopup();
                          setMediaPreview(null); // Clear preview when popup is closed
                        }}
                      ></button>
                    </div>

                    <div className="modal-body">
                      {/* User Info at the Top */}
                      <div className="d-flex align-items-center mb-3">
                        <img
                          src={userData.profile_image_url} // Use userImage or a default image
                          alt="User Avatar"
                          className="rounded-circle me-2"
                          style={{ width: "40px", height: "40px" }}
                        />
                        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                          {userData.users.username}
                        </span>{" "}
                        {/* Replace with dynamic user name */}
                      </div>
                      <textarea
                        className="form-control"
                        rows="4"
                        placeholder="What's on your mind?"
                        style={{ resize: "none" }}
                        value={message}
                        onChange={handleMessageChange}
                      ></textarea>

                      <div className="border rounded mt-3 p-3 text-center">
                        {/* Default prompt when no file is uploaded */}
                        {!mediaPreview ? (
                          <div
                            className="d-flex align-items-center justify-content-center"
                            onClick={() =>
                              document.getElementById("hiddenFileInput").click()
                            }
                            style={{ cursor: "pointer" }}
                          >
                            <i className="fas fa-photo-video fs-2 me-2"></i>
                            <span>Add photos/videos</span>
                          </div>
                        ) : (
                          // Show the preview when a file is uploaded
                          <div className="position-relative">
                            {mediaFile.type.startsWith("image/") ? (
                              <img
                                src={mediaPreview}
                                alt="Preview"
                                className="img-fluid rounded"
                                style={{ maxHeight: "400px" }}
                              />
                            ) : mediaFile.type.startsWith("video/") ? (
                              <video
                                controls
                                className="w-100"
                                style={{ maxHeight: "400px" }}
                              >
                                <source
                                  src={mediaPreview}
                                  type={mediaFile.type}
                                />
                                Your browser does not support the video tag.
                              </video>
                            ) : null}

                            {/* Close button */}
                            <button
                              className="btn btn-close position-absolute top-0 end-0"
                              style={{
                                backgroundColor: "white",
                                borderRadius: "50%",
                                padding: "5px",
                              }}
                              onClick={() => {
                                setMediaPreview(null);
                                setMediaFile(null); // Reset the media file
                              }}
                              aria-label="Close"
                            ></button>
                          </div>
                        )}

                        {/* Hidden file input */}
                        <input
                          id="hiddenFileInput"
                          type="file"
                          style={{ display: "none" }}
                          onChange={handleFileChange}
                          accept="image/*,video/*"
                        />
                      </div>
                    </div>

                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-primary w-100"
                        onClick={handleSubmit}
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Post Popup */}
            {isEditPopupOpen && (
              <div
                className="modal fade show d-block"
                style={{ background: "rgba(0, 0, 0, 0.5)" }}
              >
                <div className="modal-dialog modal-dialog-centered modal-md">
                  <div className="modal-content">
                    {/* Header */}
                    <div className="modal-header">
                      <h5 className="modal-title">Edit Post</h5>
                      <button
                        className="btn-close"
                        onClick={closeEditPopup}
                      ></button>
                    </div>

                    {/* Body */}
                    <div className="modal-body">
                      <textarea
                        className="form-control mb-3"
                        rows="3"
                        value={editedMessage}
                        onChange={(e) => setEditedMessage(e.target.value)}
                      ></textarea>

                      {/* Media Preview (Image or Video) */}
                      {editedMediaPreview && (
                        <div className="position-relative text-center">
                          {editedMediaPreview.endsWith(".mp4") ? (
                            <video
                              controls
                              className="w-100 rounded"
                              style={{ maxHeight: "250px" }}
                            >
                              <source
                                src={editedMediaPreview}
                                type="video/mp4"
                              />
                              Your browser does not support the video tag.
                            </video>
                          ) : (
                            <img
                              src={editedMediaPreview}
                              alt="Preview"
                              className="img-fluid rounded"
                              style={{ maxHeight: "250px", maxWidth: "100%" }}
                            />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="modal-footer">
                      <button
                        className="btn btn-secondary"
                        onClick={closeEditPopup}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={handleEditSubmit}
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Deleted Post Popup */}
            {isDeletePopupOpen && postToDelete && (
              <div
                className="modal fade show d-block"
                style={{ background: "rgba(0, 0, 0, 0.5)" }}
              >
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Confirm Deletion</h5>
                      <button
                        className="btn-close"
                        onClick={closeDeletePopup}
                      ></button>
                    </div>
                    <div className="modal-body text-center">
                      <p className="mb-3">
                        Are you sure you want to delete this post?
                      </p>

                      {/* Show Post Message */}
                      {postToDelete.message && (
                        <p className="fw-bold">{postToDelete.message}</p>
                      )}

                      {/* Show Media Preview (Image or Video) */}
                      {postToDelete.attachments &&
                        postToDelete.attachments.data.map(
                          (attachment, index) => (
                            <div key={index} className="mt-2">
                              {attachment.type === "image" ? (
                                <img
                                  src={attachment.media[0].url}
                                  alt="Post Image"
                                  className="img-fluid rounded"
                                  style={{
                                    maxHeight: "300px",
                                    maxWidth: "100%",
                                  }}
                                />
                              ) : attachment.type === "video" ? (
                                <video
                                  controls
                                  className="w-100 rounded"
                                  style={{ maxHeight: "300px" }}
                                >
                                  <source
                                    src={attachment.media[0].url}
                                    type="video/mp4"
                                  />
                                  Your browser does not support the video tag.
                                </video>
                              ) : null}
                            </div>
                          )
                        )}
                    </div>
                    <div className="modal-footer">
                      <button
                        className="btn btn-secondary"
                        onClick={closeDeletePopup}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={handleDeletePost}
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isCommentPopupOpen && selectedPost && (
              <div
                className="modal fade show d-block"
                style={{ background: "rgba(0, 0, 0, 0.5)" }}
              >
                <div className="modal-dialog modal-dialog-centered modal-md">
                  <div className="modal-content">
                    {/* Header */}
                    <div className="modal-header">
                      <h5 className="modal-title">Post & Comments</h5>
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
                        {/* User Info */}
                        <div className="d-flex align-items-center">
                          <img
                            src={
                              selectedPost.from?.profile_image ||
                              defaultUserImage
                            }
                            alt="User Avatar"
                            className="rounded-circle me-2"
                            style={{ width: "40px", height: "40px" }}
                          />
                          <div>
                            <h6 className="mb-0">
                              {selectedPost.from?.name || "Unknown User"}
                            </h6>
                            <small>{selectedPost.timeAgo}</small>
                          </div>
                        </div>

                        {/* Post Text */}
                        {selectedPost.message && (
                          <p className="mt-2">{selectedPost.message}</p>
                        )}

                        {/* Post Image or Video */}
                        {selectedPost.attachments &&
                          selectedPost.attachments.data.map(
                            (attachment, index) => {
                              if (attachment.type === "image") {
                                return (
                                  <img
                                    key={index}
                                    src={attachment.media[0].url}
                                    alt="Post image"
                                    className="img-fluid rounded w-100"
                                    style={{
                                      maxHeight: "120px",
                                      objectFit: "cover",
                                    }}
                                  />
                                );
                              }
                              if (attachment.type === "video") {
                                return (
                                  <video
                                    key={index}
                                    controls
                                    className="w-100 rounded"
                                    style={{
                                      maxHeight: "120px",
                                      objectFit: "contain",
                                      backgroundColor: "black",
                                    }}
                                  >
                                    <source
                                      src={attachment.media[0].url}
                                      type="video/mp4"
                                    />
                                    Your browser does not support the video tag.
                                  </video>
                                );
                              }
                              return null;
                            }
                          )}
                      </div>

                      {/* Divider */}
                      <hr />

                      {/* Scrollable Comments Section */}
                      <div
                        className="comments-section flex-grow-1 overflow-auto"
                        style={{ maxHeight: "40vh", paddingRight: "10px" }}
                      >
                        <h6>Comments</h6>

                        {/* If comments exist, show them */}
                        {comments?.length > 0 ? (
                          comments
                            .slice(0, visibleComments)
                            .map((comment, index) => (
                              <div
                                key={index}
                                className="d-flex align-items-start mb-3"
                              >
                                <img
                                  src={
                                    comment.comment_user_profile_picture ||
                                    defaultUserImage
                                  }
                                  alt="User Avatar"
                                  className="rounded-circle me-2"
                                  style={{ width: "35px", height: "35px" }}
                                />
                                <div>
                                  <h6 className="mb-0">
                                    {comment.comment_user_name || "Anonymous"}
                                  </h6>
                                  <p className="mb-1">
                                    {comment.comment_content}
                                  </p>
                                  <small className="text-muted">
                                    {getTimeAgo(
                                      comment.comment_updated_datetime
                                    )}
                                  </small>
                                   {/* Delete Button */}
                                  {comment.comment_user_id === userId && (
                                    <button
                                      className="btn btn-sm btn-danger mt-1"
                                      onClick={() => deleteComment(selectedPost.id, comment.id)}
                                    >
                                      Delete
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))
                        ) : (
                          // Mock Comments for Testing
                          <>
                            {/* <div className="d-flex align-items-start mb-3">
                              <img
                                src={defaultUserImage}
                                alt="User Avatar"
                                className="rounded-circle me-2"
                                style={{ width: "35px", height: "35px" }}
                              />
                              <div>
                                <h6 className="mb-0">John Doe</h6>
                                <p className="mb-1">This is a great post! 👍</p>
                                <small className="text-muted">
                                  2 hours ago
                                </small>
                              </div>
                            </div>

                            <div className="d-flex align-items-start mb-3">
                              <img
                                src={defaultUserImage}
                                alt="User Avatar"
                                className="rounded-circle me-2"
                                style={{ width: "35px", height: "35px" }}
                              />
                              <div>
                                <h6 className="mb-0">Jane Smith</h6>
                                <p className="mb-1">I totally agree! 🔥</p>
                                <small className="text-muted">1 hour ago</small>
                              </div>
                            </div>

                            <div className="d-flex align-items-start mb-3">
                              <img
                                src={defaultUserImage}
                                alt="User Avatar"
                                className="rounded-circle me-2"
                                style={{ width: "35px", height: "35px" }}
                              />
                              <div>
                                <h6 className="mb-0">Alex Johnson</h6>
                                <p className="mb-1">
                                  Awesome content, keep it up! 🚀
                                </p>
                                <small className="text-muted">
                                  30 mins ago
                                </small>
                              </div>
                            </div> */}
                            No comments
                          </>
                        )}
                      </div>

                      {/* Add a Comment */}
                      <div className="mt-3">
                        <textarea
                          className="form-control"
                          rows="2"
                          placeholder="Write a comment..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
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
          </div>
        </div>

        {/* Dynamically Render Posts */}
        <div className="text-white p-0 rounded">
          {data &&
            data.posts &&
            Array.isArray(data.posts) &&
            data.posts.map((post) => {
              const loggedInUserId = localStorage.getItem("user_Id"); // Get logged-in user ID
              const isOwner = loggedInUserId == post.from.user_id; // Check if the logged-in user is the post owner
              // console.log(post);

              return (
                <div
                  className="card mb-1"
                  key={post.id}
                  style={{
                    height:
                      post.attachments.data.length === 0 ? "auto" : "550px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Post Header */}
                  <div className="card-header d-flex align-items-center bg-white border-0 position-relative">
                    {/* Profile Image */}
                    <img
                      src={post.from?.profile_image || defaultUserImage} // Fallback to defaultUserImage
                      alt={`${post.from?.name || "Unknown User"}'s Avatar`} // Fallback to "Unknown User"
                      className="rounded-circle me-2"
                      style={{ width: "40px", height: "40px" }}
                    />

                    {/* Name & Timestamp */}
                    <div>
                      <h6 className="mb-0">
                        {post.from?.name || "Unknown User"}
                      </h6>
                      <small>{post.timeAgo}</small>
                    </div>

                    {/* Edit & Delete Buttons */}
                    {isOwner && (
                      <div
                        className="ms-auto d-flex align-items-center"
                        style={{
                          position: "absolute",
                          right: "15px",
                          top: "10px",
                          gap: "20px",
                        }}
                      >
                        <i
                          className="bi bi-pencil"
                          onClick={() => openEditPopup(post)}
                        ></i>
                        <i
                          className="bi bi-trash"
                          onClick={() => openDeletePopup(post)}
                        ></i>
                      </div>
                    )}
                  </div>

                  {/* Post Content */}
                  {post.message && <p className="px-3 mb-1">{post.message}</p>}
                  <div
                    className="card-body p-0 d-flex align-items-center justify-content-center"
                    style={{
                      // height: "300px",
                      overflow: "hidden",
                      backgroundColor: "#fff",
                    }}
                  >
                    {post.attachments &&
                      post.attachments.data.map((attachment, index) => {
                        // console.log(attachment);

                        if (attachment.type === "image") {
                          return (
                            <img
                              key={index}
                              src={attachment.media[0].url}
                              alt={attachment.media[0].alt_text || "Post image"}
                              className="img-fluid"
                              style={{
                                objectFit: "contain",
                                maxHeight: "100%",
                                // maxWidth: "100%",
                              }}
                            />
                          );
                        }
                        if (attachment.type === "video") {
                          return (
                            <video
                              key={index}
                              controls
                              className="w-100"
                              style={{
                                maxWidth: "100%",
                                height: "100%",
                                objectFit: "contain",
                                backgroundColor: "black",
                              }}
                            >
                              <source
                                src={attachment.media[0].url}
                                type="video/mp4"
                              />
                              Your browser does not support the video tag.
                            </video>
                          );
                        }
                        return null;
                      })}
                  </div>

                  {/* Post Footer */}
                  <div className="card-footer bg-white d-flex justify-content-between align-items-center border-0">
                    <span className="text-muted">
                      {post.likes && post.likes.count !== undefined
                        ? `${post.likes.count} likes`
                        : "0 likes"}
                    </span>

                    <div className="d-flex">
                      <button
                        className={`btn btn-sm me-2 ${
                          post.likes?.liked_users?.some(
                            (user) => user.user_id == loggedInUserId
                          )
                            ? "btn-primary text-white"
                            : "btn-light"
                        }`}
                        onClick={() => handleLikeClick(post.id)}
                      >
                        <ThumbUpIcon
                          sx={{
                            fontSize: 18,
                            marginRight: "5px",
                            color: post.likes?.liked_users?.some(
                              (user) => user.user_id == loggedInUserId
                            )
                              ? "white"
                              : "inherit",
                          }}
                        />
                        Like
                      </button>

                      <button
                        className={`btn btn-sm me-2 ${
                          post.disliked_users?.some(
                            (user) => user.user_id === loggedInUserId
                          )
                            ? "btn-danger text-white"
                            : "btn-light"
                        }`}
                        onClick={() => handleDislikeClick(post.id)}
                      >
                        <ThumbDownIcon
                          sx={{
                            fontSize: 18,
                            marginRight: "5px",
                            color: post.disliked_users?.some(
                              (user) => user.user_id === loggedInUserId
                            )
                              ? "white"
                              : "inherit",
                          }}
                        />
                        Dislike
                      </button>

                      <button
                        className="btn btn-light btn-sm me-2"
                        onClick={() => openCommentPopup(post)}
                      >
                        <CommentIcon
                          sx={{ fontSize: 18, marginRight: "5px" }}
                        />{" "}
                        Comment{" "}
                        <span className="text-muted">
                          {post.comments?.count}
                        </span>
                      </button>

                      <button className="btn btn-light btn-sm">
                        <ShareIcon sx={{ fontSize: 18, marginRight: "5px" }} />{" "}
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Feed;
