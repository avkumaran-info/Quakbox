import React from "react";
import NavBar from "./NavBar";
import RigthSideBar from "./RigthSideBar";
import Feed from "./Feed";
import Footer from "./Footer";
import LeftSidebar from "./LeftSideBar";
import { useLocation, useParams } from "react-router-dom";

const Home = () => {
  const { countryCode } = useParams(); // Get the country code from the URL
  const location = useLocation(); // Get the flag image from the location state
  const { flag, countryName } = location.state || {};

  return (
    <>
      <div className="app">
        <NavBar />
        <div className="container-fluid mt-4">
          <LeftSidebar countryCode={countryCode} flag={flag} countryName={countryName}/>
          <Feed countryCode={countryCode} flag={flag} countryName={countryName}/>
          <RigthSideBar countryCode={countryCode} flag={flag} countryName={countryName}/>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Home;
