import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

const StreamVideos = ({ streamUrl }) => {
  console.log(streamUrl);
  
  const videoRef = useRef(null);

  useEffect(() => {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(videoRef.current);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log("HLS manifest loaded, video is ready to play!");
      });

      return () => {
        hls.destroy();
      };
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = streamUrl;
    }
  }, [streamUrl]);

  return (
    <div>
      <video
        ref={videoRef}
        controls
        autoPlay
        className="w-100 rounded"
        style={{ objectFit: "contain",height:"500px" }}
      />
    </div>
  );
};

export default StreamVideos;
