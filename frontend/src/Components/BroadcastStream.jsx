import React, { useEffect, useRef, useState } from 'react';

const BroadcastStream = () => {
    const videoRef = useRef(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);

    useEffect(() => {
        // Access the webcam stream
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                // Display the webcam stream on a video element
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }

                // Initialize the MediaRecorder API
                const recorder = new MediaRecorder(stream);
                setMediaRecorder(recorder);

                const chunks = [];

                recorder.ondataavailable = (event) => {
                    chunks.push(event.data);
                };

                recorder.onstop = async () => {
                    const blob = new Blob(chunks, { type: 'video/webm' });

                    // Send video data to Laravel backend
                    const formData = new FormData();
                    formData.append('video', blob, 'video.webm');

                    // Send the video stream to the Laravel backend
                    fetch(`https://${window.APP_DOMAIN}/admin/api/stream-video`, {
                        method: 'POST',
                        body: formData,
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            console.log('Video stream sent to backend:', data);
                        })
                        .catch((error) => {
                            console.error('Error sending video to backend:', error);
                        });
                };

                // Start recording
                recorder.start(1000); // Record every second
                setIsStreaming(true);
            })
            .catch((err) => {
                console.error('Error accessing webcam: ', err);
            });

        return () => {
            // Cleanup when the component unmounts
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = videoRef.current.srcObject.getTracks();
                tracks.forEach((track) => track.stop());
            }
        };
    }, []);

    return (
        <div>
            <h2>Broadcast Stream</h2>
            <video ref={videoRef} autoPlay playsInline />
            {isStreaming && <p>Streaming...</p>}
        </div>
    );
};

export default BroadcastStream;
