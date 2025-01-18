import React from "react";
import NavBar from "./NavBar";
import Feed from "./Feed";
import Footer from "./Footer";
import user1 from "../../assets/images/user1.png";
import user2 from "../../assets/images/user2.jpg";
import user3 from "../../assets/images/vector-users-icon.jpg";
import p1 from "../../assets/images/images (1).jpeg";
import p2 from "../../assets/images/images.jpeg";
import p3 from "../../assets/images/images1.jpeg";
import Left from "./Left";
import Rigth from "./Rigth";

const TestHome = () => {
  return (
    <>
      <div className="app">
        <NavBar />
        <div className="container-fluid mt-4">
          <Left
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
          <Rigth />
          <Footer />
        </div>
      </div>
    </>
  );
};

export default TestHome;
