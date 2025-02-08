import React, { useEffect, useState } from "react";
import user from "../../assets/images/user1.png";
import user1Image from "../../assets/images/user1.png";
import user2Image from "../../assets/images/user1.png";
import user3Image from "../../assets/images/user1.png";
import user4Image from "../../assets/images/user1.png";
import NavBar from "../Dashboard/NavBar";
import { useLocation } from "react-router-dom";

const Chatroom = () => {
  const location = useLocation();
  const { title, allowChat, selectedPrivacy, selectIcon, userId } =
    location.state || {};

  const [speakers, setSpeakers] = useState([
    { id: userId, name: "You", img: user, micStatus: true },
    { id: "2", name: "You", img: user, micStatus: false },
  ]);
  const [listeners, setListeners] = useState([
    { id: "3", name: "Bob", img: user },
    { id: "4", name: "Eve", img: user },
  ]);

  const [micStream, setMicStream] = useState(null);

  const [requests, setRequests] = useState([]); // List of listeners requesting to speak

  useEffect(() => {
    return () => {
      // Stop mic when user leaves
      if (micStream) {
        micStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [micStream]);

  // Toggle mic for speakers only
  const toggleMic = async () => {
    setSpeakers((prevSpeakers) =>
      prevSpeakers.map((speaker) => {
        if (speaker.id === userId) {
          if (!speaker.micOn) {
            navigator.mediaDevices
              .getUserMedia({ audio: true })
              .then((stream) => {
                setMicStream(stream);
              })
              .catch((error) => {
                console.error("Mic access denied:", error);
              });
          } else {
            if (micStream) {
              micStream.getTracks().forEach((track) => track.stop());
            }
          }
          return { ...speaker, micOn: !speaker.micOn };
        }
        return speaker;
      })
    );
  };

  // Listener requests to speak
  const requestToSpeak = (listenerId, listenerName) => {
    if (!requests.some((req) => req.id === listenerId)) {
      setRequests([...requests, { id: listenerId, name: listenerName }]);
    }
  };

  // Admin accepts request
  const acceptRequest = (listenerId) => {
    const acceptedUser = listeners.find(
      (listener) => listener.id === listenerId
    );
    if (acceptedUser) {
      setSpeakers([...speakers, { ...acceptedUser, micOn: false }]); // Add to speakers
      setListeners(listeners.filter((listener) => listener.id !== listenerId)); // Remove from listeners
    }
    setRequests(requests.filter((req) => req.id !== listenerId)); // Remove request
  };

  // Admin rejects request
  const rejectRequest = (listenerId) => {
    setRequests(requests.filter((req) => req.id !== listenerId)); // Remove request
  };

  const [showExtraSection, setShowExtraSection] = useState(false);
  const toggleExtraSection = () => {
    setShowExtraSection((prev) => !prev);
  };

  return (
    <>
      <NavBar />
      <div
        className="container-fluid "
        style={{
          marginTop: "56px",
          height: "calc(100vh - 60px)",
          overflow: "hidden",
        }}
      >
        <div className="row h-100">
          {/* Chat Section */}
          <div
            className={`${
              showExtraSection ? "col-md-3" : "col-md-3"
            } p-3 border rounded bg-white d-flex flex-column`}
            style={{
              height: "100%",
              borderColor: "#ddd",
              borderRadius: "15px",
            }}
          >
            <h5 className="border-bottom pb-2">Chat</h5>

            {/* Chat Messages */}
            <div className="chat-messages flex-grow-1 p-2 overflow-auto">
              {/* Date Timestamp */}
              <div className="text-muted text-center small mb-2">
                Feb 6, 14:10
              </div>

              {/* Right-aligned Message (You) */}
              <div className="d-flex flex-column align-items-end mb-2">
                <div
                  className="message-box text-black p-2 rounded"
                  style={{
                    backgroundColor: "#d3d3d3", // Light gray for You
                    maxWidth: "75%",
                    fontSize: "12px",
                  }}
                >
                  Hey! How's it going?
                </div>
              </div>

              {/* Left-aligned Message (User 1) */}
              <div className="d-flex align-items-start mb-2">
                <img
                  src={user1Image}
                  className="rounded-circle me-2"
                  alt="User 1"
                  style={{ width: "50px", height: "50px" }}
                />
                <div>
                  <div
                    className="message-box p-2 rounded"
                    style={{
                      backgroundColor: "#b0b0b0", // Slightly darker gray for User 1
                      maxWidth: "75%",
                      fontSize: "12px",
                    }}
                  >
                    Hey! I'm good, just working on a project. What about you?
                  </div>
                </div>
              </div>

              {/* Right-aligned Message (You) */}
              <div className="d-flex flex-column align-items-end mb-2">
                <div
                  className="message-box text-black p-2 rounded"
                  style={{
                    backgroundColor: "#d3d3d3", // Light gray for You
                    maxWidth: "75%",
                    fontSize: "12px",
                  }}
                >
                  That sounds cool! I'm just chilling right now.
                </div>
              </div>

              {/* Left-aligned Message (User 2) */}
              <div className="d-flex align-items-start mb-2">
                <img
                  src={user2Image}
                  className="rounded-circle me-2"
                  alt="User 2"
                  style={{ width: "50px", height: "50px" }}
                />
                <div>
                  <div
                    className="message-box p-2 rounded"
                    style={{
                      backgroundColor: "#9e9e9e", // Medium gray for User 2
                      maxWidth: "75%",
                      fontSize: "12px",
                    }}
                  >
                    Nice! Did you finish that book you were reading?
                  </div>
                </div>
              </div>

              {/* Right-aligned Message (You) */}
              <div className="d-flex flex-column align-items-end mb-2">
                <div
                  className="message-box text-black p-2 rounded"
                  style={{
                    backgroundColor: "#d3d3d3", // Light gray for You
                    maxWidth: "75%",
                    fontSize: "12px",
                  }}
                >
                  Almost! I have a few chapters left.
                </div>
              </div>

              {/* Left-aligned Message (User 3) */}
              <div className="d-flex align-items-start mb-2">
                <img
                  src={user3Image}
                  className="rounded-circle me-2"
                  alt="User 3"
                  style={{ width: "50px", height: "50px" }}
                />
                <div>
                  <div
                    className="message-box p-2 rounded"
                    style={{
                      backgroundColor: "#8c8c8c", // Darker gray for User 3
                      maxWidth: "75%",
                      fontSize: "12px",
                    }}
                  >
                    That's awesome! What's it about?
                  </div>
                </div>
              </div>

              {/* Right-aligned Message (You) */}
              <div className="d-flex flex-column align-items-end mb-2">
                <div
                  className="message-box text-black p-2 rounded"
                  style={{
                    backgroundColor: "#d3d3d3", // Light gray for You
                    maxWidth: "75%",
                    fontSize: "12px",
                  }}
                >
                  It's a mystery novel, lots of twists and turns!
                </div>
              </div>

              {/* Left-aligned Message (User 4) */}
              <div className="d-flex align-items-start mb-2">
                <img
                  src={user4Image}
                  className="rounded-circle me-2"
                  alt="User 4"
                  style={{ width: "50px", height: "50px" }}
                />
                <div>
                  <div
                    className="message-box p-2 rounded"
                    style={{
                      backgroundColor: "#7f7f7f", // Even darker gray for User 4
                      maxWidth: "75%",
                      fontSize: "12px",
                    }}
                  >
                    Sounds interesting! You'll have to tell me about it once
                    you're done.
                  </div>
                </div>
              </div>

              {/* Right-aligned Message (You) */}
              <div className="d-flex flex-column align-items-end mb-2">
                <div
                  className="message-box text-black p-2 rounded"
                  style={{
                    backgroundColor: "#d3d3d3", // Light gray for You
                    maxWidth: "75%",
                    fontSize: "12px",
                  }}
                >
                  Definitely! Maybe I'll lend it to you if you want to read it.
                </div>
              </div>

              {/* Left-aligned Message (User 2) */}
              <div className="d-flex align-items-start mb-2">
                <img
                  src={user2Image}
                  className="rounded-circle me-2"
                  alt="User 2"
                  style={{ width: "50px", height: "50px" }}
                />
                <div>
                  <div
                    className="message-box p-2 rounded"
                    style={{
                      backgroundColor: "#9e9e9e", // Medium gray for User 2
                      maxWidth: "75%",
                      fontSize: "12px",
                    }}
                  >
                    That would be great! Let me know when you're done.
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Input Field */}
            <div
              className="chat-input d-flex align-items-center mt-2 p-2 rounded"
              style={{ background: "#f8f8f8" }}
            >
              <input
                type="text"
                className="form-control border-0 bg-transparent"
                placeholder="Say something"
                style={{ outline: "none" }}
              />
              <button className="btn btn-dark rounded-circle ms-2">
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>

          {/* Group Section */}
          <div
            className={`${
              showExtraSection ? "col-md-7" : "col-md-9"
            } d-flex flex-column`}
            style={{ height: "100%" }}
          >
            <div
              className="card p-3 mb-3 border rounded d-flex"
              style={{ borderColor: "#ddd", borderRadius: "12px" }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1">{title}</h6>
                  <span
                    className="text-muted d-flex align-items-center"
                    style={{ fontSize: "14px" }}
                  >
                    <i className={`fas ${selectIcon} me-1`}></i>{" "}
                    {selectedPrivacy}
                  </span>
                </div>
                <button
                  className="btn btn-link text-dark p-0"
                  onClick={toggleExtraSection}
                >
                  <i className="fas fa-ellipsis-v"></i>
                </button>
              </div>
            </div>

            {/* Speakers & Listeners */}
            <div
              className="card p-3 border rounded flex-grow-1 overflow-auto"
              style={{ borderColor: "#ddd" }}
            >
              <h6>Speakers</h6>
              <div className="d-flex gap-3 align-items-center">
                {speakers.map((user, index) => (
                  <div key={index} className="text-center">
                    <div className="position-relative">
                      <img
                        src={user.img}
                        alt={user.name}
                        className="rounded-circle"
                        style={{
                          width: "100px",
                          height: "100px",
                          position: "relative",
                        }}
                      />
                      {/* Mic Icon - Positioned at Bottom-Right Inside Image */}
                      <i
                        className={`fas ${
                          user.micOn ? "fa-microphone" : "fa-microphone-slash"
                        } position-absolute`}
                        style={{
                          bottom: "5px",
                          right: "5px",
                          fontSize: "16px",
                          color: user.micOn ? "green" : "red",
                          background: "#fff",
                          borderRadius: "50%",
                          padding: "5px",
                          boxShadow: "0 0 5px rgba(0,0,0,0.3)",
                        }}
                      ></i>
                    </div>
                    <p>{user.name}</p>
                  </div>
                ))}
              </div>

              <h6>Listeners</h6>
              <div className="d-flex gap-3 flex-wrap">
                {listeners.map((user, index) => (
                  <div key={index} className="text-center  position-relative">
                    <div className="position-relative">
                      <img
                        src={user.img}
                        alt={user.name}
                        className="rounded-circle"
                        style={{
                          width: "100px",
                          height: "100px",
                          position: "relative",
                        }}
                      />
                      {/* Mic Icon - Positioned at Bottom-Right Inside Image */}
                      <i
                        className={`fas ${
                          user.micStatus
                            ? "fa-microphone"
                            : "fa-microphone-slash"
                        } position-absolute`}
                        style={{
                          bottom: "5px",
                          right: "5px",
                          fontSize: "16px",
                          color: user.micStatus ? "green" : "red",
                          background: "#fff",
                          borderRadius: "50%",
                          padding: "5px",
                          boxShadow: "0 0 5px rgba(0,0,0,0.3)",
                        }}
                      ></i>
                    </div>
                    <p>{user.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mute & Raise Hand Buttons */}
            <div
              className="d-flex justify-content-center gap-3 mt-1"
              style={{ borderColor: "#ddd", background: "#fff" }}
            >
              <div className="d-flex flex-column align-items-center">
                <button
                  className="btn btn-light rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: "60px", height: "60px", borderColor: "#ddd" }}
                  onClick={toggleMic}
                >
                  <i className="fas fa-microphone-slash"></i>
                </button>
                <p
                  className="mt-2 mb-0 text-center"
                  style={{ fontSize: "14px" }}
                >
                  Mute
                </p>
              </div>

              <div className="d-flex flex-column align-items-center">
                <button
                  className="btn btn-light rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: "60px", height: "60px", borderColor: "#ddd" }}
                >
                  <i className="fas fa-hand-paper"></i>
                </button>
                <p
                  className="mt-2 mb-0 text-center"
                  style={{ fontSize: "14px" }}
                >
                  Raise Hand
                </p>
              </div>
            </div>
          </div>
          {/* Extra Section (Visible when toggled) */}
          {showExtraSection && (
            <div
              className="col-md-2 p-3 border rounded bg-white d-flex flex-column"
              style={{
                height: "100%", // Ensure full height usage
                borderColor: "#ddd",
                borderRadius: "15px",
              }}
            >
              {/* Title Section with Close Button */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold">Group Details</h5>
                {/* Close Button (Cancel Icon) */}
                <button
                  className="btn btn-sm btn-light"
                  style={{
                    borderRadius: "50%",
                    padding: "0.2rem 0.4rem",
                  }}
                  onClick={() => setShowExtraSection(false)} // Close the section
                >
                  <i className="fas fa-times"></i> {/* Font Awesome "X" Icon */}
                </button>
              </div>

              {/* Title Input */}
              <input
                type="text"
                className="form-control mb-3"
                placeholder="add a title (optional)"
              />

              {/* Separate Section for "Allow in-room chat" */}
              <div className="list-group mb-3 flex-grow-1">
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  allow in-room chat
                  <div className="form-check form-switch m-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={allowChat}
                      onChange={() => setallowChat(!allowChat)}
                    />
                  </div>
                </div>
              </div>

              {/* Second Section: Pinned Link, Background Music, etc. */}
              <div className="list-group mb-3 flex-grow-1">
                <button className="list-group-item list-group-item-action">
                  pinned link
                </button>
                <button className="list-group-item list-group-item-action">
                  background music
                </button>
                <button className="list-group-item list-group-item-action">
                  hand raising
                </button>
                <button className="list-group-item list-group-item-action">
                  mute all other speakers
                </button>
              </div>

              {/* Third Section: Search & Share */}
              <div className="list-group mb-3 d-flex flex-grow-1">
                <button className="list-group-item flex-fill text-start">
                  <i className="fas fa-search me-2"></i> search
                </button>
                <button className="list-group-item flex-fill text-start">
                  <i className="fas fa-share me-2"></i> share
                </button>
              </div>

              {/* End Button */}
              <button
                className="btn btn-danger text-white w-100 mt-auto"
                style={{
                  borderRadius: "10px",
                  padding: "10px",
                  fontSize: "16px",
                }}
              >
                End
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Chatroom;
