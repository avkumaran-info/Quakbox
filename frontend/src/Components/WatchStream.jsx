import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Hls from "hls.js";

const WatchLiveStream = () => {
    const { streamId } = useParams();
    const videoRef = useRef(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const streamUrl = `https://develop.quakbox.com/admin/api/images/hls/${streamId}/index.m3u8`;

        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(streamUrl);
            hls.attachMedia(videoRef.current);
            hls.on(Hls.Events.ERROR, () => {
                setError("Error loading stream.");
            });
        } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
            videoRef.current.src = streamUrl;
        } else {
            setError("HLS is not supported in this browser.");
        }
    }, [streamId]);

    return (
        <div>
            <h2>Live Stream</h2>
            {error && <p>{error}</p>}
            <video ref={videoRef} controls autoPlay></video>
        </div>
    );
};

export default WatchLiveStream;
