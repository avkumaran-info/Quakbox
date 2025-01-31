import { useRef, useState } from "react";
import { Button, Input } from "@mui/material";
import { useContent } from "../store/contentStore";

const UploadContent = () => {
  const [file, setFile] = useState(null);
  const { addContent } = useContent();
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    if (file) {
      if (
        selectedFile.type.startsWith("audio") ||
        selectedFile.type.startsWith("video") ||
        selectedFile.type.startsWith("image")
      ) {
        setFile(file);
      } else {
        alert(
          "Unsupported file type. Please upload audio, video, or photo files."
        );
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Clear input
        }
      }
    }
  };

  const handleUpload = () => {
    if (!file) {
      alert("No file selected. Please choose a file to upload.");
      return;
    }
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
    alert(`${file.name} uploaded successfully as ${contentData.type}!`);
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear file input
    }
  };

  return (
    <div>
      <h1>Upload Content</h1>
      <Input type="file" inputRef={fileInputRef} onChange={handleFileChange} />
      <Button onClick={handleUpload} disabled={!file}>
        Upload
      </Button>
    </div>
  );
};

export default UploadContent;
