import React, { useState } from "react";
import NavBar from "../Dashboard/NavBar";
import QSidebar from "./QSidebar";
import { useNavigate } from "react-router-dom";

const AddVideo = () => {
  // Initialize the sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => {
    setIsPopupOpen(false);
    setThumbnailPreview(null); // Clear preview on close
    setThumbnailFile(null);
  };

  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file)); // Generate preview
    }
  };

  const HandleCancleClick = () => {
    navigate("/upload");
  };

  const link =
    "https://create.microsoft.com/_next/image?url=https%3A%2F%2Fcdn.create.microsoft.com%2Fcmsassets%2FyoutubeBanner-Hero.webp&w=1920&q=75";

  const cards = [
    {
      id: 1,
      image: link,
      title: "Card 1",
      description: "This is the first card description.",
    },
    {
      id: 2,
      image: link,
      title: "Card 2",
      description: "This is the second card description.",
    },
    {
      id: 3,
      image: link,
      title: "Card 3",
      description: "This is the third card description.",
    },
    {
      id: 4,
      image: link,
      title: "Card 4",
      description: "This is the third card description.",
    },
  ];

  const categories = [
    "Popping on Quakbox",
    "Tune",
    "Sports",
    "Silver Screen",
    "TeleVision",
    "Knowledge Base",
    "Actors",
    "Comedy",
    "Cooking",
    "Documentary",
    "Greetings",
    "Interviews",
    "News & Info",
    "Religious",
    "Speeches",
    "Talk Shows",
    "Education",
    "Travel",
  ];

  // Toggle the sidebar open/close state
  const toggleSidebar = () => {
    setSidebarOpen((prevState) => !prevState);
  };
  return (
    <>
      <NavBar />
      <div
        style={{
          marginTop: "56px",
          flex: 1,
          transition: "margin 0.3s",
          marginRight: sidebarOpen ? "250px" : "60px", // Adjust margin when sidebar is toggled
        }}
      >
        <div className="mt-4 p-1">
          <h4>Upload Details</h4>
          <div className="card p-3">
            <div className="d-flex align-items-center mb-1">
              <div
                className="bg-secondary"
                style={{ width: "120px", height: "80px" }}
              ></div>
              <div className="ms-3">
                <strong>
                  Contrary to popular belief, Lorem Ipsum (2020) is not.
                </strong>
                <div className="text-muted">102.6 MB · 2:13 MIN Remaining</div>
                <div className="progress mt-1">
                  <div className="progress-bar" style={{ width: "50%" }}></div>
                </div>
              </div>
            </div>

            <div className="mb-1">
              <label className="form-label mb-1">Video Title</label>
              <input
                type="text"
                className="form-control"
                value="Contrary to popular belief, Lorem Ipsum (2020) is not."
                readOnly
              />
            </div>

            <div className="mb-1">
              <label className="form-label mb-1">About</label>
              <textarea
                className="form-control"
                placeholder="Description"
              ></textarea>
            </div>

            <div className="row">
              {/* <div className="col-md-3">
                  <label className="form-label">Orientation</label>
                  <select className="form-select">
                    <option>Straight</option>
                  </select>
                </div> */}
              <div className="col-md-3">
                <label className="form-label">Privacy Settings</label>
                <select className="form-select">
                  <option>Public</option>
                  <option>Private</option>
                </select>
              </div>
              {/* <div className="col-md-3">
                <label className="form-label">Monetize</label>
                <select className="form-select">
                  <option>Yes</option>
                </select>
              </div> */}
              {/* <div className="col-md-3">
                <label className="form-label">License</label>
                <select className="form-select">
                  <option>Standard</option>
                </select>
              </div> */}
              <div className="col-md-6">
                <label className="form-label">Tags (13 Tags Remaining)</label>
                <input
                  type="text"
                  className="form-control"
                  // value="Gaming, PS4"
                  readOnly
                />
              </div>
            </div>

            {/* <div className="mt-3">
              <label className="form-label">Tags (13 Tags Remaining)</label>
              <input
                type="text"
                className="form-control"
                value="Gaming, PS4"
                readOnly
              />
            </div> */}

            {/* <div className="mt-3">
              <label className="form-label">Cast (Optional)</label>
              <input
                type="text"
                className="form-control"
                value="Nathan Drake"
                readOnly
              />
            </div> */}

            {/* <div className="mt-3">
              <label className="form-label">Language in Video (Optional)</label>
              <select className="form-select">
                <option>English</option>
              </select>
            </div> */}

            <div className="mt-4">
              <h6>Category</h6>
              <div className="row mb-3">
                {categories.map((category, index) => (
                  <div key={index} className="col-md-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="category" // Use the same name to allow only one selection
                        id={category}
                        value={category}
                        checked={selectedCategory === category}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      />
                      <label className="form-check-label" htmlFor={category}>
                        {category}
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-1">
                <h6> Thumbnail</h6>
                <div className="row g-4">
                  {/* Bootstrap grid with spacing */}
                  {cards.map((card) => (
                    <div key={card.id} className="col-md-3">
                      {" "}
                      {/* 4 cards in a row */}
                      <div className="card">
                        <img
                          src={card.image}
                          className="card-img-top"
                          alt={card.title}
                          style={{
                            width: "100%",
                            height: "150px", // Adjust the height based on your preference
                            objectFit: "cover", // Ensures image covers the space without stretching
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Button Below Cards */}
                <div className="text-center mt-2 mb-3">
                  <button
                    className="btn btn-outline-secondary  btn-lg"
                    onClick={openPopup}
                  >
                    Coustom Thumbnail
                  </button>
                </div>
              </div>

              {isPopupOpen && (
                <div
                  className="modal fade show d-block"
                  style={{
                    background: "rgba(0, 0, 0, 0.8)",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  tabIndex="-1"
                >
                  <div
                    className="modal-dialog modal-dialog-centered"
                    style={{
                      maxWidth: "500px",
                      height:"150px",
                      background: "#222",
                      borderRadius: "10px",
                      color: "#fff",
                    }}
                  >
                    <div
                      className="modal-content"
                      style={{ background: "#222", border: "none" }}
                    >
                      <div
                        className="modal-header"
                        style={{ borderBottom: "none" }}
                      >
                        <h5
                          className="modal-title"
                          style={{ fontWeight: "bold" }}
                        >
                          Upload Custom Thumbnail
                        </h5>
                        <button
                          type="button"
                          className="btn-close"
                          onClick={closePopup}
                          style={{ filter: "invert(1)" }} // White close button
                        ></button>
                      </div>

                      <div className="modal-body text-center">
                        {/* Thumbnail Upload Box */}
                        <div
                          className="rounded p-4"
                          style={{
                            border: "2px dashed #ccc",
                            background: "#333",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            document.getElementById("thumbnailInput").click()
                          }
                        >
                          {!thumbnailPreview ? (
                            <div className="d-flex flex-column align-items-center">
                              <i className="fas fa-upload fs-1 mb-2"></i>
                              <p>Drag and drop or click to upload</p>
                            </div>
                          ) : (
                            <div className="position-relative">
                              <img
                                src={thumbnailPreview}
                                alt="Thumbnail Preview"
                                className="img-fluid rounded"
                                style={{ maxHeight: "250px" }}
                              />
                              {/* Remove thumbnail button */}
                              <button
                                className="btn btn-close position-absolute top-0 end-0"
                                style={{
                                  backgroundColor: "white",
                                  borderRadius: "50%",
                                  padding: "5px",
                                }}
                                onClick={() => {
                                  setThumbnailPreview(null);
                                  setThumbnailFile(null);
                                }}
                              ></button>
                            </div>
                          )}
                        </div>

                        {/* Hidden file input */}
                        <input
                          id="thumbnailInput"
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={handleThumbnailChange}
                        />
                      </div>

                      <div
                        className="modal-footer justify-content-between"
                        style={{ borderTop: "none" }}
                      >
                        <button
                          type="button"
                          className="btn btn-outline-light"
                          onClick={closePopup}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary"
                          disabled={!thumbnailFile}
                        >
                          Upload
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="row mb-3 d-flex justify-content-center">
                <div className="col-md-4 d-flex justify-content-between">
                  <button
                    className="btn btn-outline-danger btn-lg w-50 me-2"
                    onClick={HandleCancleClick}
                  >
                    Cancel
                  </button>
                  <button className="btn btn-outline-primary btn-lg w-50 ms-2">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Pass the isOpen prop and toggleSidebar to QSidebar */}
        <QSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      </div>
    </>
  );
};

export default AddVideo;
