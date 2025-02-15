import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const StartStream = () => {
    const [streamKey, setStreamKey] = useState(null);
    const [streamUrl, setStreamUrl] = useState(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const [stream, setStream] = useState(null);

    useEffect(() => {
        const getWebcamStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                videoRef.current.srcObject = stream;
                setStream(stream);
            } catch (error) {
                console.error("Error accessing webcam:", error);
            }
        };

        getWebcamStream();
    }, []);

    const startLiveStream = async () => {
        try {
            const response = await axios.post("https://develop.quakbox.com/admin/api/start-stream");
            setStreamKey(response.data.stream_key);
            setStreamUrl(response.data.stream_url);

            await axios.post("https://develop.quakbox.com/admin/api/generate-hls", {
                stream_key: response.data.stream_key,
            });

            setIsStreaming(true);
            alert("Streaming started!");

            // Start sending video feed to the backend
            startStreamingToServer(response.data.stream_key);
        } catch (error) {
            console.error("Error starting stream:", error);
        }
    };

    const startStreamingToServer = async (streamKey) => {
        if (!stream) {
            console.error("No webcam stream available.");
            return;
        }

        const mediaRecorder = new MediaRecorder(stream, {
            mimeType: "video/mp4; codecs=H.264",
        });


        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = async (event) => {
            if (event.data.size > 0) {
                const formData = new FormData();
                formData.append("stream_key", streamKey);
                formData.append("video_chunk", event.data);

                await axios.post("https://develop.quakbox.com/admin/api/upload-chunk", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }
        };

        mediaRecorder.start(1000); // Send chunks every second
    };

    return (
        <div>
            <h2>Start Live Stream</h2>
            <video ref={videoRef} autoPlay playsInline width="640" height="360"></video>
            <br />
            <button onClick={startLiveStream} disabled={isStreaming}>
                {isStreaming ? "Streaming..." : "Go Live"}
            </button>
            {streamUrl && (
                <p>
                    Share this URL:{" "}
                    <a href={streamUrl} target="_blank" rel="noopener noreferrer">
                        {streamUrl}
                    </a>
                </p>
            )}
        </div>
    );
};

export default StartStream;
