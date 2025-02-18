import { useState, useRef, useEffect, useContext } from "react";
import NavBar from "../Dashboard/NavBar";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const WebcamRecorder = () => {
  const { userData } = useContext(StoreContext);
  const [recording, setRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0); // ⏳ Timer state
  const [videoUrl, setVideoUrl] = useState(null);
  const [tempPath, setTempPath] = useState(null);
  const videoRef = useRef(null);
  const mediaRecorder = useRef(null);
  const recordedChunks = useRef([]);
  const streamRef = useRef(null);
  const timerRef = useRef(null); // ⏳ Timer reference
  const navigate = useNavigate();
  useEffect(() => {
    const storedVideo = localStorage.getItem("savedVideo");
    const storedPath = localStorage.getItem("savedPath");

    if (storedVideo) {
      setVideoUrl(storedVideo);
      setTempPath(storedPath);
    }

    return () => {
      stopWebcam();
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      videoRef.current.srcObject = stream;
      streamRef.current = stream;

      recordedChunks.current = [];

      const options = { mimeType: "video/webm;codecs=vp8,opus" };
      mediaRecorder.current = new MediaRecorder(stream, options);

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = async () => {
        const blob = new Blob(recordedChunks.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);

        // Create file metadata (name, type)
        const fileName = "recorded-video.webm"; // Modify as necessary
        const fileType = "video/webm"; // Modify if needed

        // Save metadata in localStorage
        localStorage.setItem(
          "savedVideoMetadata",
          JSON.stringify({ fileName, fileType })
        );

        // Save the Blob data as a URL (not directly as a File object)
        localStorage.setItem("savedVideoBlobUrl", url);

        const userId = userData.users.id;
        const tempFilePath = `temp/${userId}/webcam/recorded-video.webm`; // Store the path
        setTempPath(tempFilePath);
        localStorage.setItem("savedPath", tempFilePath);

        setVideoUrl(url);
        stopWebcam();

        videoRef.current.srcObject = null;
        videoRef.current.src = url;
        videoRef.current.controls = true;
      };

      mediaRecorder.current.start();
      setRecording(true);
      setRecordTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordTime((prevTime) => prevTime + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing webcam:", error);
      alert(
        "Failed to access webcam. Please allow camera and microphone permissions."
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
      mediaRecorder.current.stop();
    }
    setRecording(false);

    // Stop timer
    clearInterval(timerRef.current);
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const uploadVideo = async () => {
    const savedBlobUrl = localStorage.getItem("savedVideoBlobUrl");
    const savedMetadata = JSON.parse(
      localStorage.getItem("savedVideoMetadata")
    );
    console.log(savedMetadata);
    

    if (!savedBlobUrl || !savedMetadata) {
      alert("No video found to upload.");
      return;
    }

    const { fileName, fileType } = savedMetadata;

    // Create a new File object from the Blob URL
    const response = await fetch(savedBlobUrl);
    const blob = await response.blob();
    const file = new File([blob], fileName, { type: fileType });

    console.log(`Uploading video from path: ${tempPath}`);

    handleFileUpload(file); // Upload the actual file object
  };

  // File upload function (Modified)
  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("video_type", 4); // Get the MIME type of the file
    formData.append("temp_upload", true);
    formData.append("video_file", file); // The video file itself

    console.log(file); // Check the file object before sending

    try {
      const token = localStorage.getItem("api_token");
      if (!token) {
        alert("Authorization token not found. Please log in.");
        return;
      }

      const response = await axios.post(
        "https://develop.quakbox.com/admin/api/videos/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("API Response:", response.data); // Log full response

      if (response.data.result) {
        const videoData = {
          message: response.data.message,
          filePath: response.data.file_path,
          thumbnails: response.data.thumbnails,
          videoType: response.data.video_type,
        };

        navigate("/addvideo", { state: { videoData } });
      } else {
        alert(response.data.message); // Show the error message returned by the API
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      console.error("Error response:", error.response?.data);
      alert(
        `Upload failed: ${error.response?.data.message || "Please try again."}`
      );
    }
  };

  return (
    <>
      <NavBar />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: "#f8f9fa",
          padding: "20px",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "900px",
            height: "550px",
            borderRadius: "10px",
            border: "3px solid #6c757d",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#ddd",
            overflow: "hidden",
          }}
        >
          <video
            ref={videoRef}
            autoPlay={!videoUrl}
            controls={!!videoUrl}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            src={videoUrl ? videoUrl : undefined}
          />

          {/* ⏳ Display Recording Timer */}
          {recording && (
            <div
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                backgroundColor: "red",
                color: "white",
                fontSize: "18px",
                padding: "5px 10px",
                borderRadius: "5px",
                fontWeight: "bold",
              }}
            >
              {recordTime}s
            </div>
          )}
        </div>

        {tempPath && (
          <p style={{ marginTop: "10px", fontSize: "14px", color: "#555" }}>
            Temporary Path: {tempPath}
          </p>
        )}

        <div style={{ marginTop: "20px" }}>
          {!videoUrl ? (
            !recording ? (
              <button
                onClick={startRecording}
                style={{
                  backgroundColor: "#007bff",
                  color: "white",
                  padding: "10px 20px",
                  fontSize: "16px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  marginRight: "10px",
                  display: "flex",
                  alignItems: "center",
                  boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
                }}
              >
                Start Recording
              </button>
            ) : (
              <button
                onClick={stopRecording}
                style={{
                  backgroundColor: "#dc3545",
                  color: "white",
                  padding: "10px 20px",
                  fontSize: "16px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
                }}
              >
                Stop Recording
              </button>
            )
          ) : (
            <>
              <button
                onClick={() => {
                  localStorage.removeItem("savedVideo");
                  localStorage.removeItem("savedPath");
                  setVideoUrl(null);
                  setTempPath(null);
                }}
                style={{
                  backgroundColor: "#6c757d",
                  color: "white",
                  padding: "10px 20px",
                  fontSize: "16px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  marginRight: "10px",
                }}
              >
                Delete Recording
              </button>
              <button
                onClick={uploadVideo}
                style={{
                  backgroundColor: "#28a745",
                  color: "white",
                  padding: "10px 20px",
                  fontSize: "16px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Confirm & Upload
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default WebcamRecorder;
