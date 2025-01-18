import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
const CLIENT_ID =
  "323779904995-4pbai70981e06jt4l6ua6odfv1npcetp.apps.googleusercontent.com";

const GoogleAuth = () => {
  const navigate = useNavigate();
  const handleLoginSuccess = (response) => {
    const token = response.credential; // Get the token (response.credential) returned by Google
    console.log(token);
    // Send token to your Laravel backend
    fetch("https://develop.quakbox.com/admin/api/auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    })
      .then((response) => response.json())
      .then((data) => {
        const token = data.token;
        // Store the token (optional)
        localStorage.setItem("api_token", token);
        navigate("/dashboard", {});
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleLoginFailure = (error) => {
    console.error("Login failed:", error);
  };

  const login = useGoogleLogin({
    onSuccess: handleLoginSuccess,
    onError: handleLoginFailure,
    clientId: CLIENT_ID,
    // redirectUri: "http://localhost:3002", // or the correct URI for production
    scope: "email profile",
  });

  return (
    <div>
      {/* <GoogleLogin
        style={{ visibility: "hidden" }}
        id="google-login-button"
        onSuccess={handleLoginSuccess}
        onError={handleLoginFailure}
        clientId={CLIENT_ID}
        scope="email profile"
        useOneTap
      /> */}
      <button
        type="button"
        className="btn btn-outline-danger w-100 mb-2"
        onClick={() => login()}
      >
        <i className="fab fa-google me-2"></i>Sign in with Google
      </button>
    </div>
  );
};

export default GoogleAuth;
