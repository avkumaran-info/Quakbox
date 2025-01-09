import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import RigthSideBar from "./RigthSideBar";
import Feed from "./Feed";
import Footer from "./Footer";
import LeftSidebar from "./LeftSideBar";
import user1 from "../../assets/images/user1.png";
import user2 from "../../assets/images/user2.jpg";
import user3 from "../../assets/images/vector-users-icon.jpg";
import ChatWindow from "./ChatWindow";

const Home = () => {
  const [friends, setFriends] = useState([
    {
      id: 1,
      name: "Kumaran",
      image: user3,
      chatHistory: [
        { sender: "Kumaran", text: "Hello, how are you?" },
        { sender: "You", text: "Fine, what about you?" },
        { sender: "Kumaran", text: "Very cool!" },
        { sender: "You", text: "Have a nice day!" },
        { sender: "Kumaran", text: "Thank you!" },
        { sender: "Kumaran", text: "Hello!" },
      ],
    },
    { id: 2, name: "Atul Ambore", image: user2, chatHistory: [] },
    { id: 3, name: "Bharathi", image: user1, chatHistory: [] },
  ]);

  const [selectedFriend, setSelectedFriend] = useState(null);

  const handleSendMessage = (friendId, newMessage) => {
    setFriends((prevFriends) =>
      prevFriends.map((friend) =>
        friend.id === friendId
          ? {
              ...friend,
              chatHistory: [...friend.chatHistory, newMessage],
            }
          : friend
      )
    );
  };

  return (
    <>
      <div className="app">
        <NavBar />
        <div className="d-flex justify-content-between mt-5">
          <div
            className="col-3 bg-light position-fixed d-none d-md-block mt-4"
            style={{
              top: "60px", // Height of the topbar
              left: "0",
            }}
          >
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h5>Friends</h5>
              </div>
              <ul className="list-group list-group-flush">
                {friends.map((friend) => (
                  <li
                    key={friend.id}
                    className={`list-group-item ${
                      selectedFriend?.id === friend.id ? "active" : ""
                    }`}
                    onClick={() => setSelectedFriend(friend)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex align-items-center">
                      <img
                        src={friend.image}
                        alt={friend.name}
                        className="rounded-circle me-2"
                        style={{
                          width: "40px",
                          height: "40px",
                          objectFit: "cover",
                        }}
                      />
                      <span>{friend.name}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Chat Window */}
          <>
            {selectedFriend ? (
              <ChatWindow
                selectedFriend={selectedFriend}
                onSendMessage={(newMessage) =>
                  handleSendMessage(selectedFriend.id, newMessage)
                }
              />
            ) : (
              <Feed />
            )}
          </>
          <RigthSideBar />
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Home;
