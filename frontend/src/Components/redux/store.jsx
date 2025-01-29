import { configureStore } from "@reduxjs/toolkit";
import favouriteCountriesReducer from "./favouriteCountriesSlice";

const store = configureStore({
  reducer: {
    favouriteCountries: favouriteCountriesReducer,
  },
});

export default store;
