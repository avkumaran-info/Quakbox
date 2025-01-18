import React, { useState } from "react";
import {
  Box,
  Grid2,
  Card,
  CardContent,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import NavBar from "./Dashboard/NavBar";
const countries = [
  { name: "United States", flag: "🇺🇸" },
  { name: "Canada", flag: "🇨🇦" },
  { name: "Germany", flag: "🇩🇪" },
  { name: "Japan", flag: "🇯🇵" },
  { name: "Brazil", flag: "🇧🇷" },
  { name: "Australia", flag: "🇦🇺" },
  { name: "United Kingdom", flag: "🇬🇧" },
  { name: "France", flag: "🇫🇷" },
  { name: "India", flag: "🇮🇳" },
  { name: "Mexico", flag: "🇲🇽" },
  { name: "Italy", flag: "🇮🇹" },
  { name: "South Korea", flag: "🇰🇷" },
  { name: "China", flag: "🇨🇳" },
  { name: "Russia", flag: "🇷🇺" },
  { name: "Spain", flag: "🇪🇸" },
];

const FanCountriesComponent = () => {
  const [fanStatus, setFanStatus] = useState(
    countries.reduce((acc, country) => ({ ...acc, [country.name]: false }), {})
  );
  const [favouriteStatus, setFavouriteStatus] = useState(
    countries.reduce((acc, country) => ({ ...acc, [country.name]: false }), {})
  );

  const [fanCountries, setFanCountries] = useState([]);
  const [favouriteCountries, setFavouriteCountries] = useState([]);

  // Handle toggling Fan checkbox
  const handleFanChange = (countryName) => {
    setFanStatus((prevStatus) => ({
      ...prevStatus,
      [countryName]: !prevStatus[countryName],
    }));
  };

  // Handle toggling Favourite checkbox
  const handleFavouriteChange = (countryName) => {
    setFavouriteStatus((prevStatus) => ({
      ...prevStatus,
      [countryName]: !prevStatus[countryName],
    }));
  };

  // Add countries to Fan and Favourite based on "All Countries" section checkboxes
  const updateFanAndFavourite = () => {
    const newFanCountries = countries.filter(
      (country) => fanStatus[country.name]
    );
    const newFavouriteCountries = countries.filter(
      (country) => favouriteStatus[country.name] && fanStatus[country.name] // Only add as favourite if the country is also a fan
    );

    setFanCountries(newFanCountries);
    setFavouriteCountries(newFavouriteCountries);
  };

  // Directly add/remove countries from "Fan Subsection" and "Favourite Subsection"
  const handleDirectAddRemoveFan = (countryName) => {
    setFanCountries((prev) => {
      // Remove country from Fan Subsection
      const updatedFanCountries = prev.some(
        (country) => country.name === countryName
      )
        ? prev.filter((country) => country.name !== countryName)
        : [...prev, countries.find((country) => country.name === countryName)];

      // Also remove from Favourite Subsection if it exists
      setFavouriteCountries((prevFavouriteCountries) =>
        prevFavouriteCountries.filter((country) => country.name !== countryName)
      );

      // Update FavouriteStatus for consistency in "All Countries"
      setFavouriteStatus((prevStatus) => ({
        ...prevStatus,
        [countryName]: false,
      }));

      return updatedFanCountries;
    });

    // Ensure FanStatus is updated as well
    setFanStatus((prevStatus) => ({
      ...prevStatus,
      [countryName]: false,
    }));
  };

  const handleDirectAddRemoveFavourite = (countryName) => {
    setFavouriteCountries((prev) =>
      prev.some((country) => country.name === countryName)
        ? prev.filter((country) => country.name !== countryName)
        : [...prev, countries.find((country) => country.name === countryName)]
    );
    // Ensure that when you toggle the Favourite status, the checkbox is reflected correctly
    setFavouriteStatus((prevStatus) => ({
      ...prevStatus,
      [countryName]: !prevStatus[countryName], // Toggle Favourite status
    }));
  };

  return (
    <>
      <NavBar />
      <Box sx={{ paddingTop: 8 }}>
        {/* Fixed "Update" button */}
        <Box
          sx={{
            position: "fixed",
            // top: 40,
            right: 10,
            zIndex: 999,
            backgroundColor: "white",
            padding: 2,
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={updateFanAndFavourite}
            fullWidth
          >
            Update
          </Button>
        </Box>

        {/* Fan Countries Section */}
        <Box mb={4} sx={{ paddingTop: "0px" }}>
          <Typography variant="h5" gutterBottom>
            Fan Countries
          </Typography>

          <Typography variant="h6" gutterBottom mt={2}>
            Favourite Subsection
          </Typography>
          <Grid2 container spacing={3}>
            {favouriteCountries.map((country, index) => (
              <Grid2 item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {country.flag} {country.name}
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Button
                        color="error"
                        variant="outlined"
                        onClick={() =>
                          handleDirectAddRemoveFavourite(country.name)
                        }
                      >
                        Remove
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid2>
            ))}
          </Grid2>

          <Typography variant="h6" gutterBottom>
            Fan Subsection
          </Typography>
          <Grid2 container spacing={3}>
            {fanCountries.map((country, index) => (
              <Grid2 item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {country.flag} {country.name}
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={1}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            color="secondary"
                            checked={favouriteStatus[country.name]} // Should reflect the Favourite status
                            disabled={!fanStatus[country.name]} // Disabled if not a fan
                            onChange={() =>
                              handleDirectAddRemoveFavourite(country.name)
                            }
                          />
                        }
                        label="Favourite"
                      />
                      <FormControlLabel
                        control={
                          <Button
                            color="error"
                            variant="outlined"
                            onClick={() =>
                              handleDirectAddRemoveFan(country.name)
                            }
                          >
                            Remove
                          </Button>
                        }
                        label=""
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid2>
            ))}
          </Grid2>
        </Box>

        {/* All Countries Section */}
        <Box>
          <Typography variant="h5" gutterBottom>
            All Countries
          </Typography>

          <Grid2 container spacing={3}>
            {countries.map((country, index) => (
              <Grid2 item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {country.flag} {country.name}
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={1}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            color="primary"
                            checked={fanStatus[country.name]}
                            onChange={() => handleFanChange(country.name)}
                          />
                        }
                        label="Fan"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            color="secondary"
                            checked={favouriteStatus[country.name]}
                            disabled={!fanStatus[country.name]} // Disabled if not a fan
                            onChange={() => handleFavouriteChange(country.name)}
                          />
                        }
                        label="Favourite"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid2>
            ))}
          </Grid2>
        </Box>
      </Box>
    </>
  );
};

export default FanCountriesComponent;
