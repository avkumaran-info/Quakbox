import React, { useState, useEffect, useRef } from "react"; // Add useEffect import
import NavBar from "../Dashboard/NavBar";
import QSidebar from "./QSidebar";
import { useNavigate,useLocation } from "react-router-dom";
import axios from "axios";
import loading2 from "../../assets/images/loading.gif";
import { overlayStyle, gifStyle } from "./UploadVideo";
import Select from "react-select";


const AddVideo = () => {
  // Initialize the sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();
  const [videoType, setVideoType] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [titleSize, setTitleSize] = useState("text-base"); // Default font size
  const [titleColor, setTitleColor] = useState("#000000"); // Default color
  const [titleText, setTitleText] = useState("");
  const [tags, setTags] = useState("");
  const [progress, setProgress] = useState(0);
  const location = useLocation();
  const [search, setSearch] = useState(""); // State for search input

  const { videoData } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [thumbnails, setThumbnails] = useState([]);
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const [customThumbnail, setCustomThumbnail] = useState(null);
  const fileInputRef = useRef(null);
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [file, setFile] = useState(null);
    const [description, setDescription] = useState('');

    const [type, setType] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const [message, setMessage] = useState('');

   // Validation states
   const [titleError, setTitleError] = useState(false);
   const [descError, setDescError] = useState(false);
   const [typeError, setTypeError] = useState(false);
   const [countryError, setCountryError] = useState(false);   
   const [thumbnailError, setThumbnailError] = useState(false);   
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };
    useEffect(() => {
      console.log("Updated Title Color:", titleColor);
    }, [titleColor]);

    const handleThumbnailChange = (event) => {
        setThumbnail(event.target.files[0]);
    };
    const tagsArray = tags.split(',').map(tag => tag.trim()); // Convert tags string to an array

    const handleSaveChanges = async () => {
        let isValid = true;
    
        // Title validation
        if (!titleText.trim()) {
            setTitleError(true);
            isValid = false;
        } else {
            setTitleError(false);
        }
      
        // Description validation
        if (!description.trim()) {
            setDescError(true);
            isValid = false;
        } else {
            setDescError(false);
        }
    
        // Privacy type validation
        if (!type || type === "Select") {
            setTypeError(true);
            isValid = false;
        } else {
            setTypeError(false);
        }
    
        // Country selection validation
        if (!selectedCountryCode) {
            setCountryError(true);
            isValid = false;
        } else {
            setCountryError(false);
        }
        if (!selectedThumbnail) {
          setThumbnailError(true);
          isValid = false;
        } else {
          setThumbnailError(false);
        }
        // Stop execution if validation fails
        if (!isValid) {
            return;
        }
    
        // Ensure fileType is valid
        const fileType = videoData?.fileType || ""; 
        const videoType = fileType ? fileType.toLowerCase() : "unknown"; 
    
        // Convert fileType to a number
        const videoTypeMapping = {
            "mp4": 1, "mkv": 1, "avi": 1, "mov": 1,  // Video
            "mp3": 2, "wav": 2, "m4a": 2,            // Audio
            "jpeg": 3, "png": 3, "jpg": 3, "gif": 3, // Photo
        };
    
        const videoTypeNumber = videoTypeMapping[videoType] || 4; // Default to 4 (Webcam)
    
        const payload = {
            file_path: videoData.filePath,
            title: titleText,
            description: description,
            category_id: selectedCategory,
            type: type,
            video_type: videoTypeNumber, // Ensure it is a number
            country_code: selectedCountryCode,
            title_colour: titleColor,
            title_size: titleSize,
            defaultthumbnail: selectedThumbnail,
            tags: tagsArray.join(","), // ✅ Convert array to a string
            temp_upload: false,
        };
    
        try {
            setLoading(true);
            const token = localStorage.getItem("api_token");
    
            if (!token) {
                setError("Authorization token not found. Please log in.");
                return;
            }
    
            const response = await axios.post(
                "https://develop.quakbox.com/admin/api/videos/upload",
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            if (response.data.result) {
                setMessage("✅ Video uploaded successfully!");
            } else {
                setMessage(response.data.message || "❌ Error uploading video");
            }
            
        } catch (error) {
            console.error("Error:", error);
            setMessage("❌ Error uploading video");
        } finally {
            setLoading(false);
        }
    };    

  useEffect(() => {
    if (videoData?.thumbnails) {
      setThumbnails(videoData.thumbnails); // Set generated thumbnails from the backend
    }
  }, [videoData]);

  // Function to handle thumbnail selection
  const handleThumbnailClick = (thumbnail) => {
    setSelectedThumbnail(thumbnail);
    setCustomThumbnail(null); // Remove custom thumbnail selection
  };

  // Function to handle custom thumbnail upload
  const handleCustomThumbnailUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCustomThumbnail(imageUrl);
      setSelectedThumbnail(imageUrl); // Set the uploaded thumbnail as the selected one
    }
  };
  

  const openFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Programmatically click the file input
    }
  };
  // Simulate progress update (you can replace this with actual upload logic)
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 1;
      });
    }, 100); // Increment every 100ms for demonstration

    return () => clearInterval(interval);
  }, []);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => {
    setIsPopupOpen(false);
    setThumbnailPreview(null); // Clear preview on close
    setThumbnailFile(null);
  };


  const HandleCancleClick = () => {
    navigate("/upload");
  };

  const link =
    "https://create.microsoft.com/_next/image?url=https%3A%2F%2Fcdn.create.microsoft.com%2Fcmsassets%2FyoutubeBanner-Hero.webp&w=1920&q=75";

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
  ].map((name, index) => ({ id: index + 1, name }));

  const [countries, setCountries] = useState([]);
  useEffect(() => {
    const fetchCountries = async () => {
        try {
            const token = localStorage.getItem("api_token");
            if (!token) {
                setMessage("❌ Authorization token missing. Please log in.");
                return;
            }

            const response = await axios.get("https://develop.quakbox.com/admin/api/get_geo_country", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200 && response.data.success) {
                const countryOptions = response.data.geo_countries.map((country) => ({
                    value: country.code, // Country code
                    label: (
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <img
                                src={country.country_image} // Country image
                                alt={country.country_name}
                                style={{ width: 20, height: 15, marginRight: 10 }}
                            />
                            {country.country_name}
                        </div>
                    ),
                }));
                setCountries(countryOptions);
            } else {
                setMessage("⚠️ No countries found.");
            }
        } catch (error) {
            setMessage("❌ Error fetching countries. Please try again later.");
            console.error("Error fetching countries:", error);
        } finally {
            setLoading(false);
        }
    };

    fetchCountries();
}, []);

  // Toggle the sidebar open/close state
  const toggleSidebar = () => {
    setSidebarOpen((prevState) => !prevState);
  };
  return (
    <>
      <NavBar />
          {/* Full-page loading overlay */}
      {loading && (
        <div style={overlayStyle}>
          <img src={loading2} alt="Loading..." style={gifStyle} />
        </div>
      )}
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
      {/* Video Thumbnail */}
      <div
        className={`bg-secondary video-thumbnail ${videoData.filePath}`}
        style={{
          width: "120px",
          height: "80px",
          backgroundImage: `url(${videoData.thumbnails && videoData.thumbnails.length > 0 ? videoData.thumbnails[0] : 'placeholder.jpg'})`, // Ensure first thumbnail is used
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
        <div className="ms-3">
          <strong>
          {videoData ? videoData.message : "No message available"}
          </strong>
             {/* Progress Bar (Fixed at 100%) */}
           <div className="progress mt-1">
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: "100%" }} // Ensure progress bar stays at 100%
              aria-valuenow={100} // Fixed at 100%
              aria-valuemin="0"
              aria-valuemax="100"
             ></div>
            </div>
          </div>
        </div>           
          <div className="mb-1">
             <label className="form-label mb-1">Video Title</label>
              <input
                type="text"
                placeholder="Title"
                className={`form-control ${titleError ? "border-danger" : ""}`}
                value={titleText}
                style={{ color: titleColor }}
                onChange={(e) => setTitleText(e.target.value)}
              />
              {titleError && <small className="text-danger">Title is required</small>}
            </div>

            <div className="mb-1">
              <label className="form-label mb-1">About</label>
              <textarea
                className={`form-control ${descError ? "border-danger" : ""}`}
                placeholder="Description"
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
               {descError && <small className="text-danger">Description is required</small>}
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
                <select  className={`form-select ${typeError ? "border-danger" : ""}`} onChange={(e) => setType(e.target.value)} value={type}>
                  <option>Select</option>
                  <option>Public</option>
                  <option>Private</option>
                </select>
                {typeError && <small className="text-danger">Privacy setting is required</small>}
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
                <label className="form-label">Tags</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
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
            
            <div className="row mt-3">
              {/* Title Size Dropdown */}
              <div className="col-md-6">
                <label className="form-label">Title Size</label>
                <select
                  className="form-select"
                  value={titleSize}
                  onChange={(e) => setTitleSize(e.target.value)}
                >
                  <option value="text-sm">14px</option>
                  <option value="text-base">16px</option>
                  <option value="text-lg">18px</option>
                  <option value="text-xl">20px</option>
                  <option value="text-2xl">24px</option>
                  <option value="text-3xl">28px</option>
                </select>
              </div>

              {/* Title Color Picker */}
              <div className="col-md-6">
                <label className="form-label">Title Color</label>
                <input
                  type="color"
                  className="form-control form-control-color"
                  value={titleColor}
                  onChange={(e) => setTitleColor(e.target.value)}
                />
              </div>
            
             
            {/* Country Code Selection */}
              <div className="col-md-6">
                <label className="form-label">Select Country Code</label>
                <Select
                  options={countries}
                  value={countries.find((country) => country.value === selectedCountryCode)}
                  placeholder="Search country..."
                  isSearchable
                  onChange={(selectedOption) => setSelectedCountryCode(selectedOption?.value || null)}
                  className={countryError ? "border border-danger" : ""}
                  filterOption={(option, inputValue) =>
                    option.data.label.props.children[1]
                      .toLowerCase()
                      .includes(inputValue.toLowerCase())
                    }
                />
                {countryError && <small className="text-danger">Country selection is required</small>}
              </div>
          </div>
            <div className="mt-4"> 
                <h6>Category</h6>
                <div className="row mb-3">
                  {categories?.map((category) => (
                    <div key={category.id} className="col-md-2">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="category"
                          id={`category-${category.id}`}
                          value={category.id}
                          checked={selectedCategory === category.id}
                          onChange={(e) => setSelectedCategory(Number(e.target.value))}
                        />
                        <label className="form-check-label" htmlFor={`category-${category.id}`}>
                          {category.name}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
            {/* Thumbnail Section */}
            <div className="mt-1">
              <h6>Thumbnails</h6>
              <div className="mt-1">
                <div className="row g-4">
                  {Array.isArray(thumbnails) && thumbnails.length > 0 ? (
                    ["mp3", "png", "jpeg", "jpg", "gif"].includes(videoType.toLowerCase()) ? (
                      // ✅ Show only the first thumbnail for audio and image files
                      <div className="col-md-3">
                        <div
                          className={`card ${selectedThumbnail === thumbnails[0] ? "border-primary" : ""}`}
                          style={{
                            cursor: "pointer",
                            boxShadow: selectedThumbnail === thumbnails[0] ? "0 0 10px rgba(0, 123, 255, 0.5)" : "",
                          }}
                          onClick={() => handleThumbnailClick(thumbnails[0])}
                        >
                          <img
                            src={thumbnails[0]}
                            className="card-img-top"
                            alt="Thumbnail"
                            style={{ width: "100%", height: "150px", objectFit: "cover" }}
                          />
                        </div>
                      </div>
                    ) : (
                      // ✅ Show up to 4 thumbnails for videos
                      thumbnails.slice(0, 4).map((thumbnail, index) => (
                        <div key={index} className="col-md-3">
                          <div
                            className={`card ${selectedThumbnail === thumbnail ? "border-primary" : ""}`}
                            style={{
                              cursor: "pointer",
                              boxShadow: selectedThumbnail === thumbnail ? "0 0 10px rgba(0, 123, 255, 0.5)" : "",
                            }}
                            onClick={() => handleThumbnailClick(thumbnail)}
                          >
                            <img
                              src={thumbnail}
                              className="card-img-top"
                              alt={`Thumbnail ${index + 1}`}
                              style={{ width: "100%", height: "150px", objectFit: "cover" }}
                            />
                          </div>
                        </div>
                      ))
                    )
                  ) : (
                    <p>No thumbnails available.</p>
                  )}
                </div>
              </div>

              {/* Validation Message for Thumbnail Selection */}
              {thumbnailError && <small className="text-danger">Please select a thumbnail</small>}

              {/* Custom Thumbnail Upload Button */}
              <div className="text-center mt-2 mb-3">
                <button className="btn btn-outline-secondary btn-lg" onClick={openFilePicker}>
                  Custom Thumbnail
                </button>
              </div>

              {/* Hidden File Input */}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleCustomThumbnailUpload}
              />

              {/* Display Selected Thumbnail */}
              {selectedThumbnail && (
                <div className="mt-3 d-flex flex-column align-items-center">
                  <h6 className="mb-2">Selected Thumbnail</h6>
                  <div
                    style={{
                      width: "400px",
                      height: "250px",
                      border: "2px solid #000",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      overflow: "hidden",
                      borderRadius: "10px",
                    }}
                  >
                    <img
                      src={selectedThumbnail}
                      alt="Selected Thumbnail"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                </div>
              )}
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

           {/* ✅ Access Restriction Popup */}
                {message && (
                  <>
                    {/* Overlay to disable background interaction */}
                    <div
                      style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black
                        zIndex: 9999,
                        pointerEvents: "auto",
                      }}
                    />

                    {/* Restriction Message Modal */}
                    <div
                      style={{
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "white", 
                        padding: "20px",
                        borderRadius: "8px",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                        zIndex: 10000,
                        textAlign: "center",
                        maxWidth: "400px",
                      }}
                    >
                      <p>{message}</p> 
                      <button
                        onClick={() => {
                          setMessage("");
                          navigate("/qcast");
                        }}
                        className="btn btn-secondary"
                      >
                        OK
                      </button>
                    </div>
                  </>
                )}


              <div className="row mb-3 d-flex justify-content-center" style={{ marginTop :"20px" }}>
                <div className="col-md-4 d-flex justify-content-between">
                  <button
                    className="btn btn-outline-danger btn-lg w-50 me-2"
                    onClick={HandleCancleClick}
                  >
                    Cancel
                  </button>
                  <button 
                  className="btn btn-outline-primary btn-lg w-50 ms-2" 
                  onClick={handleSaveChanges} 
                  >
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
