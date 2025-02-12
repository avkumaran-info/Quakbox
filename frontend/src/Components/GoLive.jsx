import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  Stack,
  Avatar,
  Divider,
} from "@mui/material";
import { GrClose } from "react-icons/gr";
import {
  FaThumbsUp,
  FaHeart,
  FaLaughBeam,
  FaSadTear,
  FaAngry,
} from "react-icons/fa";

import SendIcon from "@mui/icons-material/Send";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { keyframes, styled } from "@mui/system";
import menProfilePic from "../assets/images/man-user-color-icon.svg";
import menProfilePicTwo from "../assets/images/man-user-circle-icon.svg";
import womenProfilePic from "../assets/images/woman-user-color-icon.svg";
import womenProfilePicTwo from "../assets/images/woman-user-circle-icon.svg";
import LiveVideoStream from "LiveStream";
// Animation for floating icons
const floatUp = keyframes`
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-600px);
  }
`;
// Styled components for floating icons
const FloatingReaction = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: "70px",
  right: "0px",
  fontSize: "30px",
  animation: `${floatUp} 3s ease-out`,
}));
const GoLiveTwo = () => {
  // State declarations
  const [isLive, setIsLive] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [reactions, setReactions] = useState([]);
  const [viewersCount, setViewersCount] = useState(1542); // Viewers count
  const commentsContainerRef = useRef(null);
  const isUserScrolling = useRef(false);
  const navigate = useNavigate(); // For navigation
  // User data
  const users = [
    { name: "Alice", avatar: womenProfilePic },
    { name: "Bob", avatar: menProfilePic },
    { name: "Charlie", avatar: menProfilePicTwo },
    { name: "Jenny", avatar: womenProfilePicTwo },
  ];

  // Live stream owner data
  const liveOwner = {
    name: "John Doe",
    avatar: menProfilePic,
  };
  // Helper to validate session
  const checkUserSession = () => {
    const userToken = localStorage.getItem("api_token"); // Replace with your session key
    if (!userToken) {
      navigate("/"); // Redirect to login if no session
    }
  };
  useEffect(() => {
    checkUserSession(); // Validate session on mount
  }, []);
  // Handlers for live stream state
  const handleGoLive = () => setIsLive(true);
  const handleEndLive = () => {
    setIsLive(false);
    setComments([]);
    setReactions([]);
  };

  // Handler for comment submission
  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      const comment = {
        user: users[3].name,
        avatar: users[3].avatar,
        text: newComment,
      };

      // Get the current position in the comments section (1st, 2nd, 3rd, etc.)
      const position = comments.length + 1;

      // Log the comment and its position
      //  console.log(`Comment at position ${position}:`, comment.text);
      setComments((prevComments) => {
        const updatedComments = [...prevComments, comment];

        // Scroll to the bottom of the comments container
        const container = commentsContainerRef.current;
        if (container) {
          container.scrollTop = container.scrollHeight; // Ensures the latest comment is visible
        }

        return updatedComments;
      });
      setNewComment(""); // Clear the input field after submission
    }
  };

  // Reaction handling
  const handleReaction = (reactionType) => {
    const reactionId = Date.now();
    setReactions((prevReactions) => [
      ...prevReactions,
      { id: reactionId, type: reactionType },
    ]);

    setTimeout(() => {
      setReactions((prevReactions) =>
        prevReactions.filter((reaction) => reaction.id !== reactionId)
      );
    }, 2000);
  };

  const handleScroll = () => {
    const container = commentsContainerRef.current;
    if (!container) return;

    const containerTop = container.scrollTop;
    const containerBottom = containerTop + container.clientHeight;

    const visibleComments = [];

    // Loop through all comments and check if they are visible
    comments.forEach((comment, index) => {
      const commentElement = document.getElementById(`comment-${index}`);

      if (commentElement) {
        const commentTop = commentElement.offsetTop;
        const commentBottom = commentTop + commentElement.offsetHeight;

        // Check if the comment is within the visible area of the container
        if (commentBottom > containerTop && commentTop < containerBottom) {
          // Add the visible comment to the list
          visibleComments.push({ comment, index });
        }
      }
    });

    // Ensure only the first 4 visible comments are logged with position 1, 2, 3, or 4
    visibleComments.slice(0, 3).forEach(({ comment, index }, visibleIndex) => {
      const reversedIndex = 3 - (visibleIndex + 1); // This will give you positions like 6, 5, 4, etc.
      // console.log(
      //   `Visible Comment at position ${reversedIndex}: ${comment.text}`
      // );
      // console.log(
      //   `Visible Comment at position ${visibleIndex + 1}: ${comment.text}`
      // );
      // Apply opacity based on position
      const opacity = 1 - reversedIndex * 0.3; // Fade out as position increases
      document.getElementById(`comment-${index}`).style.opacity = opacity;
    });
  };

  // Automatically scroll to the latest comment
  useEffect(() => {
    const container = commentsContainerRef.current;
    if (!container) return;

    if (!isUserScrolling.current) {
      container.scrollTop = container.scrollHeight;
    }
  }, [comments]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#ffa",
        color: "black",
      }}
    >
      {/* Live Stream Video with Owner Info Overlay */}
      {isLive ? (
        <Paper
          elevation={20}
          sx={{
            position: "relative",
            width: {
              xs: "100%", // Full width for mobile screens
              md: "70%", // 70% width for medium and larger screens
            },
            height: {
              xs: "100%", // Full height for mobile screens
              md: "90vh", // 90% viewport height for medium and larger screens
            },
            aspectRatio: {
              xs: "9 / 16", // Preserve aspect ratio on mobile
              md: "16 / 9", // Wide aspect ratio for desktop
            },
            // maxWidth: 400,
            // aspectRatio: "9 / 16",
            overflow: "hidden",
            borderRadius: 2,
            mx: "auto",
          }}
        >
          {/* Video Section */}
          <Webcam
            audio={true}
            mirrored={true}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px",
            }}
          >
            {/* Owner Info Section */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                src={liveOwner.avatar}
                alt={liveOwner.name}
                sx={{ width: 40, height: 40, mr: 1 }}
              />
              <Typography variant="h6" sx={{ color: "white" }}>
                {liveOwner.name}
              </Typography>
            </Box>

            {/* Live Text Section */}
            <Box
              sx={{
                backgroundColor: "red",
                padding: "4px 8px",
                borderRadius: "5px",
                display: "inline-block",
              }}
            >
              <Typography variant="h6" sx={{ color: "white" }}>
                LIVE
              </Typography>
            </Box>

            {/* Viewers Icon and Count Section */}
            <Box sx={{ ml: 2, display: "flex", alignItems: "center" }}>
              <VisibilityIcon sx={{ color: "white", fontSize: 20, mr: 1 }} />
              <Typography sx={{ color: "white" }}>{viewersCount}</Typography>
            </Box>

            {/* Close Button Section */}
            <Box sx={{ top: 10, right: 0 }}>
              <GrClose
                onClick={handleEndLive}
                style={{
                  backgroundColor: "white",
                  color: "black",
                  fontSize: 30,
                  borderRadius: "50%",
                  padding: "8px",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                }}
                className="close-icon"
              />
            </Box>
          </Box>

          {/* Comments Section */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              // bgcolor: "rgba(255, 255, 255,0.2)",
              pt: 1,
              pb: 0,
              pl: 1,
              pr: 1,
            }}
          >
            <Box
              ref={commentsContainerRef}
              onScroll={handleScroll}
              sx={{
                maxHeight: 220,
                width: 350,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
                "&::-webkit-scrollbar": { display: "none" },
              }}
            >
              {comments.map((comment, index) => {
                return (
                  <Box
                    key={index}
                    id={`comment-${index}`} // Unique ID for each comment
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: "wheat",
                      borderRadius: 2,
                      // p: 1,
                    }}
                  >
                    <Avatar
                      src={comment.avatar}
                      alt={comment.user}
                      sx={{ width: 30, height: 30, mr: 1 }}
                    />
                    <Typography variant="body2">
                      <Typography
                        component="span"
                        sx={{
                          fontSize: 15,
                          fontWeight: "bold",
                          color: "wheat",
                        }}
                      >
                        {comment.user}
                      </Typography>
                      <br />
                      <Typography
                        component="span"
                        sx={{
                          fontSize: 12,
                          color: "white",
                          wordWrap: "break-word",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {comment.text}
                      </Typography>
                    </Typography>
                  </Box>
                );
              })}
            </Box>
            <Divider sx={{ bgcolor: "white", mt: 1 }} />
            <Stack
              direction="row"
              sx={{
                spacing: 1,
                mt: 0,
                pt: 1,
                pb: 1,
              }}
            >
              <TextField
                variant="outlined"
                placeholder="Write a comment..."
                size="small"
                fullWidth
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                sx={{
                  backgroundColor: "transparent", // Transparent background
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      border: "none", // Removes the border
                    },
                    "&:hover fieldset": {
                      border: "none", // No border on hover
                    },
                    "&.Mui-focused fieldset": {
                      border: "none", // No border on focus
                    },
                  },
                  input: {
                    color: "white", // White text color
                  },
                }}
              />
              <IconButton
                color="primary"
                onClick={handleCommentSubmit}
                sx={{
                  bgcolor: "white", // Set the initial background color
                  "&:hover": {
                    bgcolor: "primary.main", // Change background color on hover (use the primary color)
                  },
                  bottom: 0,
                  right: 0,
                  padding: "10px",
                  // margin: "3px",
                  width: "40px",
                  height: "40px",
                }}
              >
                <SendIcon
                  sx={{ color: "primary.main", "&:hover": { color: "white" } }}
                />
              </IconButton>
            </Stack>
          </Box>

          {/* Floating Reactions Section */}
          <IconButton
            onClick={() => handleReaction("like")}
            sx={{
              position: "absolute",
              bottom: 70,
              right: 10,
              bgcolor: "#1877f2",
              // padding: "10px",
              margin: "3px",
              width: "30px",
              height: "30px",
            }}
          >
            <FaThumbsUp
              style={{
                fontSize: 24,
                color: "white",
              }}
            />
          </IconButton>
          <IconButton
            onClick={() => handleReaction("love")}
            sx={{
              position: "absolute",
              bottom: 105,
              right: 10,
              bgcolor: "#ff5a5f",
              // padding: "10px",
              margin: "3px",
              width: "30px",
              height: "30px",
            }}
          >
            <FaHeart style={{ color: "white", fontSize: 24 }} />
          </IconButton>
          <IconButton
            onClick={() => handleReaction("haha")}
            sx={{
              position: "absolute",
              bottom: 140,
              right: 10,
              bgcolor: "#f0e130",
              // padding: "10px",
              margin: "3px",
              width: "30px",
              height: "30px",
            }}
          >
            <FaLaughBeam style={{ color: "black", fontSize: 24 }} />
          </IconButton>
          <IconButton
            onClick={() => handleReaction("sad")}
            sx={{
              position: "absolute",
              bottom: 175,
              right: 10,
              bgcolor: "#1c87c9",
              // padding: "10px",
              margin: "3px",
              width: "30px",
              height: "30px",
            }}
          >
            <FaSadTear style={{ color: "white", fontSize: 24 }} />
          </IconButton>
          <IconButton
            onClick={() => handleReaction("angry")}
            sx={{
              position: "absolute",
              bottom: 210,
              right: 10,
              bgcolor: "#e14b40",
              // padding: "10px",
              margin: "3px",
              width: "30px",
              height: "30px",
            }}
          >
            <FaAngry style={{ color: "white", fontSize: 24 }} />
          </IconButton>
          {/* Render Floating Reaction Icons */}
          {reactions.map((reaction) => {
            return (
              <FloatingReaction key={reaction.id}>
                {reaction.type === "like" && (
                  <FaThumbsUp style={{ color: "#1877f2" }} />
                )}
                {reaction.type === "love" && (
                  <FaHeart style={{ color: "#ff5a5f" }} />
                )}
                {reaction.type === "haha" && (
                  <FaLaughBeam style={{ color: "#f0e130" }} />
                )}
                {reaction.type === "sad" && (
                  <FaSadTear style={{ color: "#1c87c9" }} />
                )}
                {reaction.type === "angry" && (
                  <FaAngry style={{ color: "#e14b40" }} />
                )}
              </FloatingReaction>
            );
          })}
        </Paper>
      ) : (
        <Box>
          {/* Go Live Button Section */}
          <Typography variant="h4" gutterBottom>
            Go Live
          </Typography>
          <Button
            variant="contained"
            color="success"
            size="large"
            onClick={handleGoLive}
            sx={{ mt: 2 }}
          >
            Start Live Stream
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default GoLiveTwo;
