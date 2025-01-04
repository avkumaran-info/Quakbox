import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logo from "../assets/logo/quak_logo.png";
import bg from "../assets/images/blurred-empty-open-space-office-600nw-2411635125.webp";

const Signup = () => {
  const navigate = useNavigate();

  const { t } = useTranslation();
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);

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
    if (isChecked) {
      alert("Form submitted successfully!");
    } else {
      alert("Please agree to the terms and conditions before submitting.");
    }
  };

  const changeUserFieldHandler = (e) => {
    setUserField({
      ...userField,
      [e.target.name]: e.target.value,
    });
    console.log(userField);
  };

  const handleSelect = (country) => {
    setSelectedCountry(country);
    setDropdownVisible(false); // Close dropdown
  };

  const toggleDropdown = () => {
    setDropdownVisible((prevState) => !prevState);
  };

  const signup = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/addnew",
        userField
      );
      console.log(response);
      // Handle successful login
      if (response.data.result) {
        if (window.confirm("Registered successfully!")) {
          navigate("/", {});
        }
      }
    } catch (error) {
      // Handle errors
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error("Error Response:", error.response.data);
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
      <section className="vh-100">
        <div className="h-100">
          <div className="row h-100 g-0">
            {/* Left Side - Background Image */}
            <div
              className="col-lg-8 d-none d-lg-block position-relative"
              style={{
                backgroundImage: `url(${bg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "100vh", // Ensure full height
                overflow: "hidden", // Prevent scrollbar on left side
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
              style={{
                maxHeight: "100vh", // Ensure the right side takes full height
                overflowY: "auto", // Make the right section scrollable
              }}
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
                  <h2 className="text-center fw-bold mb-2 fs-3">Signup</h2>
                  <p className="form-subtitle text-center mb-1 small">
                    {t("Create a QuakBox account in 5 minutes.")}
                  </p>
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
                    </div>

                    <div className="form-group mb-3">
                      <label htmlFor="country">Country</label>
                      <div
                        className="custom-dropdown form-control d-flex align-items-center"
                        style={{
                          cursor: "pointer",
                          position: "relative",
                          border: "1px solid #ced4da",
                          padding: "0.5rem",
                        }}
                        onClick={toggleDropdown}
                      >
                        {selectedCountry ? (
                          <>
                            <img
                              src={selectedCountry.flag}
                              alt={selectedCountry.name}
                              style={{ width: "20px", marginRight: "8px" }}
                            />
                            {selectedCountry.name}
                          </>
                        ) : (
                          "Select a country"
                        )}
                      </div>
                      {dropdownVisible && (
                        <div
                          className="dropdown-menu mt-1"
                          style={{
                            position: "absolute",
                            backgroundColor: "#fff",
                            border: "1px solidrgb(3, 21, 39)",
                            borderRadius: "4px",
                            maxHeight: "150px",
                            overflowY: "auto",
                            zIndex: 999,
                            width: "100%",
                          }}
                        >
                          {countries.map((country) => (
                            <div
                              key={country.code}
                              className="dropdown-item d-flex align-items-center"
                              style={{ padding: "0.5rem", cursor: "pointer" }}
                              onClick={() => handleSelect(country)}
                            >
                              <img
                                src={country.flag}
                                alt={country.name}
                                style={{ width: "20px", marginRight: "8px" }}
                              />
                              {country.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

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
                    </div>

                    <div className="text-center mt-3">
                      <button
                        type="submit"
                        className="btn btn-primary w-100"
                        onClick={signup}
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
        </div>
      </section>
    </>
  );
};

export default Signup;
