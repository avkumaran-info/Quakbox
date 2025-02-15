import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [userData, setUserData] = useState(null);
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
      //   console.log(res.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []); // Runs once when the app loads

  // Function to update userData and store it in localStorage after login
  const updateUserData = (data) => {
    localStorage.setItem("user_Details", JSON.stringify(data));
    setUserData(data);
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading state while fetching data
  }

  const contextValue = { userData, setUserData: updateUserData, fetchUserData };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
