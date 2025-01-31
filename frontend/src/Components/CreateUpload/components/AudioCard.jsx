// src/components/AudioCard.jsx
import React from "react";
import { Card, CardContent, CardActions, Button } from "@mui/material";

const AudioCard = ({ item, onDelete }) => {
  return (
    <Card sx={{ maxWidth: 345, margin: "10px", boxShadow: 3 }}>
      <CardContent>
        <audio controls style={{ width: "100%" }}>
          <source
            src={
              item.data instanceof Blob
                ? URL.createObjectURL(item.data)
                : item.data
            }
            type={item.data.type}
          />
          Your browser does not support the audio element.
        </audio>
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          color="error"
          onClick={() => onDelete(item.type, item.id)}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default AudioCard;
