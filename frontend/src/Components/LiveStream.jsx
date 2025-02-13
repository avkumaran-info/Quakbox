import React, { useEffect, useRef } from "react";

const LiveStream = () => {
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const ws = useRef(null);
    const peerConnection = useRef(new RTCPeerConnection({
        iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" }
        ]
    }));

    useEffect(() => {
        ws.current = new WebSocket("wss://develop.quakbox.com");

        ws.current.onopen = () => {
            console.log("WebSocket Connected");
        };

        ws.current.onmessage = async (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "offer") {
                await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.offer));
                const answer = await peerConnection.current.createAnswer();
                await peerConnection.current.setLocalDescription(answer);
                ws.current.send(JSON.stringify({ type: "answer", answer }));
            } else if (data.type === "answer") {
                await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.answer));
            } else if (data.type === "candidate") {
                await peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
            }
        };

        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
                stream.getTracks().forEach((track) => {
                    peerConnection.current.addTrack(track, stream);
                });
            })
            .catch((error) => {
                console.error("Error accessing media devices:", error);
            });

        peerConnection.current.ontrack = (event) => {
            if (event.streams && event.streams[0]) {
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        };

        peerConnection.current.onicecandidate = (event) => {
            if (event.candidate) {
                ws.current.send(JSON.stringify({ type: "candidate", candidate: event.candidate }));
            }
        };

        return () => {
            if (ws.current) {
                ws.current.close();
            }
            if (peerConnection.current) {
                peerConnection.current.close();
            }
        };
    }, []);

    return (
        <div>
            <video ref={localVideoRef} autoPlay muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <video ref={remoteVideoRef} autoPlay style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
    );
};

export default LiveStream;
