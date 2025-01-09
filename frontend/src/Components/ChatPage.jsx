import React from "react";

const ChatPage = () => {
  const chats = [
    {
      name: "Kullachi Kutti ❤️",
      message: "😉",
      time: "06/01/2025",
      isPinned: true,
      unread: false,
    },
    {
      name: "Airtel Finance",
      message: "Account update! You’re pre-approved...",
      time: "14:59",
      unread: false,
    },
    {
      name: "KBNBFC",
      message: "Dear BOOPATHY BHARATHKUMAR...",
      time: "14:47",
      unread: false,
    },
    {
      name: "Airtel Care",
      message: "Bill payment reminder: To avoid call &...",
      time: "11:50",
      unread: false,
    },
    {
      name: "PRR CASUAL TEAM",
      message: "~ PRR TRAVELS RECEIVABLE:",
      time: "",
      unread: true,
    },
    {
      name: "Selva Kumar Jio",
      message: "Hmm",
      time: "",
      unread: false,
    },
  ];
  return (
    <div className="container-fluid bg-light vh-100 overflow-auto">
      {/* Header */}
      <div className="row py-2 px-3 bg-white border-bottom sticky-top">
        <div className="col-9">
          <h5 className="m-0">WhatsApp</h5>
        </div>
        <div className="col-3 text-end">
          <i className="bi bi-search me-3"></i>
          <i className="bi bi-three-dots-vertical"></i>
        </div>
      </div>

      {/* Chat List */}
      <div className="row p-3">
        {chats.map((chat, index) => (
          <div
            key={index}
            className="col-12 mb-3 d-flex align-items-center border-bottom pb-2"
          >
            {/* Profile Image */}
            <img
              src="https://via.placeholder.com/50"
              alt={`${chat.name} profile`}
              className="rounded-circle me-3"
              style={{ width: "50px", height: "50px" }}
            />
            {/* Chat Info */}
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between">
                <h6
                  className="mb-1 text-truncate"
                  style={{ maxWidth: "200px" }}
                >
                  {chat.name}
                </h6>
                <span className="text-muted small">{chat.time}</span>
              </div>
              <p
                className="mb-0 text-muted small text-truncate"
                style={{ maxWidth: "200px" }}
              >
                {chat.message}
              </p>
            </div>
            {/* Unread Badge */}
            {chat.unread && <span className="badge bg-primary">1</span>}
          </div>
        ))}
      </div>
    </div>
  );
};  

export default ChatPage;
