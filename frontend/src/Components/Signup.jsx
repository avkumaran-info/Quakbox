import { useState, useEffect } from "react";
import { ToastContainer, toast, Bounce, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logo from "../assets/logo/quak_logo.png";
import bg from "../assets/images/blurred-empty-open-space-office-600nw-2411635125.webp";
import DEFAULT_PROFILE_IMAGE from "../assets/images/user1.png";
import { FaEdit } from "react-icons/fa";

const Signup = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [message, setMessage] = useState(""); // For Success, Error, or Confirmation messages
  const [countries, setCountries] = useState([]);
  const [profileImage, setProfileImage] = useState();
  const [profilePreview, setProfilePreview] = useState(DEFAULT_PROFILE_IMAGE);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [emailOTP, setEmailOTP] = useState("");
  const [mobileOTP, setMobileOTP] = useState("");
  const [countdown, setCountdown] = useState(30);
  const [timer, setTimer] = useState(null);

  const [userField, setUserField] = useState({
    email: "",
    username: "",
    quakboxEmail: "",
    dob: "",
    country: "",
    countryCode: "+91",
    phone: "",
    password: "",
    confirmPassword: "",
    profile_image: "",
  });

  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   const errors = validateFields();
  //   if (errors.length > 0) {
  //     toast.error(errors[0].message, {
  //       position: "top-center",
  //       autoClose: 5000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       theme: "light",
  //       transition: Bounce,
  //     });
  //   } else {
  //     signup();
  //   }
  // };

  // Start countdown on OTP submit
  // Start countdown when modal is opened
  useEffect(() => {
    if (showOTPModal) {
      startCountdown();
    } else {
      clearTimer(); // Ensure the timer stops when modal is closed
    }
  }, [showOTPModal]);

  // Function to start countdown
  const startCountdown = () => {
    setCountdown(5);
    clearTimer(); // Clear any existing timer before starting a new one
    const newTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setTimer(newTimer);
  };

  // Function to clear the timer
  const clearTimer = () => {
    if (timer) clearInterval(timer);
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   sendOTP();
  //   setShowOTPModal(true); // Show OTP modal on form submission
  // };

  const handleSubmit = (event) => {
    event.preventDefault();
    const errors = validateFields();
    if (errors.length > 0) {
      toast.error(errors[0].message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });
    } else {
      // signup();
      sendOTP();
      setShowOTPModal(true);
    }
  };

  const handleOTPInput = (e, index, type) => {
    let value = e.target.value.replace(/[^0-9]/g, ""); // Allow only numbers

    if (type === "email") {
      let newOTPArray = emailOTP.split(""); // Convert string to array
      newOTPArray[index] = value; // Update the value at the given index
      let newOTPString = newOTPArray.join(""); // Convert array back to string
      setEmailOTP(newOTPString);

      if (value && index < 5)
        document.querySelectorAll("input")[index + 1].focus();
    } else {
      let newOTPArray = mobileOTP.split("");
      newOTPArray[index] = value;
      let newOTPString = newOTPArray.join("");
      setMobileOTP(newOTPString);

      if (value && index < 5)
        document.querySelectorAll("input")[index + 7].focus();
    }
  };

  const handleOTPSubmit = async () => {
    console.log(emailOTP);
    // console.log(mobileOTP);

    // if (emailOTP.length === 6 && mobileOTP.length === 6) {
    if (emailOTP.length === 6) {
      await verifyOTP();
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  const handleCloseOTPModal = () => {
    setShowOTPModal(false);
    setEmailOTP(""); // Clear email OTP
    setMobileOTP(""); // Clear mobile OTP
    clearTimer();
  };

  const sendOTP = async () => {
    try {
      const emailVerifyResponse = await axios.post(
        "https://develop.quakbox.com/admin/api/send-otp-mail",
        { email: userField.email }
      );

      // const mobileVerifyResponse = await axios.post(
      //   "https://develop.quakbox.com/admin/api/send-otp-mobile",
      //   { mobile_number: userField.phone }
      // );

      console.log(emailVerifyResponse);
      // console.log(mobileVerifyResponse);
    } catch (error) {
      console.log(error);
    }
  };

  const verifyOTP = async () => {
    try {
      // Send OTP verification requests
      const emailVerifyResponse = await axios.post(
        "https://develop.quakbox.com/admin/api/verify-otp-mail",
        { email: userField.email, otp: emailOTP }
      );

      // const mobileVerifyResponse = await axios.post(
      //   "https://develop.quakbox.com/admin/api/verify-otp-mobile",
      //   { mobile_number: userField.phone, otp: mobileOTP }
      // );

      // Extract status from responses
      const emailSuccess = emailVerifyResponse.data.status; // Expecting true/false from API
      // const mobileSuccess = mobileVerifyResponse.data.status;

      // Handle different cases
      // if (emailSuccess && mobileSuccess) {

      if (emailSuccess) {
        toast.success("✅ OTP Verified Successfully! 🎉", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Bounce,
        });
        console.log("HAPPY LOGIN");
        signup();
      }
      //  else if (emailSuccess && !mobileSuccess) {
      //   toast.error(
      //     mobileVerifyResponse.data.message || "❌ Incorrect Mobile OTP!",
      //     {
      //       position: "top-center",
      //       autoClose: 5000,
      //       hideProgressBar: false,
      //       closeOnClick: true,
      //       pauseOnHover: true,
      //       draggable: true,
      //       theme: "light",
      //       transition: Bounce,
      //     }
      //   );
      //   console.log("Enter the correct OTP for mobile");
      // } else if (!emailSuccess && mobileSuccess) {
      //   toast.error(
      //     emailVerifyResponse.data.message || "❌ Incorrect Email OTP!",
      //     {
      //       position: "top-center",
      //       autoClose: 5000,
      //       hideProgressBar: false,
      //       closeOnClick: true,
      //       pauseOnHover: true,
      //       draggable: true,
      //       theme: "light",
      //       transition: Bounce,
      //     }
      //   );
      //   console.log("Email OTP is incorrect");
      // }
      else {
        toast.error("❌ Invalid or expired OTP for both email and mobile!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Bounce,
        });
        console.log("Wrong OTP in both email and mobile");
      }

      setShowOTPModal(false);
    } catch (error) {
      // Handle API error response
      const errorMessage =
        error.response?.data?.message ||
        "⚠️ OTP Verification Failed! Try again.";

      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });

      console.error(
        "OTP Verification Error:",
        error.response?.data || error.message
      );
    }
  };

  const changeUserFieldHandler = (e) => {
    const { name, value } = e.target;
    setUserField((prevUserField) => ({
      ...prevUserField,
      [name]: value,
    }));
    console.log(userField);
  };

  const handleSelect = (selectedOption) => {
    setSelectedCountry(selectedOption);

    // Update userField with selected country code
    setUserField((prevUserField) => ({
      ...prevUserField,
      country: selectedOption.code, // Ensure the country code is set correctly
    }));
  };

  useEffect(() => {
    // Retrieve geo_country from localStorage
    const geoCountryData = localStorage.getItem("geo_country");
    if (geoCountryData) {
      // Parse the geo_country data and set it in state
      const parsedCountries = JSON.parse(geoCountryData);
      setCountries(parsedCountries);
      console.log(parsedCountries);
    } else {
      // Fallback to default countries if geo_country is not found
      setCountries([
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
        {
          code: "AU",
          name: "Australia",
          flag: "https://flagcdn.com/w320/au.png",
        },
      ]);
    }
  }, []);

  useEffect(() => {
    const closeDropdown = (e) => {
      if (!e.target.closest(".custom-dropdown")) {
        setDropdownVisible(false); // Close dropdown if clicked outside
      }
    };

    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown); // Cleanup on unmount
  }, []);

  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setProfileImage(file);

      // Show image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const signup = async () => {
    try {
      const formData = new FormData();
      formData.append("username", userField.username);
      formData.append("email", userField.email);
      formData.append("birthdate", userField.dob);
      formData.append("country", userField.country);
      formData.append("country_code", userField.countryCode); // Send country code
      formData.append("favourite_country", userField.country); // Send favorite country
      formData.append(
        "mobile_number",
        `${userField.countryCode}${userField.phone}`
      );
      formData.append("password", userField.password);
      formData.append("password_confirmation", userField.confirmPassword);

      // If no image is selected, use default profile image
      if (profileImage) {
        formData.append("profile_image", profileImage);
      } else {
        // Convert the default image to a File object
        const response = await fetch(DEFAULT_PROFILE_IMAGE);
        const blob = await response.blob();
        const defaultFile = new File([blob], "default-profile.png", {
          type: "image/png",
        });
        formData.append("profile_image", defaultFile);
      }

      const response = await axios.post(
        "https://develop.quakbox.com/admin/api/register",
        formData
      );

      if (response.data.result) {
        toast.success("Registered successfully!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Bounce,
        });

        if (window.confirm("Registered successfully!")) {
          navigate("/");
        }
      }
    } catch (error) {
      if (error.response) {
        toast.error(
          error.response.data.errors.email[0] || "Registration failed",
          {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
            transition: Bounce,
          }
        );
      } else if (error.request) {
        toast.error("No response received. Please try again.", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Bounce,
        });
      } else {
        toast.error("Something went wrong. Please try again.", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Bounce,
        });
      }
      console.log(error);
    }
  };

  const validateFields = () => {
    const errors = [];

    // ✅ Username Validation
    if (!userField.username.trim()) {
      errors.push({ field: "username", message: "Username is required." });
    }

    const usernameRegex = /^(?!.*__)(?![_])[a-zA-Z0-9_]{3,20}(?<![_])$/;
    if (userField.username.trim() && !usernameRegex.test(userField.username)) {
      errors.push({
        field: "username",
        message:
          "Enter a valid username (only letters, numbers, and underscores, 3-20 characters, no double underscores, no start/end underscores).",
      });
    }

    // ✅ QuakBox Email Validation
    if (
      !userField.quakboxEmail.trim() ||
      !/^[a-zA-Z0-9._%+-]+$/.test(userField.quakboxEmail)
    ) {
      errors.push({
        field: "quakboxEmail",
        message: "Valid QuakBox email prefix is required.",
      });
    }

    // ✅ Mobile Number Validation
    if (!userField.phone.trim()) {
      errors.push({ field: "phone", message: "Mobile number is required." });
    } else if (!/^\d{10}$/.test(userField.phone)) {
      errors.push({
        field: "phone",
        message: "Mobile number must be exactly 10 digits.",
      });
    }

    // ✅ Email Validation
    if (!userField.email.trim()) {
      errors.push({
        field: "email",
        message: "A valid email address is required.",
      });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userField.email)) {
      errors.push({
        field: "email",
        message: "Enter a valid email format (e.g., user@example.com).",
      });
    }

    // ✅ Date of Birth (DOB) Validation
    if (!userField.dob.trim()) {
      errors.push({ field: "dob", message: "Date of Birth is required." });
    } else {
      const birthDate = new Date(userField.dob);
      const today = new Date();

      if (birthDate > today) {
        errors.push({
          field: "dob",
          message: "Date of Birth cannot be in the future.",
        });
      }

      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const dayDiff = today.getDate() - birthDate.getDate();

      if (
        age < 13 ||
        (age === 13 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)))
      ) {
        errors.push({
          field: "dob",
          message: "You must be at least 13 years old.",
        });
      }
    }

    // ✅ Country Selection Validation
    if (!selectedCountry) {
      errors.push({ field: "country", message: "Please select a country." });
    }

    // ✅ Password Validation
    if (!userField.password.trim()) {
      errors.push({ field: "password", message: "Password is required." });
    } else if (userField.password.length < 6) {
      errors.push({
        field: "password",
        message: "Password must be at least 6 characters long.",
      });
    }

    // ✅ Confirm Password Validation
    if (userField.password !== userField.confirmPassword) {
      errors.push({
        field: "confirmPassword",
        message: "Passwords do not match.",
      });
    }

    // ✅ Terms & Conditions Validation
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
      {/* OTP Verification Modal */}
      {showOTPModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1050 }}
        >
          <div className="modal fade show d-block" tabIndex="1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content p-4 text-center rounded-3">
                <div className="modal-header border-0 justify-content-center">
                  <h4 className="fw-bold mb-2">OTP Verification</h4>
                  <button
                    type="button"
                    className="btn-close position-absolute end-0 me-3"
                    onClick={handleCloseOTPModal}
                  ></button>
                </div>
                <div className="modal-body">
                  <p className="text-secondary fs-6">
                    Please enter the OTP sent to your email and mobile.
                  </p>

                  {/* Email Section */}
                  <div className="text-start mb-3">
                    <label className="fw-bold fs-6">
                      Email: {userField.email}
                    </label>
                    {/* <p className="fw-bold text-dark mb-1">{userField.email}</p> */}
                  </div>

                  {/* Email OTP Input */}
                  <div className="d-flex justify-content-center gap-2 mb-3">
                    {[...Array(6)].map((_, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength="1"
                        value={emailOTP[index] || ""}
                        onChange={(e) => handleOTPInput(e, index, "email")}
                        className="form-control text-center fw-bold fs-4 border rounded-2"
                        style={{ width: "50px", height: "50px" }}
                      />
                    ))}
                  </div>

                  {/* Mobile Section */}
                  {/* <div className="text-start mb-3">
                    <label className="fw-bold fs-6">
                      Mobile Number:{userField.countryCode} {userField.phone}
                    </label>
                  </div> */}

                  {/* Mobile OTP Input */}
                  {/* <div className="d-flex justify-content-center gap-2 mb-4">
                    {[...Array(6)].map((_, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength="1"
                        value={mobileOTP[index] || ""}
                        onChange={(e) => handleOTPInput(e, index, "mobile")}
                        className="form-control text-center fw-bold fs-4 border rounded-2"
                        style={{ width: "50px", height: "50px" }}
                      />
                    ))}
                  </div> */}

                  {/* Verify Button */}
                  <button
                    className="btn btn-primary w-100 py-2 fw-bold fs-5"
                    onClick={handleOTPSubmit}
                  >
                    Verify OTP
                  </button>

                  {/* Resend Option with Countdown */}
                  <p className="mt-3 text-secondary fs-6">
                    Didn't receive the code?{" "}
                    {countdown > 0 ? (
                      <span className="fw-bold text-dark">{`Resend in ${countdown}s`}</span>
                    ) : (
                      <span
                        className="text-primary fw-bold"
                        style={{ cursor: "pointer" }}
                        onClick={startCountdown}
                      >
                        Resend
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Left Section */}
      <div
        className="bg-light col-12 col-md-8 position-relative d-none d-md-block"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        ></div>
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
        <div
          className=" text-white d-flex align-items-center justify-content-center mx-auto"
          style={{ height: "20vh", width: "50%" }}
        >
          <div className="position-absolute bottom-0 start-0 end-0 text-center text-white p-3">
            <hr />
            <div className="d-flex flex-column">
              <div className="language-selector mb-2">
                <div className="d-flex justify-content-center flex-wrap gap-2">
                  {[
                    { code: "ar", label: "العربية" },
                    { code: "en", label: "English" },
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
              <div>
                <p className="small mb-0">
                  © 2024 Quakbox. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div
        className="bg-white p-3 col-12 col-md-4"
        style={{ overflowY: "auto", height: "100%" }}
      >
        <div className="d-md-none d-block text-center mb-4">
          <div className="d-flex align-items-center justify-content-center">
            <img
              src={logo}
              alt="Logo"
              style={{ width: "40px", marginRight: "10px" }}
            />
            <h2 className="fw-bold mb-0 fs-1">Quakbox</h2>
          </div>
        </div>
        <div className="card shadow-lg border-0">
          <div className="card-body p-4">
            <h2 className="text-center fw-bold mb-2 fs-3">Signup</h2>
            <p className="form-subtitle text-center mb-1 small">
              {t("Create a QuakBox account in 5 minutes.")}
            </p>
            {message}
            <form>
              <div className="text-center position-relative">
                {/* Profile Image Clickable */}
                <img
                  src={profilePreview}
                  alt="Profile"
                  className="rounded-circle"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    document.getElementById("profileUpload").click()
                  }
                />

                {/* Edit Icon and Text Overlay */}
                <div
                  className="position-absolute d-flex flex-column align-items-center justify-content-center"
                  style={{
                    bottom: "0",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "100px", // Same as image width
                    height: "50px", // Smaller height
                    background: "rgba(0, 0, 0, 0.5)",
                    color: "white",
                    borderRadius: "0 0 50px 50px", // Rounded bottom to match the image
                    fontSize: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "4px",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    document.getElementById("profileUpload").click()
                  }
                >
                  <FaEdit size={12} />
                  <span>Edit Profile</span>
                </div>

                {/* Hidden File Input */}
                <input
                  type="file"
                  accept="image/*"
                  id="profileUpload"
                  className="d-none"
                  onChange={handleProfileImageChange}
                />
              </div>

              <div className="form-group mb-1">
                <label htmlFor="name" className="fs-6">
                  Username
                </label>
                <input
                  type="text"
                  id="name"
                  name="username"
                  value={userField.name}
                  className="form-control form-control-sm"
                  placeholder="Enter your username"
                  onChange={changeUserFieldHandler}
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
                    onChange={changeUserFieldHandler}
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
                <label htmlFor="phone" className="fs-6">
                  Mobile Number
                </label>
                <div className="d-flex">
                  {/* Country Code Dropdown */}
                  <select
                    className="form-select me-2"
                    style={{ width: "130px" }} // Adjust width as needed
                    value={userField.countryCode}
                    onChange={(e) =>
                      setUserField({
                        ...userField,
                        countryCode: e.target.value,
                      })
                    }
                  >
                    {countries.map((country) => (
                      <option key={country.code} value={country.phone_code}>
                        {country.country_name} ({country.phone_code})
                      </option>
                    ))}
                  </select>

                  {/* Mobile Number Input */}
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={userField.phone}
                    className="form-control"
                    placeholder="Enter mobile number"
                    onChange={(e) =>
                      setUserField({ ...userField, phone: e.target.value })
                    }
                  />
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
                  onChange={changeUserFieldHandler}
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
                  onChange={changeUserFieldHandler}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="country" className="form-label">
                  Country
                </label>
                <div className="mb-3">
                  <div className="d-flex align-items-center">
                    {selectedCountry && (
                      <div
                        className="border d-flex align-items-center"
                        style={{
                          width: "40px",
                          height: "30px",
                          marginRight: "10px",
                          borderRadius: "4px",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={selectedCountry.country_image}
                          alt={selectedCountry.country_name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    )}
                    <div className="custom-dropdown">
                      <select
                        className="form-select ms-2"
                        id="country"
                        value={userField.country} // Now correctly linked to userField
                        onChange={(e) =>
                          handleSelect(
                            countries.find(
                              (country) => country.code === e.target.value
                            )
                          )
                        }
                      >
                        <option value="">Select your country</option>
                        {countries.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.country_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
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
                  onChange={changeUserFieldHandler}
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
                  onChange={changeUserFieldHandler}
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
        </div>
      </div>
    </div>
  );
};

export default Signup;
