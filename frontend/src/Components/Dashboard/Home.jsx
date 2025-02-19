import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import NavBar from "./NavBar";
import LeftSidebar from "./LeftSideBar";
import RigthSideBar from "./RigthSideBar";
import Feed from "./Feed";
import axios from "axios";

// Function to fetch country details from localStorage
const getCountryDetails = async (countryCode) => {
  try {
    const storedCountries = JSON.parse(localStorage.getItem("geo_country")) || [];

    const countryData = storedCountries.find(
      (country) => country.code.toLowerCase() === countryCode.toLowerCase()
    );

    if (!countryData) return { flag: "/default-flag.png", name: "Unknown", code: countryCode };

    return {
      flag: countryData.country_image || "/default-flag.png",
      name: countryData.country_name,
      code: countryData.code,
    };
  } catch (error) {
    console.log("Error fetching country details:", error);
    return { flag: "/default-flag.png", name: "Unknown", code: countryCode };
  }
};

const Home = () => {
  const { countryCode } = useParams(); // Get country code from URL
  const location = useLocation(); // Get current path
  const isWorld = location.pathname === "/world";
  const isDashboard = location.pathname === "/dashboard";

  const [userCountry, setUserCountry] = useState(""); // Store user’s country code
  const [currentCountry, setCurrentCountry] = useState({
    code: "",
    name: "",
    flag: "",
  });

  // // Fetch user country from API
  // const fetchUserData = async () => {
  //   const token = localStorage.getItem("api_token");
  //   if (!token) return;

  //   try {
  //     const res = await axios.get("https://develop.quakbox.com/admin/api/user", {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });

  //     const userDetails = res.data.user_details;
  //     const defaultCountryCode = userDetails.country;
  //     setUserCountry(defaultCountryCode); // Store user’s country

  //     localStorage.setItem("user_country", defaultCountryCode); // Store in localStorage
  //     localStorage.setItem("user_Id", res.data.users.id);
  //   } catch (error) {
  //     console.log("Error fetching user data:", error);
  //   }
  // };

  // Update country details based on the URL (including refresh handling)
  useEffect(() => {
    const updateCountryDetails = async (code) => {
      const countryDetails = await getCountryDetails(code);
      setCurrentCountry({
        code: code,
        name: countryDetails.name,
        flag: countryDetails.flag,
      });

      localStorage.setItem("selected_country", JSON.stringify(countryDetails)); // Store last selected country
    };

    const storedCountry = JSON.parse(localStorage.getItem("selected_country"));

    if (isWorld) {
      updateCountryDetails("99"); // World View
    } else if (isDashboard) {
      const storedUserCountry = localStorage.getItem("user_country") 
      updateCountryDetails(storedUserCountry);
    } else if (countryCode) {
      updateCountryDetails(countryCode);
    } else if (storedCountry) {
      setCurrentCountry(storedCountry); // Load last selected country on refresh
    }
  }, [countryCode, isWorld, isDashboard]);

  // useEffect(() => {
  //   fetchUserData();
  // }, []);

  return (
    <div className="app">
      <NavBar />
      <div>
        <LeftSidebar
          countryCode={currentCountry.code}
          flag={currentCountry.flag}
          countryName={currentCountry.name}
        />
        <Feed
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
    </div>
  );
};

export default Home;
