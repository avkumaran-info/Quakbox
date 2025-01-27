import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import { Button } from "@mui/material";
import { useContent } from "../store/contentStore";

const CreateVideo = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState(null);
  const webcamRef = useRef(null);
  const { addContent } = useContent();
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const startRecording = () => {
    setIsRecording(true);
    const stream = webcamRef.current.stream; // Get the webcam stream
    const recorder = new MediaRecorder(stream); // Create MediaRecorder with the stream
    setMediaRecorder(recorder); // Save it to state for later use

    recorder.start();
    recorder.ondataavailable = (event) => {
      setVideoBlob(event.data); // Save the video data to state
    };
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
    webcamRef.current.stream.getTracks().forEach((track) => track.stop());
  };

  const saveVideo = () => {
    const videoData = {
      id: Date.now(),
      type: "videos",
      data: videoBlob,
    };
    addContent("videos", videoData);
    alert("Video saved!");
  };

  return (
    <div>
      <h1>Create Video</h1>
      <Webcam audio={true} ref={webcamRef} />
      <div>
        {!isRecording ? (
          <Button onClick={startRecording}>Start Recording</Button>
        ) : (
          <Button onClick={stopRecording}>Stop Recording</Button>
        )}
        <Button onClick={saveVideo} disabled={!videoBlob}>
          Save Video
        </Button>
      </div>
    </div>
  );
};

export default CreateVideo;
