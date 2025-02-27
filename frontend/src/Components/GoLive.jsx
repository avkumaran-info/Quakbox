import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useMediaQuery,
} from "@mui/material";
import "./GoLive.css";
import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";
import NavBar from "../Components/Dashboard/NavBar";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
// import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import { Box, Button, Typography, Paper, IconButton } from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";

import { GrClose } from "react-icons/gr";

import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import VideocamIcon from "@mui/icons-material/Videocam";
import SettingsIcon from "@mui/icons-material/Settings";
import FeedbackIcon from "@mui/icons-material/Feedback";
import axios from "axios";

const GoLive = () => {
  // State declarations
  const [isLive, setIsLive] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState({
    camera: false,
    mic: false,
  });
  const [isStreaming, setIsStreaming] = useState(false);
  const navigate = useNavigate(); // For navigation
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const [uploadKey, setUploadKey] = useState("");
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const videoRef = useRef(null);

  const startStreaming = async () => {
    try {
      // Check permissions before starting the stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: true,
      });
      // Check if video and audio are granted
      if (!stream.getVideoTracks().length || !stream.getAudioTracks().length) {
        alert("Please enable camera and microphone access to start streaming.");
        return;
      }
      // Set the camera and mic permission states
      setPermissionGranted({
        camera: true,
        mic: true,
      });
      // Fetch upload key from the backend
      const { data } = await axios.get(
        "https://develop.quakbox.com/admin/api/get-upload-key"
      );
      setUploadKey(data.upload_key);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      streamRef.current = stream;

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "video/webm; codecs=vp8, opus",
      });

      mediaRecorderRef.current.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          const formData = new FormData();
          formData.append("chunk", event.data);
          formData.append("file_name", `video_${Date.now()}.webm`);
          formData.append("upload_key", uploadKey);
          try {
            await axios.post(
              "https://develop.quakbox.com/admin/api/upload-chunk-live",
              formData,
              {
                headers: { "Content-Type": "multipart/form-data" },
              }
            );
          } catch (error) {
            console.error("Error uploading chunk:", error);
          }
        }
      };
      mediaRecorderRef.current.start(1000);
      setIsStreaming(true);
    } catch (error) {
      console.error("Error starting live stream:", error);
      alert("Error starting live stream. Please try again.");
    }
  };

  const stopStreaming = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    setIsStreaming(false);
  };

  const toggleCamera = () => {
    if (videoRef.current && videoRef.current.stream) {
      const videoTracks = videoRef.current.stream.getVideoTracks();
      if (videoTracks.length > 0) {
        setCameraOn((prevCameraOn) => {
          const newCameraState = !prevCameraOn;

          videoTracks.forEach((track) => (track.enabled = newCameraState));

          console.log("Camera toggled:", newCameraState);

          return newCameraState;
        });
      } else {
        console.log("No video tracks found");
      }
    } else {
      console.log("No active video stream found");
    }
  };

  const toggleMic = () => {
    if (streamRef.current) {
      const audioTracks = streamRef.current.getAudioTracks();
      if (audioTracks.length > 0) {
        setMicOn((prevMicOn) => {
          const newMicState = !prevMicOn;
          audioTracks[0].enabled = newMicState;
          console.log("Microphone toggled:", newMicState);
          return newMicState;
        });
      } else {
        console.log("No audio tracks found");
      }
    } else {
      console.log("No active audio stream found");
    }
  };

  // Helper to validate session
  const checkUserSession = () => {
    const userToken = localStorage.getItem("api_token");
    if (!userToken) {
      navigate("/");
    }
  };

  useEffect(() => {
    checkUserSession();
  }, []);

  const handleGoLive = () => setIsLive(true);

  const handleEndLive = () => {
    setIsLive(false);
    setPermissionGranted(false);
    setMobileOpen(false);
  };

  const [selected, setSelected] = useState("Stream");
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
    console.log("mobileOpen clikced");
    console.log(mobileOpen);
  };

  const requestGoLive = () => {
    setIsLive(true);
  };

  const drawer = (
    <div className="countriesMainContainer">
      <Box className="boxContainer">
        <List>
          <ListItem
            component="div"
            selected={selected === "Webcam"}
            onClick={() => {
              handleDrawerToggle();
              setSelected("Webcam");
              handleGoLive();
            }}
            sx={{ cursor: "pointer" }}
          >
            <ListItemIcon sx={{ color: "#ffffff" }}>
              <VideocamIcon />
            </ListItemIcon>
            <ListItemText primary="Webcam" />
          </ListItem>
          <ListItem
            component="div"
            selected={selected === "Manage"}
            onClick={() => {
              handleDrawerToggle();
              setSelected("Manage");
            }}
            // onClick={() => setSelected("Manage")}
            sx={{ cursor: "pointer" }}
          >
            <ListItemIcon sx={{ color: "#ffffff" }}>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Manage" />
          </ListItem>
        </List>
        <Box sx={{ flexGrow: 1 }} />
        <List>
          <ListItem
            component="div"
            sx={{ marginTop: "auto", cursor: "pointer" }}
            onClick={() => {
              handleDrawerToggle();
              setSelected("Send Feedback");
            }}
          >
            <ListItemIcon sx={{ color: "#ffffff" }}>
              <FeedbackIcon />
            </ListItemIcon>
            <ListItemText primary="Send Feedback" />
          </ListItem>
        </List>
      </Box>
    </div>
  );

  return (
    <div className="mainContainer">
      <div className="navbarDiv">
        <NavBar />
      </div>
      <div className="countriesMainContainer">
        <Box className="countriesMainContainerBox1">
          {isLive ? (
            <Paper className="goLivePaper" elevation={20}>
              {/* Video Section */}
              <Webcam
                className="goLivePaperWeb"
                audio={micOn}
                mirrored={true}
                ref={videoRef}
              />
              <Box className="goLivePaperBox">
                <Box>
                  <Button
                    onClick={isStreaming ? stopStreaming : startStreaming}
                    color={isStreaming ? "error" : "primary"}
                  >
                    {isStreaming ? "Stop Streaming" : "Start Streaming"}
                  </Button>
                </Box>
                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                  <IconButton onClick={toggleCamera} color="primary">
                    {cameraOn ? <VideocamIcon /> : <VideocamOffIcon />}
                  </IconButton>
                  <IconButton onClick={toggleMic} color="primary">
                    {micOn ? <MicIcon /> : <MicOffIcon />}
                  </IconButton>
                </Box>

                {/* Close Button Section */}
                <Box className="goLivePaperBox4">
                  <GrClose
                    onClick={() => {
                      handleEndLive();
                    }}
                    className="close-icon"
                  />
                </Box>
              </Box>
            </Paper>
          ) : (
            <>
              {isMobile ? (
                <>
                  <IconButton
                    sx={{
                      // position: "absolute",
                      // top: 10,
                      left: 10,
                      color: "#ffffff",
                      position: "fixed",
                      top: "120px",
                    }}
                    onClick={handleDrawerToggle}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                      "& .MuiDrawer-paper": {
                        width: 240,
                        boxSizing: "border-box",
                      },
                    }}
                  >
                    {drawer}
                  </Drawer>
                </>
              ) : (
                <Drawer
                  variant="permanent"
                  sx={{
                    width: 240,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                      width: 240,
                      boxSizing: "border-box",
                      height: "100vh",
                      overflow: "hidden",
                    },
                  }}
                >
                  {drawer}
                </Drawer>
              )}
              {/* Main Content */}
              <Box className="mainContent">
                <IconButton color="success">
                  <CheckCircleIcon sx={{ fontSize: 50 }} />
                </IconButton>

                <Typography variant="h4" sx={{ mt: 2, fontWeight: "bold" }}>
                  Request Success, You can Go Live Now
                </Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={requestGoLive}
                  color="primary"
                >
                  Go Live
                </Button>
              </Box>
            </>
          )}
        </Box>
      </div>
    </div>
  );
};

export default GoLive;
