import React from "react";

const LeftSidebar = ({ friends, onFriendClick }) => {
  return (
    <div
      className="col-3 bg-light position-fixed d-none d-md-block mt-4"
      style={{
        top: "60px", // Height of the topbar
        left: "0",
      }}
    >
      <div className="card">
        {/* Header */}
        <div className="card-header bg-primary text-white">
          <h6 className="mb-0">Friends</h6>
        </div>

        {/* Friend Items */}
        <div className="card-body">
          {friends.map((friend) => (
            <div
              key={friend.id}
              className="d-flex align-items-center mb-2 cursor-pointer"
              style={{ cursor: "pointer" }}
              onClick={() => onFriendClick(friend)}
            >
              <img
                src={friend.image}
                alt={friend.name}
                className="rounded-circle"
                style={{ width: "50px", height: "50px", objectFit: "cover" }}
              />
              <div className="ms-2">
                <h6 className="mb-0">{friend.name}</h6>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
