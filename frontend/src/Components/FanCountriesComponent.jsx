import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  Checkbox,
  Button,
  Grid,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { CustomSnackbar, Loader } from "./LoaderAndSnackbar";

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

const cardStyle = {
  padding: "6px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  height: "97%",
  width: "97%",
  boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
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
  color: "#FFC107",
};

const favouriteColorStyle = {
  color: "#1877F2",
};

const disabledCheckboxStyle = {
  color: "#9E9E9E",
  opacity: 0.5,
  cursor: "not-allowed",
};

const enabledCheckboxStyle = {
  color: "#1877F2",
};

const FanCountriesComponent = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [resetLoading, setResetLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const checkUserSession = () => {
    const userToken = localStorage.getItem("api_token");
    if (!userToken) {
      navigate("/");
    }
  };

  const fetchAllCountries = async () => {
    try {
      const response = await axios.get(countriesApi);
      console.log("fetchAllCountries response");
      console.log(response);
      const data = response.data.map((country) => ({
        name: country.name.common,
        flag: country.flags.png,
        isFan: false,
        isFavourite: false,
      }));
      setCountries(data);
      fetchFavouriteCountries(data);
    } catch (error) {
      handleError("Error fetching all countries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUserSession();
    setLoading(true);
    fetchAllCountries()
      .then(() => handleSuccess("Countries loaded successfully"))
      .catch(() => handleError("Error loading countries"))
      .finally(() => setLoading(false));
  }, []);

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
      const response = await axios.get(GET_API_URL, {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
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

      setCountries(combined);
    } catch (error) {
      handleError("Error fetching favourite countries");
    }
  };

  const handleCheckboxChange = (name, type, checked) => {
    setCountries((prev) =>
      prev.map((country) =>
        country.name === name
          ? {
              ...country,
              isFan: type === "Fan" ? checked : country.isFan,
              isFavourite:
                type === "Favourite"
                  ? checked
                  : checked
                  ? country.isFavourite
                  : false,
            }
          : country
      )
    );
  };

  const handlePost = async () => {
    try {
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
          headers: { Authorization: `Bearer ${API_TOKEN}` },
        }
      );
      fetchFavouriteCountries(countries);
    } catch (error) {
      handleError("Error posting new countries");
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
        .map((country) => ({
          favourite_country_id: country.favourite_country_id,
          code: country.name,
          favourite_country: country.isFavourite ? "1" : "0",
        }));

      if (putPayload.length === 0) {
        handleError("No existing countries to update.");
        return;
      }

      await axios.post(
        PUT_API_URL,
        { countries: putPayload },
        { headers: { Authorization: `Bearer ${API_TOKEN}` } }
      );
      fetchFavouriteCountries(countries);
    } catch (error) {
      handleError("Error updating countries");
    }
  };

  const handleReset = async () => {
    setResetLoading(true);
    try {
      await axios.post(
        RESET_API_URL,
        {},
        {
          headers: { Authorization: `Bearer ${API_TOKEN}` },
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
    } catch (error) {
      handleError("Error resetting countries");
    } finally {
      setResetLoading(false);
    }
  };

  const handleError = (message) => {
    setErrorMessage(message);
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
    <div>
      <Loader loading={loading || resetLoading} message="Loading data..." />

      <CustomSnackbar
        open={!!successMessage}
        message={successMessage}
        onClose={() => setSuccessMessage(null)}
        severity="success"
      />

      <CustomSnackbar
        open={!!errorMessage}
        message={errorMessage}
        onClose={() => setErrorMessage(null)}
        severity="error"
      />
      <div
        style={{
          position: "sticky",
          top: "16px",
          zIndex: 2,
        }}
      >
        <Button
          variant="contained"
          color="default"
          onClick={handleReset}
          style={{
            position: "fixed",
            top: "34px",
            right: "16px",
            zIndex: 2,
          }}
          disabled={resetLoading}
          sx={{
            backgroundColor: "black",
            color: "white",
            "&:hover": {
              backgroundColor: "grey",
            },
          }}
        >
          {resetLoading ? <CircularProgress size={24} /> : "Reset"}
        </Button>
      </div>
      {/* First Section: Favourite and Fan Countries */}
      <div style={{ padding: "20px" }}>
        {/* "My Countries" section */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
            position: "sticky",
            width: "94%",
            top: 0,
            backgroundColor: "#fff",
            zIndex: 2,
            padding: "10px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          <Typography variant="h4" style={{ margin: 0 }}>
            My Countries
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleUpdate}
            style={{ position: "relative", zIndex: 2 }}
          >
            Update Existing Countries
          </Button>
        </div>
        <div
          style={{
            backgroundColor: "#f1f1f1",
            padding: "16px",
            borderRadius: "8px",
            marginBottom: "16px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            border: "1px solid red",
          }}
        >
          <Typography variant="h5" style={{ marginBottom: "16px" }}>
            Favourite Countries
          </Typography>

          <Grid container spacing={1} justifyContent="center">
            {favouriteCountries.length > 0 ? (
              favouriteCountries.map((country) => (
                <Grid
                  item
                  xs={6}
                  sm={3}
                  md={3}
                  lg={2}
                  key={country.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {renderCountryCard(country, handleCheckboxChange)}
                </Grid>
              ))
            ) : (
              <Typography style={{ marginLeft: "16px", marginTop: "2px" }}>
                No Favourite Countries
              </Typography>
            )}
          </Grid>
        </div>

        <div
          style={{
            backgroundColor: "#eaeaea",
            padding: "16px",
            borderRadius: "8px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            border: "1px solid red",
          }}
        >
          <Typography variant="h5" style={{ marginBottom: "16px" }}>
            Fan Countries
          </Typography>
          <Grid container spacing={1} justifyContent="center">
            {fanCountries.length > 0 ? (
              fanCountries.map((country) => (
                <Grid
                  item
                  xs={6}
                  sm={3}
                  md={3}
                  lg={2}
                  key={country.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {renderCountryCard(country, handleCheckboxChange)}
                </Grid>
              ))
            ) : (
              <Typography style={{ marginLeft: "16px", marginTop: "2px" }}>
                No Fan Countries
              </Typography>
            )}
          </Grid>
        </div>
      </div>
      {/* Second Section: All Countries */}
      <div style={{ padding: "20px" }}>
        {/* "My Countries" section */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
            position: "sticky",
            top: 0,
            width: "94%",
            backgroundColor: "#fff",
            zIndex: 2,
            padding: "30px 10px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          <Typography variant="h4" style={{ marginBottom: "0" }}>
            All Countries
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePost}
            style={{
              position: "relative",
              zIndex: 2,
            }}
          >
            Add New Countries
          </Button>
        </div>
        <div
          style={{
            backgroundColor: "#f1f1f1",
            padding: "16px",
            borderRadius: "8px",
            marginBottom: "16px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            border: "1px solid red",
          }}
        >
          <Grid container spacing={1} justifyContent="center">
            {countries.length > 0 ? (
              countries.map((country) => (
                <Grid
                  item
                  xs={6}
                  sm={3}
                  md={3}
                  lg={2}
                  key={country.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {renderCountryCard(country, handleCheckboxChange)}
                </Grid>
              ))
            ) : (
              <Typography>No Countries Available</Typography>
            )}
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default FanCountriesComponent;
