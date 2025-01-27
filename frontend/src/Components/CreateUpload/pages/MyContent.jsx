// src/pages/MyContent.jsx
import { useContent } from "../store/contentStore";
import { Grid, Container } from "@mui/material";
import ContentCard from "../components/ContentCard";

const MyContent = () => {
  const { content, removeContent } = useContent();
  const allContent = [...content.photos, ...content.videos, ...content.audios];

  return (
    <Container style={{ margin: "0", padding: "0" }}>
      {/* <h1>My Content</h1> */}
      <h1>My Content</h1>
      <Grid container spacing={0}>
        {allContent.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <ContentCard item={item} onDelete={removeContent} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MyContent;
