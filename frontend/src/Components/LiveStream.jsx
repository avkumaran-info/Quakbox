import React, { useEffect } from "react";
import Pusher from "pusher-js";

const LiveStream = () => {
    useEffect(() => {
        const pusher = new Pusher("c9f6fa6c8f4ff42156ac", {
            cluster: "mt1",
            encrypted: false,
        });

        const channel = pusher.subscribe("live-stream");
        channel.bind("LiveStreamStarted", (data) => {
            console.log("New stream started:", data);
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, []);

    return <div>Live Streaming</div>;
};

export default LiveStream;
