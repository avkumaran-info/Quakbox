import React, { useEffect, useState } from "react";
import NavBar from "./Dashboard/NavBar";
import axios from "axios";

const FanCountry = () => {
  const [countries, setCountries] = useState([]);
  const [fanCountries, setFanCountries] = useState([]);
  const [favCountries, setFavCountries] = useState([]);
  const [searchFan, setSearchFan] = useState("");
  const [searchAll, setSearchAll] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((response) => {
        const data = response.data.map((country) => ({
          name: country.name.common,
          flag: country.flags.png,
        }));

        // Sort countries alphabetically by name
        const sortedCountries = data.sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        setCountries(sortedCountries);
        setLoading(false); // Stop loading after fetching data
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
        setLoading(false); // Stop loading even if there's an error
      });
  }, []);

  const handleFavChange = (country) => {
    if (favCountries.includes(country)) {
      // Remove from Favourite Countries
      setFavCountries((prev) => prev.filter((item) => item !== country));
    } else {
      if (favCountries.length < 3) {
        // Add to Favourite Countries
        setFavCountries((prev) => [...prev, country]);
      } else {
        alert("You can only add up to 3 favourite countries.");
      }
    }
  };

  const handleFanChange = (country) => {
    if (!fanCountries.includes(country)) {
      // Add to Fan Countries
      setFanCountries((prev) => [...prev, country]);
    } else {
      // Remove from Fan Countries
      setFanCountries((prev) => prev.filter((item) => item !== country));

      // Also remove from Favourite Countries when removed from Fan Countries
      setFavCountries((prev) => prev.filter((item) => item !== country));
    }
  };

  const updateExistingCountries = () => {
    console.log(
      "Updated Fan and Favourite Countries:",
      fanCountries,
      favCountries
    );
    alert("Existing countries updated!");
  };

  const resetFanCountries = () => {
    setFanCountries([]);
  };

  const resetFavCountries = () => {
    setFavCountries([]);
  };

  const updateAllCountries = () => {
    console.log("Updated All Countries:", countries);
    alert("All countries updated!");
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  const filteredFanCountries = fanCountries.filter((country) =>
    country.name.toLowerCase().includes(searchFan.toLowerCase())
  );

  const filteredFavCountries = favCountries.filter((country) =>
    country.name.toLowerCase().includes(searchFan.toLowerCase())
  );

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchAll.toLowerCase())
  );

  return (
    <div className="app">
      <NavBar />
      <div
        className="container-fluid mt-4"
        style={{ marginTop: `54px`, marginBottom: "60px" }}
      >
        <div>
          {/* Favourite Countries Section */}
          <div className="mb-4" style={{ marginTop: "65px" }}>
            <div
              className="d-flex justify-content-between align-items-center p-3"
              style={{
                background: "linear-gradient(to right, #4e54c8, #8f94fb)",
                color: "white",
                borderRadius: "5px",
              }}
            >
              <h4
                style={{
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                Favourite Countries
              </h4>
              <div className="d-flex align-items-center">
                <button
                  className="btn btn-info me-2"
                  onClick={updateExistingCountries}
                >
                  Update Existing Countries
                </button>
                <button className="btn btn-danger" onClick={resetFavCountries}>
                  Reset
                </button>
              </div>
            </div>

            {filteredFavCountries.length > 0 ? (
              <div className="d-flex justify-content-center mt-3">
                {filteredFavCountries.map((country, index) => (
                  <div
                    className="card me-3"
                    style={{ width: "250px" }}
                    key={index}
                  >
                    <img
                      src={country.flag}
                      className="card-img-top"
                      alt={country.name}
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                      }}
                    />
                    <div className="card-body text-center">
                      <h5
                        className="card-title text-truncate"
                        style={{ width: "100%" }}
                      >
                        {country.name}
                      </h5>
                      <div
                        className="form-check"
                        style={{
                          display: "inline-flex", // Ensures checkbox and label are inline
                          justifyContent: "center", // Centers the content horizontally
                          alignItems: "center", // Aligns content vertically
                          gap: "5px", // Adds a small gap between the checkbox and label
                          width: "100%", // Ensure the container spans the full width
                        }}
                      >
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked
                          onChange={() => handleFavChange(country)} // Handle toggle for removal
                        />
                        <label
                          className="form-check-label"
                          style={{
                            color: "#007bff",
                            margin: 0, // Remove extra margin around label
                          }}
                        >
                          Favourite Country
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center">No Favourite Countries</div>
            )}
          </div>

          {/* Fan Countries Section */}
          <div className="mb-4">
            <div
              className="d-flex justify-content-between align-items-center p-3"
              style={{
                background: "linear-gradient(to right, #d4af37, #e1c16e)",
                color: "white",
                borderRadius: "5px",
              }}
            >
              <h4
                style={{
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                Fan Countries
              </h4>
              <div className="d-flex justify-content-between w-100 align-items-center">
                <div className="flex-grow-1"></div>
                <div className="d-flex align-items-center">
                  <input
                    type="text"
                    className="form-control me-3"
                    placeholder="Search Fan Countries..."
                    value={searchFan}
                    onChange={(e) => setSearchFan(e.target.value)}
                    style={{ maxWidth: "200px" }}
                  />
                  <button
                    className="btn btn-info me-2"
                    onClick={updateExistingCountries}
                  >
                    Update Fan Countries
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={resetFanCountries}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {filteredFanCountries.length > 0 ? (
              <div className="d-flex justify-content-center flex-wrap mt-3">
                {filteredFanCountries.map((country, index) => (
                  <div
                    className="card me-3 mb-3"
                    style={{ width: "250px" }}
                    key={index}
                  >
                    <img
                      src={country.flag}
                      className="card-img-top"
                      alt={country.name}
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                      }}
                    />
                    <div className="card-body text-center">
                      <h5
                        className="card-title text-truncate"
                        style={{ width: "100%" }}
                      >
                        {country.name}
                      </h5>
                      <div
                        className="form-check"
                        style={{
                          display: "inline-flex", // Ensures checkbox and label are inline
                          justifyContent: "center", // Centers the content horizontally
                          alignItems: "center", // Aligns content vertically
                          gap: "5px", // Adds a small gap between the checkbox and label
                          marginBottom: "10px", // Adds some space below for separation
                          width: "100%", // Ensure the container spans the full width
                        }}
                      >
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={fanCountries.includes(country)}
                          onChange={() => handleFanChange(country)} // Handle toggle for Fan Countries
                        />
                        <label
                          className="form-check-label"
                          style={{
                            color: "#d4af37",
                            margin: 0, // Remove extra margin around label
                          }}
                        >
                          Fan
                        </label>
                      </div>

                      <div
                        className="form-check"
                        style={{
                          display: "inline-flex", // Ensures checkbox and label are inline
                          justifyContent: "center", // Centers the content horizontally
                          alignItems: "center", // Aligns content vertically
                          gap: "5px", // Adds a small gap between the checkbox and label
                          width: "100%", // Ensure the container spans the full width
                        }}
                      >
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={favCountries.includes(country)} // Handle Favourite Country checkbox state
                          onChange={() => handleFavChange(country)} // Handle toggle for adding/removing from fav
                        />
                        <label
                          className="form-check-label"
                          style={{
                            color: "#007bff",
                            margin: 0, // Remove extra margin around label
                          }}
                        >
                          Favourite
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center">No Fan Countries</div>
            )}
          </div>

          {/* All Countries Section */}
          <div>
            <div
              className="d-flex justify-content-between align-items-center p-3"
              style={{
                background: "linear-gradient(to right, #ff416c, #ff4b2b)",
                color: "white",
                borderRadius: "5px",
              }}
            >
              <h4
                style={{
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                All Countries
              </h4>
              <div className="d-flex justify-content-between w-100 align-items-center">
                <div className="flex-grow-1"></div>
                <div className="d-flex align-items-center">
                  <input
                    type="text"
                    className="form-control me-3"
                    placeholder="Search All Countries..."
                    value={searchAll}
                    onChange={(e) => setSearchAll(e.target.value)}
                    style={{ maxWidth: "200px" }}
                  />
                  <button
                    className="btn btn-info me-2"
                    onClick={updateAllCountries}
                  >
                    Update All Countries
                  </button>
                </div>
              </div>
            </div>

            <div className="d-flex flex-wrap justify-content-center mt-3">
              {filteredCountries.map((country, index) => (
                <div
                  className="card me-3 mb-3"
                  style={{ width: "250px" }}
                  key={index}
                >
                  <img
                    src={country.flag}
                    className="card-img-top"
                    alt={country.name}
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "cover",
                    }}
                  />
                  <div className="card-body text-center">
                    <h5
                      className="card-title text-truncate"
                      style={{ width: "100%" }}
                    >
                      {country.name}
                    </h5>
                    <div
                      className="form-check"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center", // Ensures content is centered
                        gap: "5px", // Small gap between checkbox and label
                        width: "100%", // Optional: ensures it takes the full width of the parent container
                      }}
                    >
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={fanCountries.includes(country)}
                        onChange={() => handleFanChange(country)}
                      />
                      <label
                        className="form-check-label"
                        style={{
                          color: "#d4af37",
                          margin: 0, // Removes extra margin
                        }}
                      >
                        Fan Country
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message for Favourite Countries Limit */}
          {favCountries.length === 3 && (
            <div className="text-center text-danger">
              You can only select up to 3 favourite countries.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FanCountry;
