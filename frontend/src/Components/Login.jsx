import React, { useState, useEffect } from "react";
import logo from "../assets/logo/quak_logo.png";
import bg from "../assets/images/blurred-empty-open-space-office-600nw-2411635125.webp";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../i18n.js";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [userField, setUserField] = useState({
    email: "",
  });

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const changeUserFieldHandler = (e) => {
    setUserField({
      ...userField,
      [e.target.name]: e.target.value,
    });
    // console.log(userField);
  };

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("tokenResponse");
      console.log(tokenResponse);
      try {
        // Fetch user details from Google
        const userResponse = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          }
        );
        const userInfo = await userResponse.json();

        // Check if it's the first-time login
        const isFirstLogin = !localStorage.getItem("user_logged_in");
        // if (isFirstLogin) {
        //   // Show an alert or modal for user permission
        //   const userConsent = window.confirm(
        //     `Hi ${userInfo.given_name}, do you agree to share your profile information with us?`
        //   );

        //   if (!userConsent) {
        //     alert("You need to grant permission to continue.");
        //     return;
        //   }

        //   // Set a flag in localStorage
        //   localStorage.setItem("user_logged_in", "true");
        // }

        // Navigate to dashboard with user details
        navigate("/dashboard", { state: { user: userInfo } });
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    },
    onError: () => {
      console.log("Login Failed");
    },
  });
  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userField.email) {
      alert("Email is required");
      return false;
    }
    if (!emailRegex.test(userField.email)) {
      alert("Please enter a valid email address");
      return false;
    }
    if (!userField.password) {
      alert("Password is required");
      return false;
    }
    return true;
  };
  const mailLogin = async () => {
    if (!validateForm()) return;
    try {
      const response = await axios.post(
        "https://develop.quakbox.com/admin/api/login",
        userField
      );

      // Handle successful login
      // console.log("Login Successful:", response.data);
      const token = response.data.token;
      const userInfo = response.data;
      // Store the token (optional)
      localStorage.setItem("api_token", token);
      navigate("/dashboard", { state: { user: userInfo } });
    } catch (error) {
      // Handle errors
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error("Error Response:", error.response.data);
        alert(error.response.data.message);
        // Clear the password field if login failed
        setUserField((prevState) => ({
          ...prevState,
          password: "", // Clear the password field
        }));
      } else if (error.request) {
        // No response was received
        console.error("No Response:", error.request);
      } else {
        // Something else caused the error
        console.error("Error Message:", error.message);
      }
    }
  };

  return (
    <>
      <section className="vh-100 vw-100">
        <div className="h-100">
          <div className="row h-100 g-0">
            {/* Left Side - Background Image */}
            <div
              className="col-lg-8 d-none d-lg-block position-relative"
              style={{
                backgroundImage: `url(${bg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Overlay */}
              <div
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
              ></div>

              {/* Left-Side Content */}
              <div
                className="position-absolute top-50 start-50 translate-middle text-white text-center"
                style={{ zIndex: 2 }}
              >
                <h1
                  className="fw-bold mb-0"
                  style={{ fontSize: "8rem", lineHeight: "1.2" }}
                >
                  Quakbox
                </h1>
                <p className="fs-5 mb-5">
                  {t("a new source for interactive social news")}
                </p>
                <div className="d-flex justify-content-center gap-5">
                  <div>
                    <i className="fas fa-newspaper fa-5x text-info"></i>
                    <p className="mt-1 small">QB {t("news")}</p>
                  </div>
                  <div>
                    <i className="fas fa-comments fa-5x text-info"></i>
                    <p className="mt-1 small">{t("Chat")}</p>
                  </div>
                  <div>
                    <i className="fas fa-share-alt fa-5x text-info"></i>
                    <p className="mt-1 small">Share</p>
                  </div>
                  <div>
                    <i className="fas fa-wifi fa-5x text-info"></i>
                    <p className="mt-1 small">Cast</p>
                  </div>
                </div>
              </div>

              {/* Bottom Content: Language Selector & Copyright */}
              <div className="position-absolute bottom-0 start-0 end-0 text-center text-white p-3">
                <hr />
                <div className="d-flex flex-column">
                  {/* Language Selector */}
                  <div className="language-selector mb-2">
                    <div className="d-flex justify-content-center flex-wrap gap-2">
                      {[
                        { code: "ar", label: "العربية" },
                        { code: "bg", label: "Български" },
                        { code: "ca", label: "Català" },
                        { code: "zh-CN", label: "简体中文" },
                        { code: "zh-TW", label: "繁體中文" },
                        { code: "cs", label: "Čeština" },
                        { code: "da", label: "Dansk" },
                        { code: "nl", label: "Nederlands" },
                        { code: "en", label: "English" },
                        { code: "et", label: "Eesti" },
                        { code: "fi", label: "Suomi" },
                        { code: "fr", label: "Français" },
                      ].map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            changeLanguage(lang.code);
                            console.log(lang.code);
                          }}
                          className="btn btn-link text-white p-0 small"
                        >
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Copyright */}
                  <div>
                    <p className="small mb-0">
                      © 2024 Quakbox. All rights reserved.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Centered Login Form */}
            <div
              className="col-lg-4 col-md-12 col-12 d-flex align-items-center justify-content-center"
              style={{ minHeight: "100vh" }}
            >
              <div className="p-4 w-100" style={{ maxWidth: "550px" }}>
                {/* Company Logo and Name for small/medium screens */}
                <div className="d-block d-lg-none text-center mb-4">
                  <div className="d-flex align-items-center justify-content-center">
                    <img
                      src={logo}
                      alt="Logo"
                      style={{ width: "40px", marginRight: "10px" }} // Adjust logo size
                    />
                    <h2 className="fw-bold mb-0 fs-1">Quakbox</h2>
                  </div>
                </div>
                <div className="bg-white rounded p-4" id="form">
                  <h2 className="text-center fw-bold mb-4">Login</h2>
                  <form>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        {t(" Your Email or Mobile Number")}
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="form-control"
                        name="email"
                        placeholder="Enter Email or Mobile"
                        value={userField.email}
                        onChange={(e) => changeUserFieldHandler(e)}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        className="form-control"
                        name="password"
                        placeholder="Enter Password"
                        value={userField.password}
                        onChange={(e) => changeUserFieldHandler(e)}
                      />
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="remember"
                        />
                        <label htmlFor="remember" className="form-check-label">
                          Remember me
                        </label>
                      </div>
                      <a
                        href="#"
                        className="small text-decoration-none"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate("/forgetpassword");
                        }}
                      >
                        Forgot Password?
                      </a>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <button
                        type="button"
                        className="btn btn-primary mb-3"
                        onClick={() => mailLogin()}
                      >
                        Quakin
                      </button>
                      <button type="button" className="btn btn-secondary mb-3">
                        QuakMail
                      </button>
                    </div>
                    <p className="text-center text-muted small mb-2">
                      or Log In with
                    </p>
                    <button
                      type="button"
                      className="btn btn-outline-danger w-100 mb-2"
                      onClick={() => login()}
                    >
                      <i className="fab fa-google me-2"></i>Sign in with Google
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-primary w-100"
                    >
                      <i className="fab fa-facebook me-2"></i>Sign in with
                      Facebook
                    </button>
                  </form>
                  <p className="text-center mt-3 text-sm">
                    Don't have an account?{" "}
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate("/signup");
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      Register here
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
