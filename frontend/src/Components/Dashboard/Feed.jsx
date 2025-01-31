import React, { useEffect, useState } from "react";
import defaultUserImage from "../../assets/images/vector-users-icon.jpg";
import userImage from "../../assets/images/vector-users-icon.jpg";
import axios from "axios";
import { Navigate } from "react-router-dom";

const Feed = ({ countryCode, flag, countryName, handleCountryChange }) => {
  const [navbarHeight, setNavbarHeight] = useState(56);
  const [likedPosts, setLikedPosts] = useState([]);
  const [dislikedPosts, setDislikedPosts] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [data, setData] = useState({ posts: [] });
  const [message, setMessage] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [userName, setUserName] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);

  // Functions to handle popup visibility
  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

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

  const userData = async () => {
    const token = localStorage.getItem("api_token");
    if (!token) {
      return;
    }
    try {
      const res = await axios.get(
        "https://develop.quakbox.com/admin/api/user",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserName(res.data.users);
      setCurrentUserId(res.data.users.id);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("api_token");

    const formData = new FormData();
    formData.append("message", message);
    formData.append("country_code", countryCode);
    if (mediaFile) {
      formData.append("media", mediaFile);
    }

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
            name: userName.username,
            profile_image: userImage,
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

        setData((prevData) => ({
          ...prevData,
          posts: [newPost, ...prevData.posts],
        }));

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

  // Handle Like Click
  const handleLikeClick = async (postId) => {
    const token = localStorage.getItem("api_token");

    const currentUser = {
      id: currentUserId,
      name: userName.username || "Unknown User",
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
                    },
                    liked_users: [...(post.liked_users || []), currentUser],
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
  // handleDislikeClick
  ///////////////////////////
  // Helper function to revert the like action
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
                    },
                    liked_users: (post.liked_users || []).filter(
                      (user) => user.id !== currentUserId
                    ),
                  }
                : post
            ),
          }
        : prevData
    );
  };

  // Handle dislike Click

  const handleDislikeClick = (postId) => {
    if (dislikedPosts.includes(postId)) {
      // Remove from dislikedPosts if already disliked
      setDislikedPosts(dislikedPosts.filter((id) => id !== postId));
    } else {
      // Add to dislikedPosts
      setDislikedPosts([...dislikedPosts, postId]);

      // Optional: Remove from likedPosts if it's there
      if (likedPosts.includes(postId)) {
        setLikedPosts(likedPosts.filter((id) => id !== postId));
      }
    }
  };

  const getPost = async () => {
    const token = localStorage.getItem("api_token");

    if (!token) {
      console.log("No token found, user may not be logged in.");
      return;
    }
    try {
      const res = await axios.get(
        `https://develop.quakbox.com/admin/api/get_posts/${countryCode}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            ContentType: "contentType",
          },
        }
      );
      setData(res.data);
    } catch (error) {
      console.log(error);
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
    userData();
    getPost();
    const updateNavbarHeight = () => {
      setNavbarHeight(window.innerWidth <= 768 ? 90 : 56);
    };

    updateNavbarHeight();
    window.addEventListener("resize", updateNavbarHeight);

    return () => {
      window.removeEventListener("resize", updateNavbarHeight);
    };
  }, [countryCode]);

  return (
    <div
      className="col-12 col-md-6 offset-md-3 p-0"
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
              src={userImage}
              alt="Profile"
              className="rounded-circle"
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
                          src={userImage || defaultUserImage} // Use userImage or a default image
                          alt="User Avatar"
                          className="rounded-circle me-2"
                          style={{ width: "40px", height: "40px" }}
                        />
                        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                          {userName.username}
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
          </div>
        </div>

        {/* Dynamically Render Posts */}
        <div className="text-white p-0 rounded">
          {data &&
            data.posts &&
            Array.isArray(data.posts) &&
            data.posts.map((post) => (
              <div className="card mb-1" key={post.id}>
                {" "}
                {/* Add key here */}
                {/* Post Header */}
                <div className="card-header d-flex align-items-center bg-white border-0">
                  <img
                    src={post.from?.profile_image || defaultUserImage} // Fallback to defaultUserImage
                    alt={`${post.from?.name || "Unknown User"}'s Avatar`} // Fallback to "Unknown User"
                    className="rounded-circle me-2"
                    style={{ width: "40px", height: "40px" }}
                  />
                  <div>
                    <h6 className="mb-0">
                      {post.from?.name || "Unknown User"}
                    </h6>
                    {/* Fallback to "Unknown User" */}
                    <small className="text-muted">
                      {new Date(post.created_time).toLocaleString()}
                    </small>
                  </div>
                </div>
                {/* Post Content */}
                <div className="card-body p-0 w-100">
                  {post.message && <p className="px-3">{post.message}</p>}

                  {post.attachments &&
                    post.attachments.data.map((attachment, index) => {
                      if (attachment.type === "image") {
                        return (
                          <img
                            key={index} // This key is for attachments; index is fine for these
                            src={attachment.media[0].url}
                            alt={attachment.media[0].alt_text || "Post image"}
                            className="img-fluid"
                            style={{
                              objectFit: "contain",
                              backgroundColor: "white",
                              display: "block",
                              margin: "auto",
                              maxHeight: "70vh", // Restricts the image to 80% of the viewport height
                              maxWidth: "100%", // Ensures it doesn't exceed the container width
                            }}
                          />
                        );
                      }
                      if (attachment.type === "video") {
                        return (
                          <video
                            key={index} // This key is for attachments, index is fine for these
                            controls
                            className="w-100"
                            style={{
                              maxWidth: "2133px",
                              maxHeight: "362.5px",
                              objectFit: "contain",
                              backgroundColor: "black",
                              display: "block",
                              margin: "auto",
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
                        post.liked_users?.some(
                          (user) => user.id === currentUserId
                        )
                          ? "btn-primary text-white"
                          : "btn-light"
                      }`}
                      onClick={() => handleLikeClick(post.id)}
                    >
                      <i
                        className={`bi ${
                          post.liked_users?.some(
                            (user) => user.id === currentUserId
                          )
                            ? "bi-hand-thumbs-up-fill"
                            : "bi-hand-thumbs-up"
                        }`}
                      ></i>{" "}
                      Like
                    </button>
                    {/* Dislike Button */}
                    <button
                      className={`btn btn-sm me-2 ${
                        post.disliked_users?.some(
                          (user) => user.id === currentUserId
                        )
                          ? "btn-danger text-white"
                          : "btn-light"
                      }`}
                      onClick={() => handleDislikeClick(post.id)}
                    >
                      <i
                        className={`bi ${
                          post.disliked_users?.some(
                            (user) => user.id === currentUserId
                          )
                            ? "bi-hand-thumbs-down-fill"
                            : "bi-hand-thumbs-down"
                        }`}
                      ></i>{" "}
                      Dislike
                    </button>
                    <button className="btn btn-light btn-sm me-2">
                      <i className="bi bi-chat"></i> Comment{" "}
                      <span className="text-muted">
                        {post.comments && post.comments.count}
                      </span>
                    </button>
                    <button className="btn btn-light btn-sm">
                      <i className="bi bi-share"></i> Share
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Feed;
