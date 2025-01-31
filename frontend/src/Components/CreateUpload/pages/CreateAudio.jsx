import { useState, useRef, useEffect } from "react";
import { Button } from "@mui/material";
import { useContent } from "../store/contentStore";
import { ReactMic } from "react-mic";
const CreateAudio = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [voice, setVoice] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isRecordingError, setIsRecordingError] = useState(false);
  const { addContent } = useContent();
  const mediaRecorderRef = useRef(null);
  const [timer, setTimer] = useState(0); // For timer to show recording progress

  // Dynamically change the title based on recording status
  useEffect(() => {
    document.title = isRecording ? "Recording... 🎙️" : "Create Audio";
  }, [isRecording]);

  const startRecording = () => {
    setVoice(true);
    setIsRecording(true);
    setAudioBlob(null); // Clear previous audio blob if any
    setIsRecordingError(false); // Reset recording error status
    setTimer(0); // Reset timer

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start();

        mediaRecorder.ondataavailable = (event) => {
          setAudioBlob(event.data);
        };

        // Handle the error if it occurs
        mediaRecorder.onerror = () => {
          setIsRecordingError(true);
          stopRecording(); // Stop recording immediately if an error occurs
        };

        // Update the timer every second while recording
        const timerInterval = setInterval(() => {
          setTimer((prev) => prev + 1);
        }, 1000);

        // Stop the timer when recording is stopped
        mediaRecorder.onstop = () => {
          clearInterval(timerInterval);
        };
      })
      .catch((err) => {
        setIsRecordingError(true);
        stopRecording(); // Stop recording if there's an error in getting user media
      });
  };

  const stopRecording = () => {
    setVoice(false);
    setIsRecording(false);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  const saveAudio = () => {
    if (!audioBlob) return; // Ensure audioBlob is valid
    const audioData = {
      id: Date.now(),
      type: "audios",
      data: audioBlob,
    };
    addContent("audios", audioData);
    alert("Audio saved!");
    setAudioBlob(null);
  };

  return (
    <div>
      <h1>Create Audio</h1>
      <ReactMic record={voice} onStop={stopRecording} />
      <div>
        {isRecording ? (
          <Button onClick={stopRecording}>Stop Recording</Button>
        ) : (
          <Button onClick={startRecording}>Start Recording</Button>
        )}
      </div>

      <div>
        {isRecording && !isRecordingError && <p>Recording... {timer}s</p>}
        {isRecordingError && (
          <p style={{ color: "red" }}>An error occurred while recording.</p>
        )}
      </div>

      <Button onClick={saveAudio} disabled={!audioBlob}>
        Save Audio
      </Button>
    </div>
  );
};

export default CreateAudio;
