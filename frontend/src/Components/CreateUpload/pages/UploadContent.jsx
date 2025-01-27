import { useState } from "react";
import { Button, Input } from "@mui/material";
import { useContent } from "../store/contentStore";

const UploadContent = () => {
  const [file, setFile] = useState(null);
  const { addContent } = useContent();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    const contentData = {
      id: Date.now(),
      type: file.type.startsWith("audio")
        ? "audios"
        : file.type.startsWith("video")
        ? "videos"
        : "photos",
      data: file,
    };
    addContent(contentData.type, contentData);
    alert("File uploaded!");
  };

  return (
    <div>
      <h1>Upload Content</h1>
      <Input type="file" onChange={handleFileChange} />
      <Button onClick={handleUpload}>Upload</Button>
    </div>
  );
};

export default UploadContent;
