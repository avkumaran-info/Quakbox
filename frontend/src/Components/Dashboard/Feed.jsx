import React, { useEffect, useState } from "react";
import defaultUserImage from "../../assets/images/vector-users-icon.jpg";
import userImage from "../../assets/images/vector-users-icon.jpg";

const Feed = () => {
  const [navbarHeight, setNavbarHeight] = useState(52);

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Functions to handle popup visibility
  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  const jsonData = {
    posts: [
      {
        id: "1",
        created_time: "2025-01-17T10:30:00+0000",
        message: "Check out this amazing view from my vacation! 🌴☀️",
        from: {
          name: "John Doe",
          profile_image:
            "https://media.istockphoto.com/id/1437816897/photo/business-woman-manager-or-human-resources-portrait-for-career-success-company-we-are-hiring.jpg?s=612x612&w=0&k=20&c=tyLvtzutRh22j9GqSGI33Z4HpIwv9vL_MZw_xOE19NQ=",
        },
        attachments: {
          data: [
            {
              type: "photo",
              media: [
                {
                  url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReE4_46HUmsn2e1Ey-lckv36GLUlaKsx-XpQ&s",
                  alt_text: "Vacation view",
                },
              ],
            },
          ],
        },
        likes: { count: 350 },
        comments: { count: 25 },
      },
      {
        id: "2",
        created_time: "2025-01-16T15:00:00+0000",
        message: "Check out this video I recorded! 📹",
        from: {
          name: "Jane Smith",
          profile_image:
            "https://media.istockphoto.com/id/1682296067/photo/happy-studio-portrait-or-professional-man-real-estate-agent-or-asian-businessman-smile-for.jpg?s=612x612&w=0&k=20&c=9zbG2-9fl741fbTWw5fNgcEEe4ll-JegrGlQQ6m54rg=",
        },
        attachments: {
          data: [
            {
              type: "video",
              media: [
                {
                  url: "https://www.youtube.com/watch?v=yj0njH4K4ZU",
                  alt_text: "YouTube video",
                },
              ],
            },
          ],
        },
        likes: { count: 150 },
        comments: { count: 12 },
      },
      {
        id: "3",
        created_time: "2025-01-15T08:00:00+0000",
        message: "Check out this interesting article!",
        from: { name: "Emily White", profile_image: null },
        attachments: {
          data: [
            {
              type: "link",
              url: "https://example.com/article",
              title: "An Interesting Article",
              description: "Learn more about the latest trends in tech.",
            },
          ],
        },
        likes: { count: 200 },
        comments: { count: 35 },
      },
    ],
  };

  useEffect(() => {
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
              style={{ fontSize: "16px" }}
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
                    {/* Header */}
                    <div className="modal-header">
                      <h5 className="modal-title">Create Post</h5>
                      <button
                        type="button"
                        className="btn-close"
                        aria-label="Close"
                        onClick={closePopup}
                      ></button>
                    </div>

                    {/* Body */}
                    <div className="modal-body">
                      <div className="d-flex align-items-center mb-3">
                        {/* User Profile */}
                        <img
                          src={userImage}
                          alt="User"
                          className="rounded-circle me-2"
                          style={{width:"40px"}}
                        />
                        <div>
                          <h6 className="mb-0">John Doe</h6>
                          <select className="form-select form-select-sm w-auto">
                            <option value="friends">Friends</option>
                            <option value="public">Public</option>
                            <option value="private">Only Me</option>
                          </select>
                        </div>
                      </div>

                      {/* Input for Post */}
                      <textarea
                        className="form-control"
                        rows="4"
                        placeholder="What's on your mind?"
                        style={{ resize: "none" }}
                      ></textarea>

                      {/* Add Photos/Videos Section */}
                      <div className="border rounded mt-3 p-3 text-center">
                        <div className="d-flex align-items-center justify-content-center">
                          <i className="fas fa-photo-video fs-2 me-2"></i>
                          <span>Add photos/videos</span>
                        </div>
                        <p className="small text-muted">or drag and drop</p>
                        <button className="btn btn-outline-secondary btn-sm">
                          Add
                        </button>
                      </div>

                      {/* Additional Options */}
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <div>
                          <button className="btn btn-outline-secondary me-2">
                            <i className="fas fa-images"></i>
                          </button>
                          <button className="btn btn-outline-secondary me-2">
                            <i className="fas fa-smile"></i>
                          </button>
                          <button className="btn btn-outline-secondary">
                            <i className="fas fa-gift"></i>
                          </button>
                        </div>
                        <button className="btn btn-outline-secondary btn-sm">
                          GIF
                        </button>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="modal-footer">
                      <button type="button" className="btn btn-primary w-100">
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
          {jsonData.posts.map((post) => (
            <div className="card mb-4" key={post.id}>
              {/* Post Header */}
              <div className="card-header d-flex align-items-center bg-white border-0">
                <img
                  src={post.from.profile_image || defaultUserImage}
                  alt={`${post.from.name}'s Avatar`}
                  className="rounded-circle me-2"
                  style={{ width: "40px", height: "40px" }}
                />
                <div>
                  <h6 className="mb-0">{post.from.name}</h6>
                  <small className="text-muted">
                    {new Date(post.created_time).toLocaleString()} · 🌎
                  </small>
                </div>
              </div>

              {/* Post Content */}
              <div className="card-body p-0">
                {post.message && <p className="p-3">{post.message}</p>}

                {post.attachments &&
                  post.attachments.data.map((attachment, index) => {
                    if (attachment.type === "photo") {
                      return (
                        <img
                          key={index}
                          src={attachment.media[0].url}
                          alt={attachment.media[0].alt_text}
                          className="img-fluid w-100"
                        />
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
                <span className="text-muted">{post.likes.count} likes</span>
                <div className="d-flex">
                  <button className="btn btn-light btn-sm me-2">
                    <i className="bi bi-hand-thumbs-up"></i> Like
                  </button>
                  <button className="btn btn-light btn-sm me-2">
                    <i className="bi bi-chat"></i> Comment{" "}
                    <span className="text-muted">{post.comments.count} </span>
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
