import React, { useState, useRef, useEffect } from "react";
import QSidebar from "./QSidebar";
import NavBar from "../Dashboard/NavBar";
import videoupload from "../../assets/images/Videos property/videoupload.png";
import webcam from "../../assets/images/Videos property/webcam.png";
import photo from "../../assets/images/Videos property/photo.jpeg";
import music from "../../assets/images/Videos property/music.jpg";
import shortvideo from "../../assets/images/Videos property/shorts.jpg";
import loading from "../../assets/images/loading.gif";
import { FaUpload } from "react-icons/fa"; // For upload icon
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UploadVideo = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("video"); // Default to "video" category
  const [webcamStream, setWebcamStream] = useState(null); // Store webcam stream
  const videoRef = useRef(null); // Reference to video element
  const fileInputRef = useRef(null); // File input reference for upload
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const chunkSize = 45 * 1024 * 1024; // 45MB per chunk
  const [progress, setProgress] = useState(0);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handler for category click on the right side
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  // Access webcam when "Webcam Capture" is clicked
  const handleWebcamCapture = async () => {
    navigate("/webcam"); // Navigate to the webcam recording page
  };

  // const uploadFile = async (firstFile, videoType, files) => {
  //   setIsLoading(true);

  //   if (videoType === 1 || videoType === 2 || videoType === 5) {
  //     try {
  //       const keyResponse = await axios.get(
  //         "https://develop.quakbox.com/admin/api/get-upload-key"
  //       );
  //       const uploadKey = keyResponse.data.upload_key;

  //       const totalChunks = Math.ceil(firstFile.size / chunkSize);
  //       let start = 0;
  //       let end = chunkSize;
  //       let uploadedBytes = 0; // Track total uploaded bytes

  //       for (let i = 0; i < totalChunks; i++) {
  //         const chunk = firstFile.slice(start, end);

  //         const formData = new FormData();
  //         formData.append("chunk", chunk);
  //         formData.append("index", i + 1);
  //         formData.append("total_chunks", totalChunks);
  //         formData.append("file_name", firstFile.name);
  //         formData.append("upload_key", uploadKey);
  //         formData.append("video_type", videoType);
  //         formData.append("temp_upload", true);

  //   try {
  //     await axios.post(
  //       "https://develop.quakbox.com/admin/api/upload-video-chunk",
  //       formData,
  //       {
  //         headers: { "Content-Type": "multipart/form-data" },
  //         onUploadProgress: (progressEvent) => {
  //           const chunkProgress = Math.round(
  //             (progressEvent.loaded / chunk.size) * 100
  //           ); // Progress of this chunk
  //           const totalProgress = Math.min(
  //             95,
  //             Math.round(
  //               ((uploadedBytes + progressEvent.loaded) /
  //                 firstFile.size) *
  //                 100
  //             )
  //           );
  //           setProgress(totalProgress);
  //         },
  //       }
  //     );

  //     uploadedBytes += chunk.size; // Only update after successful upload
  //     setProgress(
  //       Math.min(95, Math.round((uploadedBytes / firstFile.size) * 100))
  //     ); // Ensure max is 95% before merging
  //   } catch (error) {
  //     console.error(`Error uploading chunk ${i + 1}:`, error);
  //     alert("Chunk upload failed. Please try again.");
  //     setIsLoading(false);
  //     return;
  //   }

  //   start = end;
  //   end = Math.min(firstFile.size, end + chunkSize);
  // }

  //       // Start merging process
  //       setProgress(96); // Set progress to 96% before merging starts
  //       const mergeResponse = await axios.post(
  //         "https://develop.quakbox.com/admin/api/merge-video-chunks",
  //         {
  //           file_name: firstFile.name,
  //           total_chunks: totalChunks,
  //           upload_key: uploadKey,
  //         }
  //       );

  //       if (mergeResponse.data) {
  //         setProgress(98); // Update progress while merging is completing

  //         const videoData = {
  //           message: mergeResponse.data.message,
  //           filePath: mergeResponse.data.file_path,
  //           thumbnails: mergeResponse.data.thumbnails,
  //           videoType: videoType,
  //         };

  //         try {
  //           const token = localStorage.getItem("api_token");
  //           if (!token) {
  //             alert("Authorization token not found. Please log in.");
  //             return;
  //           }

  //           const formData = new FormData();
  //           formData.append("video_type", videoType);
  //           formData.append("temp_upload", true);
  //           formData.append("upload_key", uploadKey);
  //           formData.append("video_file", videoData.filePath);

  //           const response = await axios.post(
  //             "https://develop.quakbox.com/admin/api/videos/upload",
  //             formData,
  //             {
  //               headers: {
  //                 Authorization: `Bearer ${token}`,
  //                 "Content-Type": "multipart/form-data",
  //               },
  //             }
  //           );

  //           setIsLoading(false);
  //           setProgress(100); // Set progress to 100% after merging and final upload

  //           if (response.data.result) {
  //             console.log("Navigating with videoData:", response.data);
  //             navigate("/addvideo", { state: { videoData: response.data } });
  //           } else {
  //             alert(response.data.message);
  //           }
  //         } catch (error) {
  //           console.error(error);
  //         }
  //       } else {
  //         alert(mergeResponse.data.message);
  //       }
  //     } catch (error) {
  //       setIsLoading(false);
  //       console.error("Error uploading video:", error);
  //       alert("Upload failed. Please try again.");
  //     }
  //   } else {
  //     const formData = new FormData();
  //     formData.append("video_type", videoType);
  //     formData.append("temp_upload", true);

  //     if (videoType === 3) {
  //       for (let i = 0; i < files.length; i++) {
  //         formData.append("video_file[]", files[i]);
  //       }
  //     } else {
  //       formData.append("video_file", firstFile);
  //     }

  //     setIsLoading(true);

  //     try {
  //       const token = localStorage.getItem("api_token");
  //       if (!token) {
  //         alert("Authorization token not found. Please log in.");
  //         return;
  //       }

  //       const response = await axios.post(
  //         "https://develop.quakbox.com/admin/api/videos/upload",
  //         formData,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //             "Content-Type": "multipart/form-data",
  //           },
  //         }
  //       );
  //       console.log(response);

  //       setIsLoading(false);
  //       setProgress(100); // Ensure progress reaches 100% for non-chunked uploads

  //       if (response.data.result) {
  //         console.log("Navigating with videoData:", response.data);
  //             navigate("/addvideo", { state: { videoData: response.data } });
  //       } else {
  //         alert(response.data.message);
  //       }
  //     } catch (error) {
  //       setIsLoading(false);
  //       console.error("Error uploading video:", error);
  //       alert("Upload failed. Please try again.");
  //     }
  //   }
  // };

  // //////////////////////////////////////////////////////////

  // Create a reusable Axios instance
  const axiosInstance = axios.create({
    baseURL: "https://develop.quakbox.com/admin/api",
    headers: { "Content-Type": "multipart/form-data" },
  });

  // Handle file upload

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    const firstFile = files[0];
    const videoType = firstFile.type.startsWith("video/")
      ? selectedCategory === "shortvideo"
        ? 5 // Short Video
        : 1 // Regular Video
      : firstFile.type.startsWith("audio/")
      ? 2
      : firstFile.type.startsWith("image/")
      ? 3
      : selectedCategory === "webcam"
      ? 4 // Webcam Capture
      : 4;

    // **Short Video Duration Validation (Max 20 mins)**
    if (videoType === 5) {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.src = URL.createObjectURL(firstFile);

      video.onloadedmetadata = async () => {
        URL.revokeObjectURL(video.src); // Free memory

        if (video.duration > 120) {
          // 120 seconds = 2 minutes
          alert("Short Video cannot be longer than 2 minutes.");
          return;
        }

        // ✅ If valid, proceed with upload
        await uploadFile(firstFile, videoType, files);
      };
    } else {
      // ✅ Proceed with other uploads (video, audio, image, webcam)
      await uploadFile(firstFile, videoType, files);
    }
  };

  const getUploadKey = async () => {
    try {
      const response = await axiosInstance.get("/get-upload-key");
      return response.data.upload_key;
    } catch (error) {
      console.error("Error fetching upload key:", error);
      throw error;
    }
  };

  // Track progress for all chunks
  const chunkProgress = new Map();
  const previousLogState = new Map(); // Stores previous state to avoid redundant console logs

  const formatSize = (size) => (size / (1024 * 1024)).toFixed(2) + "MB"; // Convert bytes to MB

  const logProgress = (totalChunks) => {
    let logOutput = "📡 Upload Progress:\n";
    let totalSizeUploaded = 0;
    let totalSize = 0;
    let hasChanges = false;

    for (let i = 1; i <= totalChunks; i++) {
      const progress = chunkProgress.get(i)?.percentCompleted || 0;
      const totalChunkSize = chunkProgress.get(i)?.size || 0;
      const uploadedChunkSize = (progress / 100) * totalChunkSize;

      totalSize += totalChunkSize;
      totalSizeUploaded += uploadedChunkSize;

      const uploadedSizeMB = formatSize(uploadedChunkSize);
      const totalSizeMB = formatSize(totalChunkSize);
      const logEntry = `Chunk ${i}: ${progress}% - Uploaded: ${uploadedSizeMB} / ${totalSizeMB}`;

      if (previousLogState.get(i) !== logEntry) {
        previousLogState.set(i, logEntry);
        hasChanges = true;
      }

      logOutput += logEntry + "\n";
    }

    // ✅ When all chunks are uploaded, move to 95%
    if (totalSizeUploaded === totalSize) {
      setProgress(95);
      logOutput += `\n📦 All chunks uploaded (95%)`;
    } else {
      // Update normal progress
      const overallProgress = Math.round((totalSizeUploaded / totalSize) * 95);
      setProgress(overallProgress);
      logOutput += `\n🌍 Overall Upload Progress: ${overallProgress}%`;
    }

    if (hasChanges) {
      console.clear();
      console.log(logOutput.trim());
    }
  };

  // ✅ Upload chunks
  const uploadChunk = async (
    chunk,
    index,
    totalChunks,
    fileName,
    uploadKey,
    videoType,
    retries = 3
  ) => {
    const formData = new FormData();
    formData.append("chunk", chunk);
    formData.append("index", index);
    formData.append("total_chunks", totalChunks);
    formData.append("file_name", fileName);
    formData.append("upload_key", uploadKey);
    formData.append("video_type", videoType);
    formData.append("temp_upload", true);

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await axiosInstance.post("/upload-video-chunk", formData, {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            chunkProgress.set(index, { percentCompleted, size: chunk.size });
            logProgress(totalChunks);
          },
        });

        return;
      } catch (error) {
        console.error(
          `❌ Chunk ${index} failed (Attempt ${attempt}/${retries})`,
          error
        );
        if (attempt === retries) throw error;
      }
    }
  };

  // ✅ Merge chunks after upload
  const mergeChunks = async (fileName, totalChunks, uploadKey) => {
    try {
      setProgress(96); // 🔥 Show 96% when merging starts
      console.log("🔄 Merging in progress... (96%)");

      const response = await axiosInstance.post("/merge-video-chunks", {
        file_name: fileName,
        total_chunks: totalChunks,
        upload_key: uploadKey,
      });

      setProgress(98); // ✅ Show 98% when merging completes
      console.log("✅ Merging completed (98%)");

      return response.data;
    } catch (error) {
      console.error("Error merging chunks:", error);
      throw error;
    }
  };

  // ✅ Final video upload after merge
  const uploadVideo = async (videoData, videoType, uploadKey) => {
    try {
      setProgress(99); // 🔥 Show 99% when final upload starts
      console.log("🚀 Uploading final file... (99%)");

      const token = localStorage.getItem("api_token");
      if (!token) {
        alert("Authorization token not found. Please log in.");
        return;
      }
      console.log(videoData);
      const formData = new FormData();
      formData.append("video_type", videoType);
      formData.append("temp_upload", false);
      formData.append("upload_key", uploadKey);
      formData.append("video_file", videoData.filePath);

      const res = await axiosInstance.post("/videos/upload", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProgress(100); // ✅ Show 100% when everything is done
      console.log("🎉 Upload Complete! (100%)");
      return res.data;
    } catch (error) {
      console.error("Error uploading video:", error);
      throw error;
    }
  };

  const uploadFile = async (firstFile, videoType, files) => {
    setIsLoading(true);
    try {
      if ([1, 2, 4, 5].includes(videoType)) {
        const uploadKey = await getUploadKey();
        console.log(uploadKey);

        const totalChunks = Math.ceil(firstFile.size / chunkSize);
        let start = 0,
          end = chunkSize;

        const uploadPromises = [];

        for (let i = 0; i < totalChunks; i++) {
          const chunk = firstFile.slice(start, end);
          uploadPromises.push(
            uploadChunk(
              chunk,
              i + 1,
              totalChunks,
              firstFile.name,
              uploadKey,
              videoType
            )
          );
          start = end;
          end = Math.min(firstFile.size, end + chunkSize);
        }

        // 🚀 Upload all chunks in parallel
        await Promise.all(uploadPromises);

        // Merge chunks after all uploads finish
        const mergeResponse = await mergeChunks(
          firstFile.name,
          totalChunks,
          uploadKey
        );
        if (mergeResponse) {
          const videoData = {
            message: mergeResponse.message,
            filePath: mergeResponse.file_url,
            thumbnails: mergeResponse.thumbnails,
            videoType: videoType,
          };
          console.log(videoData);

          const response = await uploadVideo(
            videoData,
            videoType,
            uploadKey,
            videoType
          );
          console.log(response);

          if (response.result) {
            navigate("/addvideo", {
              state: {
                videoData: response,
                uploadKey: uploadKey, // ✅ Include uploadKey
                videoType: videoType,
              },
            });
          } else {
            alert(response.message);
          }
        } else {
          alert(mergeResponse.message);
        }
      } else {
        const formData = new FormData();
        formData.append("video_type", videoType);
        formData.append("temp_upload", true);

        if (videoType === 3) {
          for (let i = 0; i < files.length; i++) {
            formData.append("video_file[]", files[i]);
          }
        } else {
          formData.append("video_file", firstFile);
        }

        setIsLoading(true);
        setProgress(0); // Start from 0%

        try {
          const token = localStorage.getItem("api_token");
          if (!token) {
            alert("Authorization token not found. Please log in.");
            return;
          }

          const response = await axios.post(
            `https://${window.APP_DOMAIN}/admin/api/videos/upload`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
              onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round(
                  (progressEvent.loaded / progressEvent.total) * 100
                );

                // Cap progress at 99% during upload
                setProgress(percentCompleted < 99 ? percentCompleted : 99);
                console.log(
                  `📡 Upload Progress: ${
                    percentCompleted < 99 ? percentCompleted : 99
                  }%`
                );
              },
            }
          );

          // ✅ Only when API is successful, set to 100%
          if (response.data.result) {
            setProgress(100);
            console.log("🎉 Upload Complete! (100%)");

            console.log("Navigating with videoData:", response.data);
            navigate("/addvideo", {
              state: { videoData: response.data, videoType: videoType },
            });
          } else {
            alert(response.data.message);
          }
        } catch (error) {
          setIsLoading(false);
          console.error("Error uploading video:", error);
          alert("Upload failed. Please try again.");
        } finally {
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /////////////////////////////////////////////////////////////////////

  // Content for each category
  const categoryContent = {
    video: {
      image: videoupload,
      label: "Video Upload",
      options: [
        {
          label: "Webcam Capture",
          img: webcam,
          category: "webcam",
          action: handleWebcamCapture,
        },
        { label: "Create Music", img: music, category: "music" },
        { label: "Photo Slideshow", img: photo, category: "photo" },
        { label: "Short Video", img: shortvideo, category: "shortvideo" },
      ],
    },
    photo: {
      image: photo,
      label: "Photo Slideshow",
      options: [
        {
          label: "Webcam Capture",
          img: webcam,
          category: "webcam",
          action: handleWebcamCapture,
        },
        { label: "Create Music", img: music, category: "music" },
        { label: "Video Upload", img: videoupload, category: "video" },
        { label: "Short Video", img: shortvideo, category: "shortvideo" },
      ],
    },
    webcam: {
      image: webcam,
      label: "Webcam Capture",
      options: [
        { label: "Photo Slideshow", img: photo, category: "photo" },
        { label: "Create Music", img: music, category: "music" },
        { label: "Video Upload", img: videoupload, category: "video" },
        { label: "Short Video", img: shortvideo, category: "shortvideo" },
      ],
    },
    music: {
      image: music,
      label: "Create Music",
      options: [
        {
          label: "Webcam Capture",
          img: webcam,
          category: "webcam",
          action: handleWebcamCapture,
        },
        { label: "Photo Slideshow", img: photo, category: "photo" },
        { label: "Video Upload", img: videoupload, category: "video" },
        { label: "Short Video", img: shortvideo, category: "shortvideo" },
      ],
    },
    shortvideo: {
      image: shortvideo, // Add an appropriate image for short videos
      label: "Short Video",
      options: [
        { label: "Webcam Capture", img: webcam, category: "webcam" },
        { label: "Create Music", img: music, category: "music" },
        { label: "Photo Slideshow", img: photo, category: "photo" },
        { label: "Video Upload", img: videoupload, category: "video" },
      ],
    },
  };

  // Handle back button click to navigate to /qcast
  const handleBackClick = () => {
    navigate("/qcast"); // Navigate to '/qcast'
  };

  return (
    <>
      <NavBar />
      {/* Full-page loading overlay */}
      {isLoading && (
        <div style={overlayStyle}>
          <img src={loading} alt="Loading..." style={gifStyle} />
          <p>{progress}</p>
        </div>
      )}

      <div style={{ marginTop: "56px" }}>
        <div className="d-flex">
          <div
            style={{
              flex: 1,
              padding: "20px",
              transition: "margin 0.3s",
              marginRight: sidebarOpen ? "250px" : "60px", // Adjust margin based on sidebar
            }}
          >
            <div className="row">
              {/* Left Side */}
              <div className="col-md-8 text-start">
                <button className="btn btn-dark mb-3" onClick={handleBackClick}>
                  Back
                </button>

                {/* Left side container that switches between image or webcam */}
                <div
                  className="my-3"
                  style={{
                    width: "100%",
                    height: "350px", // Fixed height for consistency
                    borderRadius: "10px", // Rounded corners
                    overflow: "hidden", // Hide any overflowed parts of the image
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Add a subtle shadow for better appearance
                    objectFit: "contain",
                  }}
                >
                  {/* If webcam is active, show video */}
                  {selectedCategory === "webcam" ? (
                    <video
                      ref={videoRef}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <img
                      src={categoryContent[selectedCategory].image}
                      alt={categoryContent[selectedCategory].label}
                      className="img-fluid hover-zoom"
                      style={{
                        width: "100%",
                        height: "300px",
                        objectFit: "contain", // Ensures the whole image is visible without cropping
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        fileInputRef.current.click();
                      }}
                    />
                  )}
                </div>

                {/* Label */}
                <div className="mt-3">
                  <h4>{categoryContent[selectedCategory].label}</h4>
                </div>

                {/* Upload Buttons below the image */}
                <div className="d-flex justify-content-around mt-3">
                  {selectedCategory === "photo" && (
                    <div>
                      <label className="btn btn-outline-primary">
                        <FaUpload className="me-2" /> Upload Photo
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          ref={fileInputRef}
                          multiple
                          onChange={handleFileUpload}
                        />
                      </label>
                    </div>
                  )}

                  {selectedCategory === "video" && (
                    <div>
                      <label className="btn btn-outline-primary">
                        <FaUpload className="me-2" /> Upload Video
                        <input
                          type="file"
                          accept="video/*"
                          style={{ display: "none" }}
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                        />
                      </label>
                    </div>
                  )}

                  {selectedCategory === "music" && (
                    <div>
                      <label className="btn btn-outline-primary ">
                        <FaUpload className="me-2" /> Upload Music
                        <input
                          type="file"
                          accept="image/*,audio/*"
                          style={{ display: "none" }}
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                        />
                      </label>
                    </div>
                  )}

                  {selectedCategory === "shortvideo" && (
                    <div>
                      <label className="btn btn-outline-primary">
                        <FaUpload className="me-2" /> Upload Video
                        <input
                          type="file"
                          accept="video/*"
                          style={{ display: "none" }}
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side */}
              <div className="col-md-4 border-start">
                <h6 className="text-muted">
                  CREATE {categoryContent[selectedCategory].label.toUpperCase()}
                </h6>

                {/* Container for the 3 elements */}
                <div className="d-flex flex-column gap-3">
                  {/* Loop through the options based on selected category */}
                  {categoryContent[selectedCategory].options.map(
                    (option, index) => (
                      <div
                        key={index}
                        className="d-flex align-items-center clickable"
                        onClick={() => {
                          handleCategoryClick(option.category);
                          if (option.action) option.action(); // Call action if it exists (for webcam capture)
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <img
                          src={option.img}
                          alt={option.label}
                          className="me-2"
                          style={{
                            width: "80px",
                            height: "70px",
                          }}
                        />
                        <div>
                          <span className="d-block">{option.label}</span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
          <QSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        </div>
      </div>

      {/* CSS for Hover Zoom Effect */}
      <style>
        {`
          .hover-zoom {
            transition: transform 0.3s ease-in-out;
          }

          .hover-zoom:hover {
            transform: scale(1.1); /* Zoom in slightly */
          }
          
        `}
      </style>
    </>
  );
};

export const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0, 0, 0, 0.7)", // Dark transparent background
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  color: "#fff", // White text for high contrast
  fontSize: "24px",
  fontWeight: "bold",
  zIndex: 9999, // Ensure it's above everything
};

export const gifStyle = {
  width: "200px", // Adjust size if needed
  height: "100px",
  marginBottom: "20px", // Space between GIF and text
};

export const progressStyle = {
  fontSize: "30px", // Bigger font
  fontWeight: "bold",
  color: "#00ff00", // Bright green for better visibility
  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)", // Slight shadow for clarity
};
export default UploadVideo;
