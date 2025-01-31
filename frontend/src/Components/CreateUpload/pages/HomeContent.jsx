import { useContent } from "../store/contentStore"; // Ensure this is the correct path

import { Grid, Container } from "@mui/material";
import ContentCard from "../components/ContentCard";
import AudioCard from "../components/AudioCard";
import VideoCard from "../components/VideoCard";
import PhotoCard from "../components/PhotoCard";
// Separate component to render the content grid
const HomeContent = () => {
  const { content, removeContent } = useContent();
  const allContent = [...content.photos, ...content.videos, ...content.audios];

  return (
    <Container style={{ margin: "0", padding: "0" }}>
      <h1>Home Content Page</h1>
      {allContent.length > 0 ? (
        <Grid container spacing={2}>
          {allContent.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              {item.type === "photos" ? (
                <PhotoCard item={item} onDelete={removeContent} />
              ) : item.type === "videos" ? (
                <VideoCard item={item} onDelete={removeContent} />
              ) : (
                <AudioCard item={item} onDelete={removeContent} />
              )}
            </Grid>
          ))}
        </Grid>
      ) : (
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          No Home content available. Start creating or uploading content!
        </p>
      )}
    </Container>
  );
};

export default HomeContent;
