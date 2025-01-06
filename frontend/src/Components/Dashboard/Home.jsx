import React from "react";
import NavBar from "./NavBar";
import LeftSideBar from "./LeftSideBar";
import RigthSideBar from "./RigthSideBar";
import Feed from "./Feed";
import Footer from "./Footer";
const Home = () => {
  return (
    <>
      <div className="app">
        <NavBar />
        <div className="d-flex justify-content-between mt-5">
          <LeftSideBar />
          <Feed />
          <RigthSideBar />
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Home;
