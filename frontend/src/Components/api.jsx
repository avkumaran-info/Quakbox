import axios from "axios";

const api = axios.create({
  baseURL: "https://develop.quakbox.com/api",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
  },
});

// Flag to prevent multiple popups
let sessionExpired = false;

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      if (!sessionExpired) {
        sessionExpired = true;
        showSessionExpiredPopup(); // Show popup when session expires
      }
      localStorage.removeItem("userToken");
    }
    return Promise.reject(error);
  }
);

// Function to trigger session expired popup
function showSessionExpiredPopup() {
  const event = new Event("sessionExpired");
  window.dispatchEvent(event);
}

export default api;
