import React, { useEffect, useRef } from 'react';
import flvjs from 'flv.js';

const BroadcastWatch = () => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (flvjs.isSupported()) {
            const player = flvjs.createPlayer({
                type: 'flv',
                url: `rtmp://${window.APP_DOMAIN}/live/test`,
            });

            player.attachMediaElement(videoRef.current);
            player.load();
            player.play();
        }

        return () => {
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
        };
    }, []);

    return (
        <div>
            <h2>Watch Stream</h2>
            <video ref={videoRef} controls />
        </div>
    );
};

export default BroadcastWatch;
