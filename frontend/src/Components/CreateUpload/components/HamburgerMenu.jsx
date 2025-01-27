import { useState } from "react";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import MicIcon from "@mui/icons-material/Mic";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Link } from "react-router-dom"; // Keep routing the same

const HamburgerMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "create-menu-popover" : undefined;

  return (
    <div
      style={{ display: "flex", justifyContent: "flex-end", padding: "10px" }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link
          to="/goVideo"
          style={{ textDecoration: "none", marginRight: "16px" }}
        >
          <Button
            color="inherit"
            style={{ fontWeight: "bold", fontSize: "16px" }}
          >
            Home
          </Button>
        </Link>
        <Link to="/goVideo/my-content" style={{ textDecoration: "none" }}>
          <Button
            color="inherit"
            style={{ fontWeight: "bold", fontSize: "16px" }}
          >
            My Content
          </Button>
        </Link>
      </div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleClick}
        style={{
          borderRadius: "24px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          transition: "transform 0.2s ease-in-out",
          marginLeft: "16px",
        }}
        onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
        onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
      >
        Create
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          style: {
            width: "200px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
          },
        }}
      >
        <List>
          <ListItemButton
            component={Link}
            to="/goVideo/create-video"
            onClick={handleClose}
          >
            <ListItemIcon>
              <VideoCameraFrontIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Upload Video" />
          </ListItemButton>
          <ListItemButton
            component={Link}
            to="/goVideo/create-audio"
            onClick={handleClose}
          >
            <ListItemIcon>
              <MicIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Create Audio" />
          </ListItemButton>
          <ListItemButton
            component={Link}
            to="/goVideo/take-photo"
            onClick={handleClose}
          >
            <ListItemIcon>
              <CameraAltIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Take Photo" />
          </ListItemButton>
          <ListItemButton
            component={Link}
            to="/goVideo/upload-content"
            onClick={handleClose}
          >
            <ListItemIcon>
              <UploadFileIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Upload Content" />
          </ListItemButton>
        </List>
      </Popover>
    </div>
  );
};

export default HamburgerMenu;
