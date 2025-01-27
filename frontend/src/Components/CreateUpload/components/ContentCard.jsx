// src/components/ContentCard.jsx
import { Card, CardMedia, Button, CardActions } from "@mui/material";

const ContentCard = ({ item, onDelete }) => {
  return (
    <Card>
      {item.type === "photos" ? (
        <img
          src={
            item.data instanceof Blob
              ? URL.createObjectURL(item.data)
              : item.data
          }
          alt="Uploaded content"
          style={{ width: "100%", height: "auto", objectFit: "cover" }}
        />
      ) : item.type === "videos" ? (
        <CardMedia
          component="video"
          src={
            item.data instanceof Blob
              ? URL.createObjectURL(item.data)
              : item.data
          }
          controls
          height={200}
        />
      ) : (
        <audio
          src={
            item.data instanceof Blob
              ? URL.createObjectURL(item.data)
              : item.data
          }
          controls
        />
      )}

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

export default ContentCard;
