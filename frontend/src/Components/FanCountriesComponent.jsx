import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Card,
  Checkbox,
  Button,
  Grid,
  Typography,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import axios from "axios";
import { CustomSnackbar, Loader } from "./LoaderAndSnackbar";
import { ToastContainer, toast, Bounce, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import NavBar from "./Dashboard/NavBar";
import "./FanCountriesComponent.css";
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

// Reusable styles
const cardStyle = {
  padding: "6px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  height: "97%",
  width: "97%",
  boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
  borderRadius: "8px",
  // backgroundColor: "#ffffff",
  // backgroundColor: "#f7e3e3",
};

const imgStyle = {
  width: "100px",
  height: "60px",
  marginBottom: "8px",
  boxShadow: "0 2px 5px rgba(0,0,0,0.5)",
};

const typographyStyle = {
  fontSize: "20px",
  fontWeight: "bold",
  color: "#333333",
};

const fanColorStyle = {
  color: "#FFC107", // Yellow for Fan
};

const favouriteColorStyle = {
  color: "#1877F2", // Blue for Favourite
};

const disabledCheckboxStyle = {
  color: "#9E9E9E", // Grey for disabled
  opacity: 0.5,
  cursor: "not-allowed",
};

const enabledCheckboxStyle = {
  color: "#1877F2", // Blue for enabled
};
// Main component
const FanCountriesComponent = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [resetLoading, setResetLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
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

  // const handleCheckboxChange = (name, type, checked) => {
  //   setCountries((prev) =>
  //     prev.map((country) =>
  //       country.name === name
  //         ? {
  //             ...country,
  //             isFan: type === "Fan" ? checked : country.isFan,
  //             isFavourite:
  //               type === "Favourite"
  //                 ? checked
  //                 : checked
  //                 ? country.isFavourite
  //                 : false,
  //           }
  //         : country
  //     )
  //   );
  // };
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
          // Determine the favourite_country value based on isFan and isFavourite
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
            favourite_country: favouriteCountryValue, // Use the new value here
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

  const renderCountryCard = (country, handleCheckboxChange) => {
    return (
      <Card key={country.name} style={cardStyle}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <img
            src={country.flag}
            alt={`${country.name} Flag`}
            style={imgStyle}
          />
          <Typography variant="h6" style={typographyStyle}>
            {country.name}
          </Typography>
        </div>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {/* Fan Checkbox */}
          <div>
            <Checkbox
              checked={country.isFan}
              style={fanColorStyle}
              onChange={(e) =>
                handleCheckboxChange(country.name, "Fan", e.target.checked)
              }
            />
            <Typography style={fanColorStyle}>Fan</Typography>
          </div>
          {/* Favourite Checkbox (disabled if not a Fan) */}
          <div>
            <Checkbox
              checked={country.isFavourite}
              disabled={!country.isFan}
              style={
                country.isFan
                  ? enabledCheckboxStyle
                  : { ...disabledCheckboxStyle, ...favouriteColorStyle }
              }
              onChange={(e) =>
                handleCheckboxChange(
                  country.name,
                  "Favourite",
                  e.target.checked
                )
              }
            />
            <Typography
              style={
                country.isFan ? favouriteColorStyle : disabledCheckboxStyle
              }
            >
              Favourite
            </Typography>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="mainContainer">
      <div className="navbarDiv">
        <NavBar />
      </div>

      <div className="countriesMainContainer">
        {/* Loader */}
        <Loader loading={loading || resetLoading} message="Loading data..." />
        {/* Success Snackbar */}
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
        {/* Reset button at the top of the page */}
        <div className="resetButtonDiv">
          <Button
            className="resetButton"
            variant="contained"
            color="default"
            onClick={handleReset}
            disabled={resetLoading}
          >
            {resetLoading ? <CircularProgress size={24} /> : "Reset"}
          </Button>
        </div>
        {/* First Section: Favourite and Fan Countries */}
        <div className="myCountriesContainer">
          {/* "My Countries" section */}
          <div className="MyCountriesTextContainer">
            <Typography className="MyCountriesText" variant="h4">
              My Countries
            </Typography>
            <Button
              className="UpdateExistingCountriesButton"
              variant="contained"
              color="secondary"
              onClick={handleUpdate}
              disabled={loading || resetLoading}
            >
              Update Existing Countries
            </Button>
          </div>

          {/* Country grid */}
          <div className="favouriteCountriesContainer">
            <Typography className="favouriteCountriesText" variant="h5">
              Favourite Countries
            </Typography>

            <Grid container spacing={1} justifyContent="center">
              {favouriteCountries.length > 0 ? (
                favouriteCountries.map((country) => (
                  <Grid
                    className="favouriteCountriesGrid"
                    item
                    xs={6}
                    sm={3}
                    md={3}
                    lg={2}
                    key={country.name}
                  >
                    {renderCountryCard(country, handleCheckboxChange)}
                  </Grid>
                ))
              ) : (
                <Typography className="noFavouriteCountriesText">
                  No Favourite Countries
                </Typography>
              )}
            </Grid>
          </div>

          <div className="fanCountriesContainer">
            <Typography className="fanCountriesText" variant="h5">
              Fan Countries
            </Typography>
            <Grid container spacing={1} justifyContent="center">
              {fanCountries.length > 0 ? (
                fanCountries.map((country) => (
                  <Grid
                    className="fanCountriesGrid"
                    item
                    xs={6}
                    sm={3}
                    md={3}
                    lg={2}
                    key={country.name}
                  >
                    {renderCountryCard(country, handleCheckboxChange)}
                  </Grid>
                ))
              ) : (
                <Typography className="noFanCountriesText">
                  No Fan Countries
                </Typography>
              )}
            </Grid>
          </div>
        </div>
        {/* Second Section: All Countries */}
        <div className="allCountriesContainer">
          {/* "My Countries" section */}
          <div className="allCountriesTextContainer">
            <Typography className="AllCountriesText" variant="h4">
              All Countries
            </Typography>
            <Button
              className="addNewCountriesButton"
              variant="contained"
              color="primary"
              onClick={handlePost}
            >
              Add New Countries
            </Button>
          </div>

          {/* Country grid */}
          <div className="allCountriesGridContainer">
            <Grid container spacing={1} justifyContent="center">
              {countries.length > 0 ? (
                countries.map((country) => (
                  <Grid
                    className="allCountriesGrid"
                    item
                    xs={6}
                    sm={3}
                    md={3}
                    lg={2}
                    key={country.name}
                  >
                    {renderCountryCard(country, handleCheckboxChange)}
                  </Grid>
                ))
              ) : (
                <Typography className="noCountriesAvailableText">
                  No Countries Available
                </Typography>
              )}
            </Grid>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FanCountriesComponent;
