import React, { useState, useEffect } from "react";
import NavBar from "../Dashboard/NavBar";
import QSidebar from "./QSidebar";
import user from "../../assets/images/user1.png";

const BrowseStation = () => {
  const [stations, setStations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    setStations([
      { name: "Kumaran", subscribers: 0, uploads: 0 },
      { name: "Mannict08", subscribers: 0, uploads: 3 },
      { name: "Prasad", subscribers: 0, uploads: 0 },
      { name: "Prasad12", subscribers: 0, uploads: 0 },
      { name: "Station 5", subscribers: 10, uploads: 2 },
      { name: "Station 6", subscribers: 5, uploads: 1 },
      { name: "Station 7", subscribers: 20, uploads: 4 },
      { name: "Station 8", subscribers: 15, uploads: 3 },
      { name: "Station 9", subscribers: 0, uploads: 0 },
      { name: "Station 10", subscribers: 8, uploads: 2 },
      { name: "Station 11", subscribers: 25, uploads: 6 },
      { name: "Station 12", subscribers: 30, uploads: 7 },
    ]);
  }, []);

  // Sidebar Toggle
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <NavBar />

      <div className="flex">
        {/* Sidebar */}
        <QSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main Content (Adjusts Width on Sidebar Toggle) */}
        <div
          className="transition-all duration-300 p-4"
          style={{
            marginRight: sidebarOpen ? "250px" : "0px", // Adjust based on sidebar width
            width: sidebarOpen ? "calc(100% - 250px)" : "100%",
            transition: "width 0.3s ease-in-out",
          }}
        >
            {/* Search Bar (Centered) */}
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
                maxWidth: "500px", // Optional: Limits width on larger screens
                marginRight: "10px", // Adds space between search box and button
                height: "38px",
                }}
            />
            
            {/* Go Button */}
            <button
                onClick={() => console.log("Searching:", searchQuery)}
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

          {/* Scrollable List */}
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
            {stations
              .filter((station) =>
                station.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((station, index) => (
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
                    src={user}
                    alt={station.name}
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
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BrowseStation;
