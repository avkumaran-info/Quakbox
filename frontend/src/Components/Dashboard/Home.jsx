import React, { useContext, useEffect, useState } from "react";
import NavBar from "./NavBar";
import RigthSideBar from "./RigthSideBar";
import Feed from "./Feed";
import Footer from "./Footer";
import LeftSidebar from "./LeftSideBar";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../../Context/StoreContext";

// Function to fetch country details
const getCountryDetails = async (countryCode) => {
  try {
    const storedCountries =
      JSON.parse(localStorage.getItem("geo_country")) || [];

    const countryData = storedCountries.find(
      (country) => country.code.toLowerCase() === countryCode.toLowerCase()
    );
    // console.log(countryData);

    if (!countryData) return { flag: "/default-flag.png", name: "Unknown" };

    return {
      flag: countryData.country_image || "/default-flag.png",
      name: countryData.country_name,
      code: countryData.code,
    };
  } catch (error) {
    console.log("Error fetching country details:", error);
    return { flag: "/default-flag.png", name: "Unknown" };
  }
};

const Home = () => {
  const { countryCode } = useParams();
  const { userData } = useContext(StoreContext);

  const location = useLocation(); // Get the flag image and country name from the location state
  const isWorld = location.pathname === "/world";
  const { flag, countryName } = location.state || {};
  const [userCountry, setUserCountry] = useState("");
  const [currentCountry, setCurrentCountry] = useState({
    code: countryCode,
    name: countryName,
    flag: flag,
  });

  // Fetch user data
  const userDataFetch = async () => {
    const token = localStorage.getItem("api_token");
    if (!token) return;

    try {
      const res = await axios.get(
        "https://develop.quakbox.com/admin/api/user",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserCountry(res.data.user_details.country);
      localStorage.setItem("user_Id", res.data.users.id);
      const userDetails = res.data.user_details;
      const defaultCountryCode = userDetails.country; // Default to IN if no country code is present
      const countryDetails = await getCountryDetails(defaultCountryCode);

      setCurrentCountry({
        code: defaultCountryCode,
        name: userDetails.country_name,
        flag: countryDetails.flag,
      });
    } catch (error) {
      console.log("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    userDataFetch();
  }, []);

  useEffect(() => {
    const updateCountryDetails = async (code) => {
      const countryDetails = await getCountryDetails(code);
      setCurrentCountry({
        code,
        name: countryDetails.name,
        flag: countryDetails.flag,
      });
    };

    if (isWorld) {
      updateCountryDetails("99"); // World View
    } else if (countryCode) {
      updateCountryDetails(countryCode); // Selected Country
    } else {
      updateCountryDetails(userCountry); // Default Country (India)
    }
  }, [countryCode, location]);

  return (
    <div className="app">
      <NavBar />
      {/* <div className="container-fluid mt-4"> */}
      <div>
        <LeftSidebar
          countryCode={currentCountry.code}
          flag={currentCountry.flag}
          countryName={currentCountry.name}
        />
        <Feed
          // userData={userData}
          countryCode={currentCountry.code}
          flag={currentCountry.flag}
          countryName={currentCountry.name}
        />
        <RigthSideBar
          countryCode={currentCountry.code}
          flag={currentCountry.flag}
          countryName={currentCountry.name}
        />
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default Home;
