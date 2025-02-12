import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../Dashboard/NavBar";
import QSidebar from "./QSidebar";
import loading from "../../assets/images/loading.gif"; // Import loading GIF

const MySubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch subscriptions
  const fetchSubscriptions = async (search = "") => {
    try {
      const token = localStorage.getItem("api_token");
      if (!token) {
        console.error("❌ Authorization token missing. Please log in.");
        return;
      }

      // Use the search API if there's a query, otherwise, fetch all
      const url = search
        ? `https://develop.quakbox.com/admin/api/videos/search-mysubscriptions?search=${search}`
        : "https://develop.quakbox.com/admin/api/videos/mysubscriptions";

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200 && response.data.data) {
        setSubscriptions(response.data.data);
      } else {
        console.error("⚠️ No subscriptions found.");
        setSubscriptions([]);
      }
    } catch (error) {
      console.error("❌ Error fetching subscriptions:", error);
      setSubscriptions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch subscriptions on mount
  useEffect(() => {
    fetchSubscriptions();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Trigger search when clicking "Go" button
  const handleSearch = () => {
    setIsLoading(true);
    fetchSubscriptions(searchQuery);
  };

  return (
    <>
      <NavBar />

      <div className="flex">
        {/* Sidebar */}
        <QSidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Main Content */}
        <div
          className="transition-all duration-300 p-4"
          style={{
            marginRight: sidebarOpen ? "250px" : "0px",
            width: sidebarOpen ? "calc(100% - 250px)" : "100%",
            transition: "width 0.3s ease-in-out",
          }}
        >
          {/* Search Bar */}
          <div
            className="flex justify-center mb-4"
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "50px",
              width: "100%",
            }}
          >
             <input
              type="text"
              className="form-control"
              placeholder="Search subscriptions..."
              value={searchQuery}
              onChange={handleSearchChange}
              style={{ width: "50%", maxWidth: "500px", marginRight: "10px", height: "38px" }}
            />
            <button
              onClick={handleSearch}
              style={{
                padding: "8px 16px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
                height: "38px",
              }}
            >
              Go
            </button>
          </div>

          {/* My Subscriptions */}
          <h2 className="text-lg font-semibold">My Subscriptions</h2>

          {/* Loading Indicator */}
          {isLoading ? (
            <div className="flex" style={overlayStyle}>
              <img src={loading} alt="Loading..." style={gifStyle} />
            </div>
          ) : (
            <div
              className="subscription-list"
              style={{
                border: "1px solid #ddd",
                padding: "12px",
                borderRadius: "8px",
                boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.1)",
                maxWidth: "1200px",
                overflowY: "auto",
              }}
            >
              {subscriptions.length > 0 ? (
                subscriptions.map((sub, index) => (
                  <div
                    key={index}
                    className="subscription-card p-3 border rounded-lg shadow-md mb-3 flex items-center"
                    style={{
                      background: "#f9f9f9",
                      borderRadius: "8px",
                      boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <img
                      src={sub.my_subscriber_profile_image}
                      alt={`Subscriber ${sub.my_subscriber_id}`}
                      style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                    />
                    <div className="ml-3">
                      <h6 className="font-medium">Subscriber ID: {sub.my_subscriber_id}</h6>
                      <p style={{ fontSize: "14px" }}>User Name: {sub.my_subscriber_username}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: "center", fontWeight: "bold", padding: "10px" }}>
                  ⚠️ No subscriptions available.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Styles
export const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};

export const gifStyle = {
  width: "200px",
  height: "100px",
  opacity: 0.5,
};

export default MySubscriptions;
