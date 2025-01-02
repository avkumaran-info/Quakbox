import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;
//   console.log(location);
//   console.log(user);
  
  

  if (!user) {
    // Redirect back to login if no user data is passed
    navigate("/");
    return null;
  }

  const handleLogout = async () => {
    localStorage.clear(); // Clear any stored user data
    navigate("/", { replace: true }); // Redirect to the login page
    try {
      const response = await axios.post('https://develop.quakbox.com/admin/api/logout');
  
      localStorage.clear(); // Clear any stored user data
      navigate("/", { replace: true }); // Redirect to the login page
    } catch (error) {
      // Handle errors
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error('Error Response:', error.response.data);
      }
    }
  };
  return (
    <div>
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>Welcome, {user.name}</h1>
        <p>Email: {user.email}</p>
        <p>Family Name: {user.family_name}</p>
        <p>Given Name: {user.given_name}</p>
        <img
          src={user.picture}
          alt="Profile"
          style={{ borderRadius: "50%", marginTop: "20px" }}
        />
        <button  className="btn btn-danger w-100 mt-3" onClick={handleLogout}>LogOut</button>
      </div>
    </div>
  );
};

export default Dashboard;
