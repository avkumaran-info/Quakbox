import React, { useState, useEffect, useRef } from "react";

const ChatWindow = ({ selectedFriend, onSendMessage }) => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const chatContainerRef = useRef(null); // Create a ref for the chat container

  useEffect(() => {
    setChatHistory(selectedFriend.chatHistory || []);
  }, [selectedFriend]);

  // Auto-scroll to the latest message whenever chatHistory changes
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]); // Trigger this effect when chatHistory changes

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = { sender: "You", text: message };
    onSendMessage(newMessage);
    setChatHistory((prevHistory) => [...prevHistory, newMessage]);
    setMessage("");
  };

  const handleCall = () => {
    // Handle initiating a voice call (you can integrate WebRTC or other services here)
    alert("Voice call initiated");
  };

  const handleVideoCall = () => {
    // Handle initiating a video call (you can integrate WebRTC or other services here)
    alert("Video call initiated");
  };

  return (
    <div className="col-lg-6 col-md-8 col-sm-12 mx-auto p-4 mt-3 mb-5">
      <div className="card mt-5">
        {/* Header */}
        <div className="card-header bg-primary text-white d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <img
              src={selectedFriend.image}
              alt="Profile"
              className="rounded-circle me-2"
              style={{ width: "40px", height: "40px", objectFit: "cover" }}
            />
            <h6 className="mb-0">{selectedFriend.name}</h6>
          </div>

          {/* Call and Video Call buttons */}
          <div className="d-flex justify-content-center align-items-center">
            <button
              className="btn btn-light me-3 p-2 shadow-sm rounded-circle"
              onClick={handleCall}
              title="Call"
              style={{
                fontSize: "24px", // Icon size
                color: "#28a745", // Icon color (green for call)
                border: "none", // Remove button border
                backgroundColor: "#f8f9fa", // Light background
                width: "50px", // Fixed width for perfect circle
                height: "50px", // Fixed height for perfect circle
                transition: "all 0.3s ease", // Smooth transition on hover
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#e9ecef")} // Hover background color
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#f8f9fa")} // Reset background on mouse leave
            >
              <i className="fas fa-phone"></i>
            </button>

            <button
              className="btn btn-light p-2 shadow-sm rounded-circle"
              onClick={handleVideoCall}
              title="Video Call"
              style={{
                fontSize: "24px", // Icon size
                color: "#007bff", // Icon color (blue for video)
                border: "none", // Remove button border
                backgroundColor: "#f8f9fa", // Light background
                width: "50px", // Fixed width for perfect circle
                height: "50px", // Fixed height for perfect circle
                transition: "all 0.3s ease", // Smooth transition on hover
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#e9ecef")} // Hover background color
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#f8f9fa")} // Reset background on mouse leave
            >
              <i className="fas fa-video"></i>
            </button>
          </div>
        </div>

        {/* Chat Body */}
        <div
          ref={chatContainerRef} // Attach the ref to the chat container
          className="card-body"
          style={{
            height: "400px",
            overflowY: "scroll",
            backgroundColor: "#f8f9fa",
          }}
        >
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`d-flex ${
                msg.sender === "You"
                  ? "justify-content-end"
                  : "justify-content-start"
              }`}
            >
              <div
                className={`p-2 my-1 rounded ${
                  msg.sender === "You"
                    ? "bg-secondary text-white shadow-sm"
                    : "bg-primary text-white shadow-sm"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Footer */}
        <div className="card-footer">
          <div className="input-group">
            <button className="btn btn-light input-group-text">
              <i className="fas fa-smile"></i>
            </button>
            <input
              type="text"
              className="form-control"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button className="btn btn-primary" onClick={handleSendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
