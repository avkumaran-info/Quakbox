import { useState, useEffect } from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logo from "../assets/logo/quak_logo.png";
import bg from "../assets/images/blurred-empty-open-space-office-600nw-2411635125.webp";
import ErrorMessage from "./ErrorMessage.jsx";
import SuccessMessage from "./SuccessMessage.jsx";
import ConfirmationMessage from "./ConfirmationMessage.jsx";
const Signup = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [message, setMessage] = useState(""); // For Success, Error, or Confirmation messages
  const countries = [
    {
      code: "US",
      name: "United States",
      flag: "https://flagcdn.com/w320/us.png",
    },
    { code: "CA", name: "Canada", flag: "https://flagcdn.com/w320/ca.png" },
    { code: "IN", name: "India", flag: "https://flagcdn.com/w320/in.png" },
    {
      code: "UK",
      name: "United Kingdom",
      flag: "https://flagcdn.com/w320/gb.png",
    },
    { code: "AU", name: "Australia", flag: "https://flagcdn.com/w320/au.png" },
  ];

  const [userField, setUserField] = useState({
    email: "",
    name: "",
    quakboxEmail: "",
    dob: "",
    country: "",
    password: "",
    confirmPassword: "",
  });

  const [selectedDate, setSelectedDate] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const errors = validateFields();
    if (errors.length > 0) {
      setMessage(
        <ErrorMessage message={errors[0].message} onConfirm={clearMessage} />
      );
    } else {
      signup(); // Proceed with signup if no errors
    }
  };

  const changeUserFieldHandler = (e) => {
    const { name, value } = e.target;
    setUserField({
      ...userField,
      [name]: value,
    });

    // Re-validate the form to clear the current error if resolved
    const errors = validateFields();
    if (errors.length > 0 && errors[0].field === name) {
      setMessage(
        <ErrorMessage message={errors[0].message} onConfirm={clearMessage} />
      );
    } else {
      setMessage(""); // Reset message if there are no errors
    }
  };

  const handleSelect = (country) => {
    setSelectedCountry(country);
    // setDropdownVisible(false); // Close dropdown
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    console.log("Dropdown Toggled", dropdownVisible); // Add this log to check the state
    setDropdownVisible((prevState) => !prevState);
  };
  useEffect(() => {
    console.log("Dropdown state updated:", dropdownVisible);
  }, [dropdownVisible]);

  // Close dropdown if clicked outside
  useEffect(() => {
    const closeDropdown = (e) => {
      if (!e.target.closest(".custom-dropdown")) {
        setDropdownVisible(false); // Close dropdown if clicked outside
      }
    };

    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown); // Cleanup on unmount
  }, []);
  const signup = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/addnew",
        userField
      );
      console.log(response);
      // Handle successful login
      if (response.data.result) {
        setMessage(<SuccessMessage message="Registered successfully!" />);
        if (window.confirm("Registered successfully!")) {
          navigate("/", {});
        }
      }
    } catch (error) {
      if (error.response) {
        setMessage(
          <ErrorMessage
            message="Server error occurred. Please try again."
            onConfirm={clearMessage}
          />
        );
      } else if (error.request) {
        setMessage(
          <ErrorMessage
            message="No response received. Please try again."
            onConfirm={clearMessage}
          />
        );
      } else {
        setMessage(
          <ErrorMessage
            message="Something went wrong. Please try again."
            onConfirm={clearMessage}
          />
        );
      }
    }
  };
  const clearMessage = () => {
    setMessage(""); // Clears the message when called
  };

  const validateFields = () => {
    const errors = [];

    if (!userField.name.trim()) {
      errors.push({ field: "name", message: "Username is required." });
    }
    if (
      !userField.quakboxEmail.trim() ||
      !/^[a-zA-Z0-9._%+-]+$/.test(userField.quakboxEmail)
    ) {
      errors.push({
        field: "quakboxEmail",
        message: "Valid QuakBox email prefix is required.",
      });
    }
    if (
      !userField.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userField.email)
    ) {
      errors.push({
        field: "email",
        message: "A valid email address is required.",
      });
    }
    if (!userField.dob.trim()) {
      errors.push({ field: "dob", message: "Date of Birth is required." });
    }
    if (!selectedCountry) {
      errors.push({ field: "country", message: "Please select a country." });
    }
    if (!userField.password.trim()) {
      errors.push({ field: "password", message: "Password is required." });
    } else if (userField.password.length < 6) {
      errors.push({
        field: "password",
        message: "Password must be at least 6 characters.",
      });
    }
    if (userField.password !== userField.confirmPassword) {
      errors.push({
        field: "confirmPassword",
        message: "Passwords do not match.",
      });
    }
    if (!isChecked) {
      errors.push({
        field: "terms",
        message: "You must agree to the terms and conditions.",
      });
    }

    return errors;
  };
  return (
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

      {/* Right Section */}
      <div
        className="bg-white p-3 col-12 col-md-4"
        style={{ overflowY: "auto", height: "100%" }}
      >
        {/*  */}
        {/* Company Logo and Name for small/medium screens */}
        <div className="d-md-none d-block text-center mb-4">
          <div className="d-flex align-items-center justify-content-center">
            <img
              src={logo}
              alt="Logo"
              style={{ width: "40px", marginRight: "10px" }} // Adjust logo size
            />
            <h2 className="fw-bold mb-0 fs-1">Quakbox</h2>
          </div>
        </div>
        {/*  */}
        <div className="card shadow-lg border-0">
          <div className="card-body p-4">
            <h2 className="text-center fw-bold mb-2 fs-3">Signup</h2>
            <p className="form-subtitle text-center mb-1 small">
              {t("Create a QuakBox account in 5 minutes.")}
            </p>
            {message}
            <form>
              <div className="form-group mb-1">
                <label htmlFor="name" className="fs-6">
                  Username
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={userField.name}
                  className="form-control form-control-sm"
                  placeholder="Enter your username"
                  onChange={(e) => changeUserFieldHandler(e)}
                />
                {validationErrors.name && (
                  <small className="text-danger">{validationErrors.name}</small>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="quakboxEmail" className="fs-6">
                  QuakBox Email
                </label>
                <div style={{ display: "flex" }}>
                  <input
                    type="text"
                    id="quakboxEmail"
                    name="quakboxEmail"
                    value={userField.quakboxEmail}
                    className="form-control form-control-sm"
                    placeholder="Enter your desired email"
                    onChange={(e) => changeUserFieldHandler(e)}
                  />
                  <span
                    style={{
                      background: "#e5e7eb",
                      padding: "0.5rem",
                      borderRadius: "0 4px 4px 0",
                      marginLeft: "-4px",
                    }}
                  >
                    @quakbox.com
                  </span>
                </div>
                {validationErrors.quakboxEmail && (
                  <small className="text-danger">
                    {validationErrors.quakboxEmail}
                  </small>
                )}
              </div>

              <div className="form-group mb-1">
                <label htmlFor="email" className="fs-6">
                  Your Current Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userField.email}
                  className="form-control form-control-sm"
                  placeholder="Enter your email"
                  onChange={(e) => changeUserFieldHandler(e)}
                />
                {validationErrors.email && (
                  <small className="text-danger">
                    {validationErrors.email}
                  </small>
                )}
              </div>

              <div className="form-group mb-1">
                <label htmlFor="dob" className="fs-6">
                  Date Of Birth
                </label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  value={userField.dob}
                  className="form-control form-control-sm"
                  onChange={(e) => changeUserFieldHandler(e)}
                />
                {validationErrors.dob && (
                  <small className="text-danger">{validationErrors.dob}</small>
                )}
              </div>
              {/* Country Dropdown */}
              <div className="mb-3">
                <label htmlFor="country" className="form-label">
                  Country
                </label>
                <div className="mb-3">
                  <div className="d-flex align-items-center">
                    {selectedCountry && (
                      <div
                        className="border p-2 d-flex align-items-center"
                        style={{
                          width: "40px",
                          height: "30px",
                          marginRight: "10px",
                          borderRadius: "4px",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={selectedCountry.flag}
                          alt={selectedCountry.name}
                          style={{
                            width: "30px",
                            height: "20px",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    )}
                    <select
                      className="form-select ms-2"
                      id="country"
                      value={selectedCountry ? selectedCountry.code : ""}
                      onChange={(e) =>
                        handleSelect(
                          countries.find(
                            (country) => country.code === e.target.value
                          )
                        )
                      }
                    >
                      <option value="">Select your country</option>
                      {countries.map((country) => {
                        return (
                          <option key={country.code} value={country.code}>
                            <img
                              src={country.flag}
                              alt={country.name}
                              style={{
                                width: "20px",
                                height: "14px",
                                marginRight: "8px",
                                verticalAlign: "middle",
                              }}
                            />
                            {country.name}
                          </option>
                        );
                      })}
                    </select>
                    {validationErrors.country && (
                      <small className="text-danger ms-2">
                        {validationErrors.country}
                      </small>
                    )}
                  </div>
                </div>
              </div>

              {/* Country Dropdown close */}
              <div className="form-group mb-1">
                <label htmlFor="password" className="fs-6">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={userField.password}
                  className="form-control form-control-sm"
                  placeholder="Create a password"
                  onChange={(e) => changeUserFieldHandler(e)}
                />
                {validationErrors.password && (
                  <small className="text-danger">
                    {validationErrors.password}
                  </small>
                )}
              </div>
              <div className="form-group mb-1">
                <label htmlFor="confirmPassword" className="fs-6">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={userField.confirmPassword}
                  className="form-control form-control-sm"
                  placeholder="Confirm your password"
                  onChange={(e) => changeUserFieldHandler(e)}
                />
                {validationErrors.confirmPassword && (
                  <small className="text-danger">
                    {validationErrors.confirmPassword}
                  </small>
                )}
              </div>
              <div className="form-group d-flex justify-content-between">
                <div>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                  />
                  <label className="fs-6 ms-2" htmlFor="agree">
                    {t("I agree to the")}
                  </label>{" "}
                  <a href="/terms">{t("terms and conditions")}</a>
                </div>
                {validationErrors.terms && (
                  <small className="text-danger">
                    {validationErrors.terms}
                  </small>
                )}
              </div>
              {/* Submit Button */}
              <div className="text-center mt-3">
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  // onClick={signup}
                  onClick={handleSubmit}
                >
                  {t("Quakin")}
                </button>
              </div>
            </form>
            <p className="text-center text-sm mt-2">
              Already have an account?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/");
                }}
                className="text-blue-600 hover:underline"
              >
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
