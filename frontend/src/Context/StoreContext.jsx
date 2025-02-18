import axios from "axios";
import { createContext, useEffect, useState } from "react";

// CSS for the spinner (can be moved to a separate CSS file if preferred)
const spinnerStyle = {
  width: "40px",
  height: "40px",
  border: "5px solid #f3f3f3", // Light gray
  borderTop: "5px solid #3498db", // Blue
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
};

// CSS to center the spinner
const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh", // Full viewport height
  textAlign: "center",
};

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [userData, setUserData] = useState(null);
  const [favCountries, setFavCountries] = useState([]);
  const [fanCountries, setFanCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user data when needed
  const fetchUserData = async () => {
    const token = localStorage.getItem("api_token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        "https://develop.quakbox.com/admin/api/user",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      localStorage.setItem("user_Details", JSON.stringify(res.data));
      setUserData(res.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch favorite and fan countries
  const fetchCountries = async () => {
    const token = localStorage.getItem("api_token"); // Get token from localStorage
    if (!token) {
      console.error("Authorization token not found. Please log in.");
      return;
    }
    try {
      const favCountriesRes = await axios.get(
        "https://develop.quakbox.com/admin/api/get_favourite_country",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Filter countries
      const favouriteCountries = favCountriesRes.data.favourite_country.filter(
        (country) => country.favourite_country === "1"
      );

      const fanCountriesOnly = favCountriesRes.data.favourite_country.filter(
        (country) =>
          country.favourite_country === "1" || country.favourite_country === "0"
      );

      // Use a Set to filter out duplicates based on the country code
      const uniqueCountries = [
        ...new Map(
          fanCountriesOnly.map((country) => [country.code, country])
        ).values(),
      ];

      // Update state
      setFavCountries(favouriteCountries || []);
      setFanCountries(uniqueCountries || []);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  useEffect(() => {
    console.log("Fetching user data...");
    fetchUserData();
    fetchCountries();
  }, []);

  // Function to update userData and store it in localStorage after login
  const updateUserData = (data) => {
    localStorage.setItem("user_Details", JSON.stringify(data));
    setUserData(data);
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={spinnerStyle}></div>
      </div>
    );
  }

  const contextValue = {
    userData,
    setUserData: updateUserData,
    fetchUserData,
    favCountries,
    fanCountries,
    fetchCountries,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
