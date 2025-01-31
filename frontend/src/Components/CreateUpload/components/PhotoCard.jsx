// src/components/PhotoCard.jsx
import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  CardMedia,
} from "@mui/material";

const PhotoCard = ({ item, onDelete }) => {
  return (
    <Card sx={{ maxWidth: 345, margin: "10px", boxShadow: 3 }}>
      <CardMedia
        component="img"
        image={
          item.data instanceof Blob ? URL.createObjectURL(item.data) : item.data
        }
        alt="Uploaded content"
        sx={{ width: "100%", height: 200, objectFit: "contain" }}
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

export default PhotoCard;
