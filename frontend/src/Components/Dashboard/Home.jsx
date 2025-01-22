import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import RigthSideBar from "./RigthSideBar";
import Feed from "./Feed";
import Footer from "./Footer";
import LeftSidebar from "./LeftSideBar";
import user1 from "../../assets/images/user1.png";
import user2 from "../../assets/images/user2.jpg";
import user3 from "../../assets/images/vector-users-icon.jpg";
import p1 from "../../assets/images/images (1).jpeg";
import p2 from "../../assets/images/images.jpeg";
import p3 from "../../assets/images/images1.jpeg";
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
        <div className="container-fluid mt-4">
          <LeftSidebar
            news={[
              {
                image: p1,
                title: "Polities News",
                description: "Short summary of the news",
                longDescription:
                  "A more detailed description of the news that spans multiple lines.",
              },
              {
                image: p2,
                title: "Sports News",
                description: "Short summary of the news",
                longDescription:
                  "A more detailed description of the news that spans multiple lines.",
              },
              {
                image: p3,
                title: "Business News",
                description: "Short summary of the news",
                longDescription:
                  "A more detailed description of the news that spans multiple lines.",
              },
              {
                image: user1,
                title: "Health News",
                description: "Short summary of the news",
                longDescription:
                  "A more detailed description of the news that spans multiple lines.",
              },
            ]}
            photos={[
              {
                image: user1,
                title: "Amazing Photo",
                description: "Short summary of the photo",
                longDescription:
                  "A more detailed explanation or story behind the photo.",
              },
              {
                image: user3,
                title: "Amazing Photo",
                description: "Short summary of the photo",
                longDescription:
                  "A more detailed explanation or story behind the photo.",
              },
            ]}
            videos={[
              {
                image: user2,
                title: "Amazing Photo",
                description: "Short summary of the photo",
                longDescription:
                  "A more detailed explanation or story behind the photo.",
              },
              {
                image: user1,
                title: "Amazing Photo",
                description: "Short summary of the photo",
                longDescription:
                  "A more detailed explanation or story behind the photo.",
              },
            ]}
          />
          <Feed />
          <RigthSideBar />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Home;
