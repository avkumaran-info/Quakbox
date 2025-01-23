import React, { useEffect, useState } from "react";
import defaultUserImage from "../../assets/images/vector-users-icon.jpg";
import userImage from "../../assets/images/vector-users-icon.jpg";
import axios from "axios";
import { Navigate } from "react-router-dom";

const Feed = () => {
  const [navbarHeight, setNavbarHeight] = useState(52);
  const [likedPosts, setLikedPosts] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [data, setData] = useState({ posts: [] });
  const [message, setMessage] = useState("");
  const [countryCode, setCountryCode] = useState("in");
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [userName, setUserName] = useState("");

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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(res.data);
      // console.log("User Data found:", res.data.users);
      setUserName(res.data.users);
      // console.log(userName);
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
        // Add the new post to the feed
        const newPost = {
          id: response.data.id, // Use the post ID returned from the server
          message: message,
          created_time: new Date().toISOString(),
          from: {
            name: userName.username,
            profile_image: userImage, // Use the current user's image
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
                        url: mediaPreview, // Use the preview URL for now
                        alt_text: "Uploaded media",
                      },
                    ],
                  },
                ],
              }
            : null,
          likes: { count: 0 },
          comments: { count: 0 },
        };
  
        setData((prevData) => ({
          ...prevData,
          posts: [newPost, ...prevData.posts],
        }));
  
        // Clear inputs and close the popup
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

    try {
      const res = await axios.post(
        `https://develop.quakbox.com/admin/api/set_posts_like/${postId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 200) {
        // Update like count and set post as liked
        setData((prevData) =>
          Array.isArray(prevData) // Ensure prevData is an array before mapping
            ? prevData.map((post) =>
                post.id === postId
                  ? {
                      ...post,
                      likes: {
                        count: (post.likes?.count || 0) + 1,
                      },
                    }
                  : post
              )
            : prevData
        );
        setLikedPosts((prevLikedPosts) => [...prevLikedPosts, postId]); // Mark as liked
      }
    } catch (error) {
      console.error("Error liking the post:", error);
    }
  };

  const getPost = async () => {
    const token = localStorage.getItem("api_token");
    // console.log(token);

    if (!token) {
      console.log("No token found, user may not be logged in.");
      return;
    }
    try {
      const res = await axios.get(
        "https://develop.quakbox.com/admin/api/get_posts/in",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            ContentType: "contentType",
          },
        }
      );
      // console.log(res.data.posts);
      setData(res.data);
      // console.log(res.data.posts[0].attachments.data[0].media[0].url);

      // console.log(jsonData);

      // console.log(data);
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

  // const jsonData = {
  //   posts: [
  //     {
  //       id: "1",
  //       created_time: "2025-01-17T10:30:00+0000",
  //       message: "Check out this amazing view from my vacation! 🌴☀️",
  //       from: {
  //         name: "John Doe",
  //         profile_image:
  //           "https://media.istockphoto.com/id/1437816897/photo/business-woman-manager-or-human-resources-portrait-for-career-success-company-we-are-hiring.jpg?s=612x612&w=0&k=20&c=tyLvtzutRh22j9GqSGI33Z4HpIwv9vL_MZw_xOE19NQ=",
  //       },
  //       attachments: {
  //         data: [
  //           {
  //             type: "photo",
  //             media: [
  //               {
  //                 url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReE4_46HUmsn2e1Ey-lckv36GLUlaKsx-XpQ&s",
  //                 alt_text: "Vacation view",
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //       likes: { count: 350 },
  //       comments: { count: 25 },
  //     },
  //     {
  //       id: "2",
  //       created_time: "2025-01-16T15:00:00+0000",
  //       message: "Check out this video I recorded! 📹",
  //       from: {
  //         name: "Jane Smith",
  //         profile_image:
  //           "https://media.istockphoto.com/id/1682296067/photo/happy-studio-portrait-or-professional-man-real-estate-agent-or-asian-businessman-smile-for.jpg?s=612x612&w=0&k=20&c=9zbG2-9fl741fbTWw5fNgcEEe4ll-JegrGlQQ6m54rg=",
  //       },
  //       attachments: {
  //         data: [
  //           {
  //             type: "video",
  //             media: [
  //               {
  //                 url: "https://www.youtube.com/watch?v=yj0njH4K4ZU",
  //                 alt_text: "YouTube video",
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //       likes: { count: 150 },
  //       comments: { count: 12 },
  //     },
  //     {
  //       id: "3",
  //       created_time: "2025-01-15T08:00:00+0000",
  //       message: "Check out this interesting article!",
  //       from: { name: "Emily White", profile_image: null },
  //       attachments: {
  //         data: [
  //           {
  //             type: "link",
  //             url: "https://example.com/article",
  //             title: "An Interesting Article",
  //             description: "Learn more about the latest trends in tech.",
  //           },
  //         ],
  //       },
  //       likes: { count: 200 },
  //       comments: { count: 35 },
  //     },
  //   ],
  // };

  useEffect(() => {
    userData();
    getPost();
    const updateNavbarHeight = () => {
      setNavbarHeight(window.innerWidth <= 768 ? 90 : 48);
    };

    updateNavbarHeight();
    window.addEventListener("resize", updateNavbarHeight);

    return () => {
      window.removeEventListener("resize", updateNavbarHeight);
    };
  }, []);

  return (
    <div
      className="col-12 col-md-6 offset-md-3 p-2"
      style={{
        marginTop: `${navbarHeight}px`,
        marginBottom: "60px",
      }}
    >
      <div className="text-white p-0 rounded">
        {/* Post Input Section */}
        <div className="card p-3 mb-4">
          <div className="d-flex align-items-center">
            <img
              src={userImage}
              alt="Profile"
              className="rounded-circle me-2"
              style={{ width: "40px", height: "40px" }}
            />
            <input
              type="text"
              className="form-control"
              placeholder="What's on your mind?"
              onClick={openPopup}
              style={{ fontSize: "16px",
                 cursor: "pointer"
               }}
            />
          </div>
          <div className="d-flex justify-content-between flex-wrap mt-3">
            <button className="btn btn-light d-flex align-items-center flex-grow-1 m-1">
              <i className="fa fa-video me-2 text-danger"></i> Live video
            </button>

            {/* Button to trigger the popup */}

            <button
              className="btn btn-light d-flex align-items-center flex-grow-1 m-1"
              onClick={openPopup}
            >
              <i className="fa fa-image me-2 text-success"></i> Photo/video
            </button>

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
              <div className="card mb-4" key={post.id}>
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
                    </h6>{" "}
                    {/* Fallback to "Unknown User" */}
                    <small className="text-muted">
                      {new Date(post.created_time).toLocaleString()}
                    </small>
                  </div>
                </div>

                {/* Post Content */}
                <div className="card-body p-0">
                  {post.message && <p className="p-3">{post.message}</p>}

                  {post.attachments &&
                    post.attachments.data.map((attachment, index) => {
                      if (attachment.type === "image") {
                        return (
                          <>
                            <img
                              key={index}
                              src={attachment.media[0].url}
                              alt={attachment.media[0].alt_text || "Post image"}
                              className="img-fluid w-100"
                            />
                          </>
                        );
                      }
                      if (attachment.type === "video") {
                        return (
                          <video
                            key={index}
                            controls
                            className="w-100"
                            style={{ maxHeight: "400px" }}
                          >
                            <source
                              src={attachment.media[0].url}
                              type="video/mp4"
                            />
                            Your browser does not support the video tag.
                          </video>
                        );
                      }
                      if (attachment.type === "link") {
                        return (
                          <div key={index} className="p-3">
                            <a
                              href={attachment.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-decoration-none"
                            >
                              <div className="border p-2 rounded">
                                <h6>{attachment.title}</h6>
                                <p className="text-muted">
                                  {attachment.description}
                                </p>
                              </div>
                            </a>
                          </div>
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
                        likedPosts.includes(post.id)
                          ? "btn-primary text-white"
                          : "btn-light"
                      }`}
                      onClick={() => handleLikeClick(post.id)}
                    >
                      <i
                        className={`bi ${
                          likedPosts.includes(post.id)
                            ? "bi-hand-thumbs-up-fill"
                            : "bi-hand-thumbs-up"
                        }`}
                      ></i>{" "}
                      Like
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
