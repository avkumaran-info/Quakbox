import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import RigthSideBar from "./RigthSideBar";
import Feed from "./Feed";
import Footer from "./Footer";
import LeftSidebar from "./LeftSideBar";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// Function to fetch country details
const getCountryDetails = async (countryCode) => {
  try {
    const response = await axios.get(
      // "https://restcountries.com/v3.1/all"
      "https://develop.quakbox.com/admin/api/get_geo_country"
    );
    // console.log(response.data);
    // console.log(response.data.geo_countries);

    const countryData = response.data.geo_countries.find(
      (country) => country.code.toLowerCase() === countryCode.toLowerCase()
    );
    // console.log(countryData);

    if (!countryData) return { flag: "/default-flag.png", name: "Unknown" };
    return {
      flag: countryData.country_image || "/default-flag.png",
      name: countryData.country_name,
    };
  } catch (error) {
    console.log("Error fetching country details:", error);
    return { flag: "/default-flag.png", name: "Unknown" };
  }
};

const Home = () => {
  const { countryCode } = useParams(); // Get the country code from the URL
  const location = useLocation(); // Get the flag image and country name from the location state
  const { flag, countryName } = location.state || {};
  const navigate = useNavigate(); // Navigate to change URL and country details

  const [userData, setUserData] = useState(null);
  const [currentCountry, setCurrentCountry] = useState({
    code: countryCode || "IN", // Default country code to "IN"
    name: countryName || "India", // Default country name to "India"
    flag: flag || "/default-flag.png", // Default country flag
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
      const userDetails = res.data.user_details;

      const defaultCountryCode = userDetails.country; // Default to IN if no country code is present

      const countryDetails = await getCountryDetails(defaultCountryCode);

      setUserData({
        name: userDetails.name,
        email: userDetails.email,
        defaultCountry: {
          code: defaultCountryCode,
          name: userDetails.country_name || "India",
          flag: countryDetails.flag,
        },
        availableCountries: userDetails.available_countries || [],
      });

      setCurrentCountry({
        code: defaultCountryCode,
        name: userDetails.country_name || "India",
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
    if (countryCode) {
      const updateCountryDetails = async () => {
        const countryDetails = await getCountryDetails(countryCode);
        setCurrentCountry({
          code: countryCode,
          name: countryDetails.name,
          flag: countryDetails.flag,
        });
      };
      updateCountryDetails();
    }
  }, [countryCode]);

  // if (!userData || !currentCountry) {
  //   return <div>Loading...</div>;
  // }

  // Handle logo click to navigate to dashboard and pass default country details
  const handleLogoClick = () => {
    navigate("/dashboard", {
      state: {
        flag: currentCountry.flag,
        countryName: currentCountry.name,
        countryCode: currentCountry.code,
      },
    });
    window.location.reload();
  };

  // const handleWorldClick = () => {
  //   navigate("/world", {
  //     state: {
  //       flag: currentCountry.flag,
  //       countryName: currentCountry.name,
  //       countryCode: currentCountry.code,
  //     },
  //   });
  //   window.location.reload();
  // };

  // Handle country change
  const handleCountryChange = async (newCountryCode) => {
    console.log(newCountryCode);

    const countryDetails = await getCountryDetails(newCountryCode);
    // console.log(countryDetails);

    setCurrentCountry({
      code: newCountryCode,
      name: countryDetails.name,
      flag: countryDetails.flag,
    });

    // console.log(newCountryCode);

    if (newCountryCode !== "99") {
      // Update the URL to reflect the new country
      navigate(`/country/${newCountryCode.toLowerCase()}`, {
        state: { flag: countryDetails.flag, countryName: countryDetails.name },
      });
    } else {
      navigate(`/world`, {
        state: { flag: countryDetails.flag, countryName: countryDetails.name },
      });
    }
  };

  return (
    <div className="app">
      <NavBar
        currentCountry={currentCountry}
        handleLogoClick={handleLogoClick} // Pass the function to NavBar
        handleCountryChange={handleCountryChange} // Pass country change handler
        // handleWorldClick={handleWorldClick}
      />
      <div className="container-fluid mt-4">
        <LeftSidebar
          countryCode={currentCountry.code}
          flag={currentCountry.flag}
          countryName={currentCountry.name}
          handleCountryChange={handleCountryChange} // Pass to LeftSidebar
          // handleWorldClick={handleWorldClick}
        />
        <Feed
          userData={userData}
          countryCode={currentCountry.code}
          flag={currentCountry.flag}
          countryName={currentCountry.name}
          handleCountryChange={handleCountryChange} // Pass to Feed
          // handleWorldClick={handleWorldClick}
        />
        <RigthSideBar
          countryCode={currentCountry.code}
          flag={currentCountry.flag}
          countryName={currentCountry.name}
          handleCountryChange={handleCountryChange} // Pass to RigthSideBar
          // handleWorldClick={handleWorldClick}
        />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
