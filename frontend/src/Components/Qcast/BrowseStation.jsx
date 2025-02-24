import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../Dashboard/NavBar";
import QSidebar from "./QSidebar";
import user from "../../assets/images/user1.png";
import loading from "../../assets/images/loading.gif"; // Import loading GIF

const BrowseStation = () => {
  const [stations, setStations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  // Function to fetch stations from API
  const fetchStations = async (query = "") => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("api_token");
      if (!token) {
        console.error("❌ Authorization token missing. Please log in.");
        return;
      }

      // Append search query to API URL
      const response = await axios.get(
        `https://${window.APP_DOMAIN}/admin/api/videos/browsestations?search=${query}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200 && response.data.data) {
        // Transform API data into required format
        const formattedStations = response.data.data.map((station) => ({
          name: station.station_admin_name,
          profileImage: station.station_admin_profile_image || user, // Use API image or default
          subscribers: station.station_subscribers_count || 0,
          uploads: station.station_videos_count || 0,
        }));

        setStations(formattedStations);
      } else {
        console.error("⚠️ No stations found.");
      }
    } catch (error) {
      console.error("❌ Error fetching stations:", error);
    } finally {
      setIsLoading(false); // Stop loading when data is fetched
    }
  };

  // Fetch all stations on component mount
  useEffect(() => {
    fetchStations();
  }, []);

  // Function to handle search button click
  const handleSearch = () => {
    fetchStations(searchQuery);
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
              placeholder="Search stations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "50%",
                maxWidth: "500px",
                marginRight: "10px",
                height: "38px",
              }}
            />

            {/* Go Button */}
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

          

          {/* Browse Stations */}
          <h2 className="text-lg font-semibold">Browse Stations</h2>

          {/* Loading Indicator */}
          {isLoading ? (
            <div className="flex" style={overlayStyle}>
              <img src={loading} alt="Loading..." style={gifStyle} />
            </div>
          ) : (
            <div
              className="station-list"
              style={{
                border: "1px solid #ddd",
                padding: "12px",
                borderRadius: "8px",
                boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.1)",
                maxWidth: "1200px",
                overflowY: "auto",
              }}
            >
              {stations.length > 0 ? (
                stations.map((station, index) => (
                  <div
                    key={index}
                    className="station-card p-3 border rounded-lg shadow-md mb-3 flex items-center"
                    style={{
                      background: "#f9f9f9",
                      borderRadius: "8px",
                      boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <img
                      src={station.profileImage}
                      alt={station.name}
                      onError={(e) => (e.target.src = user)} // Fallback if image fails to load
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                      }}
                    />
                    <div className="ml-3">
                      <h6 className="font-medium">{station.name}</h6>
                      <div style={{ display: "flex", gap: "16px", fontSize: "14px" }}>
                        <p>Subscribers: {station.subscribers}</p>
                        <p>Uploads: {station.uploads}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: "center", fontWeight: "bold", padding: "10px" }}>
                  ⚠️ No stations available.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Loading Overlay Styles
export const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black background
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999, // Ensures it's above all other elements
};

// Loading GIF Styles
export const gifStyle = {
  width: "200px",
  height: "100px",
  opacity: 0.5,
};

export default BrowseStation;
