import React, { useEffect, useRef } from "react";
import io from "socket.io-client";

const LiveStream = () => {
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const socket = useRef(null);
    const peerConnection = useRef(new RTCPeerConnection());

    useEffect(() => {
        socket.current = io("https://develop.quakbox.com");

        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                localVideoRef.current.srcObject = stream;
                stream.getTracks().forEach((track) => peerConnection.current.addTrack(track, stream));
            });

        peerConnection.current.ontrack = (event) => {
            remoteVideoRef.current.srcObject = event.streams[0];
        };

        socket.current.on("offer", async (offer) => {
            await peerConnection.current.setRemoteDescription(offer);
            const answer = await peerConnection.current.createAnswer();
            await peerConnection.current.setLocalDescription(answer);
            socket.current.emit("answer", answer);
        });

        socket.current.on("answer", (answer) => {
            peerConnection.current.setRemoteDescription(answer);
        });

        socket.current.on("candidate", (candidate) => {
            peerConnection.current.addIceCandidate(candidate);
        });

        peerConnection.current.onicecandidate = (event) => {
            if (event.candidate) {
                socket.current.emit("candidate", event.candidate);
            }
        };

    }, []);

    return (
        <div>
            <video ref={localVideoRef} 
            autoPlay muted
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}/>
            <video ref={remoteVideoRef} autoPlay style={{ width: "45%" }} />
        </div>
    );
};


export default LiveStream;
