import React, { useState } from "react";
import Webcam from "react-webcam";
import { Button } from "@mui/material";
import { useContent } from "../store/contentStore";

const TakePhoto = () => {
  const [photo, setPhoto] = useState(null);
  const webcamRef = React.useRef(null);
  const { addContent } = useContent();

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setPhoto(imageSrc);
  };

  const savePhoto = () => {
    const photoData = {
      id: Date.now(),
      type: "photos",
      data: photo,
    };
    addContent("photos", photoData);
    alert("Photo saved!");
  };

  return (
    <div>
      <h1>Take Photo</h1>
      <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
      <Button onClick={capture}>Take Photo</Button>
      {photo && <img src={photo} alt="Captured" />}
      <Button onClick={savePhoto} disabled={!photo}>
        Save Photo
      </Button>
    </div>
  );
};

export default TakePhoto;
