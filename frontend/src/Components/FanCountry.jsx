import React, { useEffect, useState, useMemo } from "react";
import NavBar from "./Dashboard/NavBar";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { CustomSnackbar, Loader } from "./LoaderAndSnackbar";
import { ToastContainer, toast, Bounce, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import {
  selectFavouriteCountries,
  setFavouriteCountries,
} from "./redux/favouriteCountriesSlice";

// API URLs
const countriesApi = "https://restcountries.com/v3.1/all";
const GET_API_URL =
  "https://develop.quakbox.com/admin/api/get_favourite_country";
const POST_API_URL =
  "https://develop.quakbox.com/admin/api/set_favourite_country";
const PUT_API_URL =
  "https://develop.quakbox.com/admin/api/put_favourite_country";
const RESET_API_URL =
  "https://develop.quakbox.com/admin/api/del_favourite_country";
const API_TOKEN = localStorage.getItem("api_token");

// Helper to get the API token
const getApiToken = () => {
  const token = localStorage.getItem("api_token");
  if (!token) {
    handleTokenError("Session expired. Please log in again.");
  }
  return token;
};

// Handle token errors
const handleTokenError = (message) => {
  toast.error(message);
  navigate("/"); // Redirect to login
};

const FanCountry = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [resetLoading, setResetLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [searchFan, setSearchFan] = useState("");
  const [searchAll, setSearchAll] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const favouriteCountriesFromStore = useSelector(selectFavouriteCountries);
  // Check token validity
  const checkUserSession = () => {
    const token = getApiToken();
    if (!token) {
      navigate("/"); // Redirect to login if no token
    }
  };

  const fetchAllCountries = async () => {
    setLoading(true);
    try {
      const response = await axios.get(countriesApi);
      const data = response.data.map((country) => ({
        name: country.name.common,
        flag: country.flags.png,
        isFan: false,
        isFavourite: false,
      }));

      // Sort countries alphabetically by name
      const sortedCountries = data.sort((a, b) => a.name.localeCompare(b.name));

      setCountries(sortedCountries); // Initialize countries with sorted data
      fetchFavouriteCountries(sortedCountries); // Fetch favourite data
    } catch (error) {
      handleError("Error fetching all countries");
    } finally {
      setLoading(false);
    }
  };
  const handleCheckboxChange = (name, type, checked) => {
    setCountries((prev) =>
      prev.map((country) => {
        if (country.name === name) {
          if (type === "Favourite" && checked) {
            // Check if the limit of 3 is exceeded
            const favouriteCount = prev.filter((c) => c.isFavourite).length;
            if (favouriteCount >= 3) {
              toast.error("You can only select up to 3 Favourite countries.", {
                transition: Bounce,
              });
              return country; // Return unchanged country if limit exceeded
            }
          }
          return {
            ...country,
            isFan: type === "Fan" ? checked : country.isFan,
            isFavourite:
              type === "Favourite"
                ? checked
                : checked
                ? country.isFavourite
                : false,
          };
        }
        return country;
      })
    );
  };

  // Fetch all countries on mount
  // Validate session on mount
  useEffect(() => {
    checkUserSession(); // Validate session
    setLoading(true);
    fetchAllCountries()
      .then(() => handleSuccess("Countries loaded successfully"))
      .catch(() => handleError("Error loading countries"))
      .finally(() => setLoading(false)); // Fetch countries after session validation
  }, []);

  // Derived states using useMemo
  const fanCountries = useMemo(
    () => countries.filter((country) => country.isFan),
    [countries]
  );

  const favouriteCountries = useMemo(
    () => countries.filter((country) => country.isFavourite),
    [countries]
  );

  const fetchFavouriteCountries = async (initialCountries) => {
    try {
      const token = getApiToken();
      const response = await axios.get(GET_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const uniqueCountries = response.data.favourite_country.map(
        (country) => ({
          code: country.code.toLowerCase(),
          isFan: true,
          isFavourite: country.favourite_country === "1",
          favourite_country_id: country.favourite_country_id,
          originalState: {
            isFan: true,
            isFavourite: country.favourite_country === "1",
          },
        })
      );

      const combined = initialCountries.map((country) => {
        const match = uniqueCountries.find(
          (fav) => fav.code === country.name.toLowerCase()
        );
        return match ? { ...country, ...match } : country;
      });

      // Update Redux store with favourite countries
      dispatch(
        setFavouriteCountries(combined.filter((country) => country.isFavourite))
      );

      setCountries(combined);
    } catch (error) {
      handleApiError("Error fetching favourite countries", error);
    }
  };

  const handleApiError = (message, error) => {
    if (error.response?.status === 401) {
      handleTokenError("Session expired. Please log in again.");
    } else {
      toast.error(message);
    }
  };

  const handlePost = async () => {
    try {
      const token = getApiToken();
      const postPayload = countries
        .filter(
          (country) =>
            !country.favourite_country_id &&
            (country.isFan || country.isFavourite)
        )
        .map((country) => ({
          code: country.name,
          favourite_country: country.isFavourite ? "1" : "0",
        }));

      if (postPayload.length === 0) {
        handleError("No new countries to add.");
        return;
      }

      await axios.post(
        POST_API_URL,
        { countries: postPayload },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchFavouriteCountries(countries);
      toast.success("New countries added successfully!", {
        transition: Bounce, // Add Bounce transition
      });
      // Force the page to reload after the update
      window.location.reload(); // This will reload the entire page
    } catch (error) {
      handleApiError("Error posting new countries", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const putPayload = countries
        .filter((country) => country.favourite_country_id)
        .filter((country) => {
          const original = country.originalState || {};
          return (
            country.isFan !== original.isFan ||
            country.isFavourite !== original.isFavourite
          );
        })
        .map((country) => {
          let favouriteCountryValue;

          if (country.isFan && !country.isFavourite) {
            favouriteCountryValue = "0"; // Only Fan
          } else if (country.isFan && country.isFavourite) {
            favouriteCountryValue = "1"; // Fan and Favourite
          } else {
            favouriteCountryValue = "3"; // Neither Fan nor Favourite
          }

          return {
            favourite_country_id: country.favourite_country_id,
            code: country.name,
            favourite_country: favouriteCountryValue,
          };
        });

      if (putPayload.length === 0) {
        handleError("No existing countries to update.");
        return;
      }

      const token = getApiToken();
      await axios.post(
        PUT_API_URL,
        { countries: putPayload },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchFavouriteCountries(countries);
      toast.success("Countries updated successfully!", {
        transition: Zoom, // Add Zoom transition
      });
      // Force the page to reload after the update
      window.location.reload(); // This will reload the entire page
    } catch (error) {
      handleError("Error updating countries");
    }
  };

  const handleReset = async () => {
    if (favouriteCountries.length === 0 && fanCountries.length === 0) {
      handleError("No countries to reset.");
      return;
    }
    setResetLoading(true);
    try {
      const token = getApiToken();
      await axios.post(
        RESET_API_URL,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const resetCountries = countries.map((country) => ({
        ...country,
        isFan: false,
        isFavourite: false,
        favourite_country_id: null,
        originalState: { isFan: false, isFavourite: false },
      }));

      setCountries(resetCountries);
      setSuccessMessage("Reset countries successfully!");
      toast.success("Countries reset successfully!", {
        transition: Bounce, // Add Bounce transition
      });
      // Force the page to reload after the update
      window.location.reload(); // This will reload the entire page
    } catch (error) {
      handleError("Error resetting countries");
    } finally {
      setResetLoading(false);
    }
  };

  const handleError = (message) => {
    setErrorMessage(message);
    toast.error(message, {
      transition: Bounce, // Add Bounce transition
    });
  };

  const handleSuccess = (message) => {
    setSuccessMessage(message);
  };

  return (
    <div className="app">
      <NavBar />
      <div
        className=""
        style={{ marginTop: "54px", marginBottom: "60px" }}
      >
        <Loader loading={loading || resetLoading} message="Loading data..." />
        <CustomSnackbar
          open={!!successMessage}
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
          severity="success"
        />
        {/* Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          transition={Zoom}
        />
        {/* Error Snackbar */}
        <CustomSnackbar
          open={!!errorMessage}
          message={errorMessage}
          onClose={() => setErrorMessage(null)}
          severity="error"
        />

        <div>
          {/* Favourite Countries Section */}
          <div className="mb-1" style={{ marginTop: "56px" }}>
            <div
              className="d-flex justify-content-between align-items-center p-3"
              style={{
                background:
                  "linear-gradient(to right,rgb(193, 193, 197),rgb(216, 214, 214))",
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
                Favourite Country
              </h4>
              <div className="d-flex align-items-center">
                <button
                  className="btn btn-primary me-2"
                  onClick={handleUpdate}
                  disabled={loading || resetLoading}
                >
                  Update Favourite Country
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleReset}
                  disabled={resetLoading}
                >
                  Reset{" "}
                  {/* {resetLoading ? <CircularProgress size={24} /> : "Reset"} */}
                </button>
              </div>
            </div>

            {favouriteCountries.length > 0 ? (
              <div
                className="d-flex justify-content-center mt-2 flex-wrap"
                style={{ gap: "10px" }}
              >
                {favouriteCountries.map((country, index) => (
                  <div
                    className="card"
                    style={{ width: "250px", margin: "2px" }} // Keep original width
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
                    <div
                      className="card-body text-center p-2"
                      style={{ paddingTop: "8px", paddingBottom: "8px" }}
                    >
                      {" "}
                      {/* Reduced padding */}
                      <h5
                        className="card-title text-truncate"
                        style={{
                          width: "100%",
                          fontSize: "16px",
                          marginBottom: "4px", // Reduced gap between image and country name
                        }}
                      >
                        {country.name}
                      </h5>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "100%",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          {" "}
                          {/* Reduced gap */}
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={country.isFavourite}
                            onChange={(e) =>
                              handleCheckboxChange(
                                country.name,
                                "Favourite",
                                e.target.checked
                              )
                            }
                            style={{
                              width: "16px", // Reduced size
                              height: "16px",
                              cursor: "pointer",
                              accentColor: "#007bff",
                            }}
                          />
                          <label
                            className="form-check-label"
                            style={{
                              color: "#007bff",
                              fontSize: "18px", // Reduced font size
                              fontWeight: "bold",
                              cursor: "pointer",
                              width: "80px", // Adjusted width
                              textAlign: "center",
                              marginLeft: "2px", // Reduced gap between country name and checkbox
                            }}
                          >
                            Favourite
                          </label>
                        </div>
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
          <div className="mb-1">
            <div
              className="d-flex justify-content-between align-items-center p-3"
              style={{
                background:
                  "linear-gradient(to right,rgb(193, 193, 197),rgb(216, 214, 214))",
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
                Fan Country
              </h4>
              <div className="d-flex justify-content-between w-100 align-items-center">
                <div className="flex-grow-1"></div>
                <div className="d-flex align-items-center">
                  {/* Search box moved here, before buttons */}
                  <input
                    type="text"
                    className="form-control me-3"
                    placeholder="Search Fan Countries..."
                    value={searchFan}
                    onChange={(e) => setSearchFan(e.target.value)}
                    style={{ maxWidth: "200px" }}
                  />
                  <button className="btn btn-primary me-2" onClick={handlePost}>
                    Update Fan Countries
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={handleReset}
                    disabled={resetLoading}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {fanCountries.length > 0 ? (
              <div
                className="d-flex justify-content-center flex-wrap mt-2"
                style={{ gap: "10px" }}
              >
                {fanCountries
                  .filter((country) =>
                    country.name.toLowerCase().includes(searchFan.toLowerCase())
                  ) // Filter countries based on search query
                  .map((country, index) => (
                    <div
                      className="card"
                      style={{ width: "250px", margin: "5px" }} // Reduced margin for tighter layout
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
                      <div
                        className="card-body text-center p-2"
                        style={{ padding: "8px" }}
                      >
                        <h5
                          className="card-title text-truncate"
                          style={{
                            width: "100%",
                            fontSize: "16px",
                            marginBottom: "4px",
                          }}
                        >
                          {country.name}
                        </h5>

                        {/* Checkboxes in a single horizontal line */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row", // Ensures checkboxes are in a line
                            alignItems: "center", // Aligns checkboxes and labels
                            justifyContent: "center", // Centers inside the card
                            gap: "10px", // Adds some spacing between checkboxes
                            marginTop: "4px", // Adjust spacing from country name
                          }}
                        >
                          {/* Fan Checkbox */}
                          <div
                            className="form-check d-flex align-items-center"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={country.isFan}
                              onChange={(e) =>
                                handleCheckboxChange(
                                  country.name,
                                  "Fan",
                                  e.target.checked
                                )
                              }
                              style={{
                                width: "16px",
                                height: "16px",
                                cursor: "pointer",
                                accentColor: "#d4af37",
                              }}
                            />
                            <label
                              className="form-check-label"
                              style={{
                                color: "#d4af37",
                                fontSize: "18px",
                                fontWeight: "bold",
                                cursor: "pointer",
                                textAlign: "center",
                              }}
                            >
                              Fan
                            </label>
                          </div>

                          {/* Favourite Checkbox */}
                          <div
                            className="form-check d-flex align-items-center"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={country.isFavourite}
                              onChange={(e) =>
                                handleCheckboxChange(
                                  country.name,
                                  "Favourite",
                                  e.target.checked
                                )
                              }
                              style={{
                                width: "16px",
                                height: "16px",
                                cursor: "pointer",
                                accentColor: "#007bff",
                              }}
                            />
                            <label
                              className="form-check-label"
                              style={{
                                color: "#007bff",
                                fontSize: "18px",
                                fontWeight: "bold",
                                cursor: "pointer",
                                textAlign: "center",
                              }}
                            >
                              Favourite
                            </label>
                          </div>
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
                background:
                  "linear-gradient(to right,rgb(193, 193, 197),rgb(216, 214, 214))",
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
                All Country
              </h4>
              <div className="d-flex justify-content-between w-100 align-items-center">
                <div className="flex-grow-1"></div>{" "}
                {/* This pushes the search box and button to the right */}
                <div className="d-flex align-items-center">
                  {/* Search box at the end of the section */}
                  <input
                    type="text"
                    className="form-control me-3"
                    placeholder="Search All Countries..."
                    value={searchAll}
                    onChange={(e) => setSearchAll(e.target.value)} // Update state on input change
                    style={{ maxWidth: "200px" }}
                  />
                  {/* <button className="btn btn-info" onClick={handlePost}>
                    Update All Countries
                  </button> */}
                </div>
              </div>
            </div>

            <div className="d-flex flex-wrap justify-content-center mt-3">
              {countries
                .filter((country) =>
                  country.name.toLowerCase().includes(searchAll.toLowerCase())
                )
                .map((country, index) => (
                  <div
                    className="card me-2 mb-2" // Reduced margin for tighter layout
                    style={{ width: "230px" }} // Slightly smaller width
                    key={index}
                  >
                    <img
                      src={country.flag}
                      className="card-img-top"
                      alt={country.name}
                      style={{
                        width: "100%",
                        height: "140px", // Kept same height
                        objectFit: "cover",
                      }}
                    />
                    <div
                      className="card-body text-center p-2"
                      style={{ padding: "8px" }}
                    >
                      {" "}
                      {/* Reduced padding */}
                      <h5
                        className="card-title text-truncate"
                        style={{
                          width: "100%",
                          fontSize: "16px", // Reduced font size
                          marginBottom: "4px", // Reduced gap between image and name
                        }}
                      >
                        {country.name}
                      </h5>
                      <div
                        className="form-check d-flex align-items-center justify-content-center"
                        style={{ gap: "4px", marginTop: "4px" }} // Reduced space between country name and checkbox
                      >
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={country.isFan}
                          onChange={(e) =>
                            handleCheckboxChange(
                              country.name,
                              "Fan",
                              e.target.checked
                            )
                          }
                          style={{
                            width: "16px", // Slightly smaller checkbox
                            height: "16px",
                            cursor: "pointer",
                            accentColor: "#d4af37", // Makes checkbox yellow
                          }}
                        />
                        <label
                          className="form-check-label fw-bold"
                          style={{
                            color: "#d4af37",
                            fontSize: "18px", // Reduced font size
                            cursor: "pointer",
                          }}
                        >
                          Fan
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FanCountry;
