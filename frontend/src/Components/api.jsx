import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "https://develop.quakbox.com/admin/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Retrieve token
const userToken = localStorage.getItem("userToken");

// If no token is found, force logout
if (!userToken) {
  window.location.href = "/login";
} else {
  api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
}

// Flag to prevent multiple popups
let sessionExpired = false;

// Axios Interceptor for handling 401 errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("userToken");
      if (!sessionExpired) {
        sessionExpired = true;
        showSessionExpiredPopup();
        setTimeout(() => (sessionExpired = false), 5000);
      }
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Function to trigger session expired popup
function showSessionExpiredPopup() {
  const event = new Event("sessionExpired");
  window.dispatchEvent(event);
}

// Export the Axios instance
export default api;
