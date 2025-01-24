import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  favouriteCountries: [],
};

const favouriteCountriesSlice = createSlice({
  name: "favouriteCountries",
  initialState,
  reducers: {
    setFavouriteCountries: (state, action) => {
      state.favouriteCountries = action.payload;
    },
    addFavouriteCountry: (state, action) => {
      state.favouriteCountries.push(action.payload);
    },
    removeFavouriteCountry: (state, action) => {
      state.favouriteCountries = state.favouriteCountries.filter(
        (country) => country.code !== action.payload.code
      );
    },
  },
});

export const {
  setFavouriteCountries,
  addFavouriteCountry,
  removeFavouriteCountry,
} = favouriteCountriesSlice.actions;

export const selectFavouriteCountries = (state) =>
  state.favouriteCountries.favouriteCountries;

export default favouriteCountriesSlice.reducer;
