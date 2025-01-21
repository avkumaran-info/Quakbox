import React from "react";
import { Snackbar, CircularProgress, Backdrop, Alert } from "@mui/material";

// Loader Component
const Loader = ({ loading, message }) => (
  <Backdrop
    sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
    open={loading}
  >
    <div style={{ textAlign: "center" }}>
      <CircularProgress color="inherit" />
      {message && (
        <div
          style={{ marginTop: "16px", fontSize: "18px", fontWeight: "bold" }}
        >
          {message}
        </div>
      )}
    </div>
  </Backdrop>
);

// Snackbar Component
const CustomSnackbar = ({ open, message, onClose, severity = "info" }) => (
  <Snackbar
    open={open}
    autoHideDuration={4000}
    onClose={onClose}
    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
  >
    <Alert
      onClose={onClose}
      severity={severity}
      sx={{
        width: "100%",
        backgroundColor: severity === "error" ? "#f44336" : "#4caf50",
        color: "#fff",
        fontWeight: "bold",
      }}
    >
      {message}
    </Alert>
  </Snackbar>
);

export { Loader, CustomSnackbar };
