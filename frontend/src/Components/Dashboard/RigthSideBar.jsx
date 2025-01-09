import React, { useState } from "react";

import user1 from "../../assets/images/user1.png";
import user2 from "../../assets/images/user2.jpg";
import user3 from "../../assets/images/vector-users-icon.jpg";

const RightSidebar = () => {
  const [friendRequests, setFriendRequests] = useState([
    { id: 1, name: "Ajith", image: user3 },
    { id: 2, name: "Magesh", image: user2 },
    { id: 3, name: "Vijay", image: user1 },
  ]);

  const handleAccept = (id) => {
    alert(`Friend request from ${friendRequests.find((f) => f.id === id).name} accepted!`);
    setFriendRequests(friendRequests.filter((request) => request.id !== id));
  };

  const handleReject = (id) => {
    alert(`Friend request from ${friendRequests.find((f) => f.id === id).name} rejected!`);
    setFriendRequests(friendRequests.filter((request) => request.id !== id));
  };

  return (
    <div
      className="col-3 bg-light position-fixed d-none d-md-block mt-4"
      style={{
        height: "100vh",
        top: "56px", // Height of the topbar
        right: "0",
      }}
    >
      <div className="card bg-light p-3">
        {/* Partners Section */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="mb-0">Partners</h6>
          <button className="btn btn-primary btn-sm">Quak</button>
        </div>
        <p className="mb-3">0</p>
        <hr />
        <button className="btn btn-primary w-100">See More</button>
        <hr />
        {/* Friend Requests Section */}
        <div className="bg-light p-2 rounded">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="mb-0">Friend Requests</h6>
            <a href="#find-friend">Find Friend</a>
          </div>

          <div className="card-body">
            {friendRequests.length > 0 ? (
              friendRequests.map((friend) => (
                <div
                  key={friend.id}
                  className="d-flex align-items-center justify-content-between mb-2"
                >
                  <div className="d-flex align-items-center">
                    <img
                      src={friend.image}
                      alt={friend.name}
                      className="rounded-circle"
                      style={{
                        width: "40px",
                        height: "40px",
                        objectFit: "cover",
                      }}
                    />
                    <div className="ms-2">
                      <h6 className="mb-0">{friend.name}</h6>
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleAccept(friend.id)}
                    >
                      Accept
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleReject(friend.id)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No new friend requests.</p>
            )}
          </div>

          {friendRequests.length > 0 && (
            <a href="#show-all-friends" className="text-decoration-none">
              Show All Friends
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
