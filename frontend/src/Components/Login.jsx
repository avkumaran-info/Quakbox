import React, { useState, useEffect } from "react";
import logo from "../assets/logo/quak_logo.png";
import { ToastContainer, toast, Bounce, Zoom } from "react-toastify";
import bg from "../assets/images/blurred-empty-open-space-office-600nw-2411635125.webp";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../i18n.js";
import axios from "axios";
import GoogleAuth from "./socialLogin/GoogleAuth";

const Login = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [userField, setUserField] = useState({
    email: "",
    password: "",
  });

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const changeUserFieldHandler = (e) => {
    setUserField({
      ...userField,
      [e.target.name]: e.target.value,
    });
    console.log(userField);
  };

  const validateForm = () => {
    const emailRegex =
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$|^[a-zA-Z0-9_-]{3,20}$/;
    if (!userField.email) {
      // alert("Email is required");

      toast.error("Email is required", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });
      return false;
    }
    if (!emailRegex.test(userField.email)) {
      // alert("Please enter a valid email address");

      toast.error("Please enter a valid email address", { transition: Bounce });
      return false;
    }
    if (!userField.password) {
      // alert("Password is required");

      toast.error("Password is required", { transition: Bounce });
      return false;
    }
    return true;
  };
  const mailLogin = async (flag) => {
    if (!validateForm()) return;
    try {
      const response = await axios.post(
        "https://develop.quakbox.com/admin/api/login",
        userField
      );
      // Handle successful login
      console.log("Login Successful:", response.data);
      if (response.data.result) {
        // Store the token (optional)
        localStorage.setItem("api_token", response.data.token);
        if (flag == 1) {
          navigate("/dashboard", {});
        } else if (flag == 2) {
          navigate("/test", {});
        }
      }
      toast.error("Login Unsuccessful! Please Provide Correct Credentials", {
        transition: Bounce,
      });
    } catch (error) {
      // Handle errors
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error("Error Response:", error.response.data);
        // alert(error.response.data.message);

        toast.error(error.response.data.message, { transition: Bounce });
        // Clear the password field if login failed
        setUserField((prevState) => ({
          ...prevState,
          password: "", // Clear the password field
        }));
      } else if (error.request) {
        // No response was received
        console.error("No Response:", error.request);
        toast.error("No response received from the server", {
          transition: Bounce,
        });
      } else {
        // Something else caused the error
        console.error("Error Message:", error.message);
        toast.error("An unexpected error occurred", { transition: Bounce });
      }
    }
  };

  return (
    <>
      <div className="container-fluid vh-100 d-flex flex-column flex-md-row p-0">
        {/* Left Section */}
        <div
          className="bg-light col-12 col-md-8 position-relative d-none d-md-block"
          // style={{ overflow: "hidden" }}
          style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            // height: "100vh", // Ensure full height
            overflow: "hidden", // Prevent scrollbar on left side
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {" "}
          {/* Overlay */}
          <div
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          ></div>
          {/* Left-Side Content */}
          {/* First Section */}
          <div
            className="text-white d-flex align-items-end justify-content-center"
            style={{ height: "50vh", width: "100%" }}
          >
            <div
              className="position-absolute top-10 start-10 text-white text-center"
              style={{ zIndex: 2 }}
            >
              <h1
                className="fw-bold"
                style={{ fontSize: "8rem", lineHeight: "1.2" }}
              >
                Quakbox
              </h1>
              <p className="fs-5 mb-0">
                {t("a new source for interactive social news")}
              </p>
            </div>
          </div>
          {/* Second Section */}
          <div
            className=" text-white d-flex align-items-end justify-content-center"
            style={{ height: "30vh", width: "100%" }}
          >
            <div
              className="d-flex justify-content-center gap-5"
              style={{ zIndex: 2 }}
            >
              <div>
                <i className="fas fa-newspaper fa-5x text-info"></i>
                <p className="mt-1 small text-center">QB {t("news")}</p>
              </div>
              <div>
                <i className="fas fa-comments fa-5x text-info"></i>
                <p className="mt-1 small text-center">{t("Chat")}</p>
              </div>
              <div>
                <i className="fas fa-share-alt fa-5x text-info"></i>
                <p className="mt-1 small text-center">Share</p>
              </div>
              <div>
                <i className="fas fa-wifi fa-5x text-info"></i>
                <p className="mt-1 small text-center">Cast</p>
              </div>
            </div>
          </div>
          {/* Third Section */}
          <div
            className=" text-white d-flex align-items-center justify-content-center mx-auto"
            style={{ height: "20vh", width: "50%" }}
          >
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
          {/*  */}
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
                    {t(" Your Email or UserName")}
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    name="email"
                    placeholder="Enter Email or UserName"
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
                    className="small text-decoration-none"
                    style={{ cursor: "pointer" }}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/forgetpassword"); // Use navigate to route without refreshing the page
                    }}
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <button
                    type="button"
                    className="btn btn-primary mb-3"
                    onClick={() => mailLogin(1)}
                  >
                    Quakin
                  </button>

                  <button
                    type="button"
                    className="btn btn-primary mb-3"
                    onClick={() => mailLogin(2)}
                  >
                    Quakin_for_Gray
                  </button>

                  <button type="button" className="btn btn-secondary mb-3">
                    QuakMail
                  </button>
                </div>
                <p className="text-center text-muted small mb-2">
                  or Log In with
                </p>

                <GoogleAuth />

                <button
                  type="button"
                  className="btn btn-outline-primary mt-3 w-100"
                >
                  <i className="fab fa-facebook me-2"></i>Sign in with Facebook
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
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </>
  );
};

export default Login;
