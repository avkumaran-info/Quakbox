// src/components/VideoCard.jsx
import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  CardMedia,
} from "@mui/material";

const VideoCard = ({ item, onDelete }) => {
  return (
    <Card sx={{ maxWidth: 345, margin: "10px", boxShadow: 3 }}>
      <CardMedia
        component="video"
        src={
          item.data instanceof Blob ? URL.createObjectURL(item.data) : item.data
        }
        controls
        height={200}
        sx={{ objectFit: "cover" }}
      />
      <CardContent>
        <Button
          variant="contained"
          color="error"
          onClick={() => onDelete(item.type, item.id)}
        >
          Delete
        </Button>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
