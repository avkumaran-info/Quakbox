import { useState, useEffect } from "react";
import { ToastContainer, toast, Bounce, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

  //All contry codes infront of mobile no
  const countryCodes = [
    { code: "+93", country: "Afghanistan" },
    { code: "+355", country: "Albania" },
    { code: "+213", country: "Algeria" },
    { code: "+376", country: "Andorra" },
    { code: "+244", country: "Angola" },
    { code: "+1", country: "Antigua and Barbuda" },
    { code: "+54", country: "Argentina" },
    { code: "+374", country: "Armenia" },
    { code: "+61", country: "Australia" },
    { code: "+43", country: "Austria" },
    { code: "+994", country: "Azerbaijan" },
    { code: "+1", country: "Bahamas" },
    { code: "+973", country: "Bahrain" },
    { code: "+880", country: "Bangladesh" },
    { code: "+1", country: "Barbados" },
    { code: "+375", country: "Belarus" },
    { code: "+32", country: "Belgium" },
    { code: "+501", country: "Belize" },
    { code: "+229", country: "Benin" },
    { code: "+975", country: "Bhutan" },
    { code: "+591", country: "Bolivia" },
    { code: "+387", country: "Bosnia and Herzegovina" },
    { code: "+267", country: "Botswana" },
    { code: "+55", country: "Brazil" },
    { code: "+673", country: "Brunei" },
    { code: "+359", country: "Bulgaria" },
    { code: "+226", country: "Burkina Faso" },
    { code: "+257", country: "Burundi" },
    { code: "+855", country: "Cambodia" },
    { code: "+237", country: "Cameroon" },
    { code: "+1", country: "Canada" },
    { code: "+238", country: "Cape Verde" },
    { code: "+236", country: "Central African Republic" },
    { code: "+235", country: "Chad" },
    { code: "+56", country: "Chile" },
    { code: "+86", country: "China" },
    { code: "+57", country: "Colombia" },
    { code: "+269", country: "Comoros" },
    { code: "+242", country: "Congo" },
    { code: "+506", country: "Costa Rica" },
    { code: "+385", country: "Croatia" },
    { code: "+53", country: "Cuba" },
    { code: "+357", country: "Cyprus" },
    { code: "+420", country: "Czech Republic" },
    { code: "+45", country: "Denmark" },
    { code: "+253", country: "Djibouti" },
    { code: "+1", country: "Dominica" },
    { code: "+1", country: "Dominican Republic" },
    { code: "+670", country: "East Timor" },
    { code: "+593", country: "Ecuador" },
    { code: "+20", country: "Egypt" },
    { code: "+503", country: "El Salvador" },
    { code: "+240", country: "Equatorial Guinea" },
    { code: "+291", country: "Eritrea" },
    { code: "+372", country: "Estonia" },
    { code: "+251", country: "Ethiopia" },
    { code: "+679", country: "Fiji" },
    { code: "+358", country: "Finland" },
    { code: "+33", country: "France" },
    { code: "+241", country: "Gabon" },
    { code: "+220", country: "Gambia" },
    { code: "+995", country: "Georgia" },
    { code: "+49", country: "Germany" },
    { code: "+233", country: "Ghana" },
    { code: "+30", country: "Greece" },
    { code: "+1", country: "Grenada" },
    { code: "+502", country: "Guatemala" },
    { code: "+224", country: "Guinea" },
    { code: "+245", country: "Guinea-Bissau" },
    { code: "+592", country: "Guyana" },
    { code: "+509", country: "Haiti" },
    { code: "+504", country: "Honduras" },
    { code: "+36", country: "Hungary" },
    { code: "+354", country: "Iceland" },
    { code: "+91", country: "India" },
    { code: "+62", country: "Indonesia" },
    { code: "+98", country: "Iran" },
    { code: "+964", country: "Iraq" },
    { code: "+353", country: "Ireland" },
    { code: "+972", country: "Israel" },
    { code: "+39", country: "Italy" },
    { code: "+225", country: "Ivory Coast" },
    { code: "+1", country: "Jamaica" },
    { code: "+81", country: "Japan" },
    { code: "+962", country: "Jordan" },
    { code: "+7", country: "Kazakhstan" },
    { code: "+254", country: "Kenya" },
    { code: "+686", country: "Kiribati" },
    { code: "+850", country: "North Korea" },
    { code: "+82", country: "South Korea" },
    { code: "+965", country: "Kuwait" },
    { code: "+996", country: "Kyrgyzstan" },
    { code: "+856", country: "Laos" },
    { code: "+371", country: "Latvia" },
    { code: "+961", country: "Lebanon" },
    { code: "+266", country: "Lesotho" },
    { code: "+231", country: "Liberia" },
    { code: "+218", country: "Libya" },
    { code: "+423", country: "Liechtenstein" },
    { code: "+370", country: "Lithuania" },
    { code: "+352", country: "Luxembourg" },
    { code: "+389", country: "Macedonia" },
    { code: "+261", country: "Madagascar" },
    { code: "+265", country: "Malawi" },
    { code: "+60", country: "Malaysia" },
    { code: "+960", country: "Maldives" },
    { code: "+223", country: "Mali" },
    { code: "+356", country: "Malta" },
    { code: "+692", country: "Marshall Islands" },
    { code: "+222", country: "Mauritania" },
    { code: "+230", country: "Mauritius" },
    { code: "+52", country: "Mexico" },
    { code: "+691", country: "Micronesia" },
    { code: "+373", country: "Moldova" },
    { code: "+377", country: "Monaco" },
    { code: "+976", country: "Mongolia" },
    { code: "+382", country: "Montenegro" },
    { code: "+212", country: "Morocco" },
    { code: "+258", country: "Mozambique" },
    { code: "+95", country: "Myanmar" },
    { code: "+264", country: "Namibia" },
    { code: "+674", country: "Nauru" },
    { code: "+977", country: "Nepal" },
    { code: "+31", country: "Netherlands" },
    { code: "+64", country: "New Zealand" },
    { code: "+505", country: "Nicaragua" },
    { code: "+227", country: "Niger" },
    { code: "+234", country: "Nigeria" },
    { code: "+47", country: "Norway" },
    { code: "+968", country: "Oman" },
    { code: "+92", country: "Pakistan" },
    { code: "+680", country: "Palau" },
    { code: "+970", country: "Palestine" },
    { code: "+507", country: "Panama" },
    { code: "+675", country: "Papua New Guinea" },
    { code: "+595", country: "Paraguay" },
    { code: "+51", country: "Peru" },
    { code: "+63", country: "Philippines" },
    { code: "+48", country: "Poland" },
    { code: "+351", country: "Portugal" },
    { code: "+974", country: "Qatar" },
    { code: "+40", country: "Romania" },
    { code: "+7", country: "Russia" },
    { code: "+250", country: "Rwanda" },
    { code: "+1", country: "Saint Kitts and Nevis" },
    { code: "+1", country: "Saint Lucia" },
    { code: "+1", country: "Saint Vincent" },
    { code: "+685", country: "Samoa" },
    { code: "+378", country: "San Marino" },
    { code: "+239", country: "Sao Tome and Principe" },
    { code: "+966", country: "Saudi Arabia" },
    { code: "+221", country: "Senegal" },
    { code: "+381", country: "Serbia" },
    { code: "+248", country: "Seychelles" },
    { code: "+232", country: "Sierra Leone" },
    { code: "+65", country: "Singapore" },
    { code: "+421", country: "Slovakia" },
    { code: "+386", country: "Slovenia" },
    { code: "+677", country: "Solomon Islands" },
    { code: "+252", country: "Somalia" },
    { code: "+27", country: "South Africa" },
    { code: "+211", country: "South Sudan" },
    { code: "+34", country: "Spain" },
    { code: "+94", country: "Sri Lanka" },
    { code: "+249", country: "Sudan" },
    { code: "+597", country: "Suriname" },
    { code: "+268", country: "Swaziland" },
    { code: "+46", country: "Sweden" },
    { code: "+41", country: "Switzerland" },
    { code: "+963", country: "Syria" },
    { code: "+886", country: "Taiwan" },
    { code: "+992", country: "Tajikistan" },
    { code: "+255", country: "Tanzania" },
    { code: "+66", country: "Thailand" },
    { code: "+228", country: "Togo" },
    { code: "+676", country: "Tonga" },
    { code: "+1", country: "Trinidad and Tobago" },
    { code: "+216", country: "Tunisia" },
    { code: "+90", country: "Turkey" },
    { code: "+993", country: "Turkmenistan" },
    { code: "+688", country: "Tuvalu" },
    { code: "+256", country: "Uganda" },
    { code: "+380", country: "Ukraine" },
    { code: "+971", country: "United Arab Emirates" },
    { code: "+44", country: "United Kingdom" },
    { code: "+1", country: "United States" },
    { code: "+598", country: "Uruguay" },
    { code: "+998", country: "Uzbekistan" },
    { code: "+678", country: "Vanuatu" },
    { code: "+379", country: "Vatican City" },
    { code: "+58", country: "Venezuela" },
    { code: "+84", country: "Vietnam" },
    { code: "+967", country: "Yemen" },
    { code: "+260", country: "Zambia" },
    { code: "+263", country: "Zimbabwe" }
  ];

  const [selectedCountryCode, setSelectedCountryCode] = useState("+1");
  const [userField, setUserField] = useState({
    email: "",
    name: "",
    quakboxEmail: "",
    dob: "",
    country: "",
    password: "",
    confirmPassword: "",
    mobileNo: "", //We set the mobileNo
  });

  const handleMobileNumberChange = (e) => {
    const value = e.target.value;
    // Only update if the value contains digits, spaces, or dashes
    if (/^[\d\s-]*$/.test(value)) {
      setUserField({
        ...userField,
        mobileNo: value
      });
    }
  };

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
      signup(); // Proceed with signup if no errors
    }
  };

  // const changeUserFieldHandler = (e) => {
  //   const { name, value } = e.target;
  //   setUserField({
  //     ...userField,
  //     [name]: value,
  //   });

  //   // Re-validate the form to clear the current error if resolved
  //   const errors = validateFields();
  //   if (errors.length > 0 && errors[0].field === name) {
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
  //     setMessage(""); // Reset message if there are no errors
  //   }
  // };
  const changeUserFieldHandler = (e) => {
    const { name, value } = e.target;
    setUserField({
      ...userField,
      [name]: value,
    });

    // Optionally clear the message if the field being edited resolves the issue
    if (message) {
      const errors = validateFields();
      if (errors.length === 0 || errors.every((err) => err.field !== name)) {
        setMessage("");
      }
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
          navigate("/", {});
        }
      }
    } catch (error) {
      if (error.response) {
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
    //We apply the validation of Mobile No
    if (!userField.mobileNo.trim()) {
      errors.push({ field: "mobileNo", message: "Mobile number is required." });
    } else if (!/^\+?[1-9]\d{9,14}$/.test(userField.mobileNo)) {
      errors.push({
        field: "mobileNo",
        message: "Please enter a valid mobile number (10-15 digits).",
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

              {/* We create a mobile no & call them   */}
              <div className="form-group mb-1">
                <label htmlFor="mobileNo" className="fs-6">
                  Mobile Number
                </label>
                <div className="input-group">
                  <select
                    className="form-select form-select-sm"
                    style={{ maxWidth: '120px' }}
                    value={selectedCountryCode}
                    onChange={(e) => setSelectedCountryCode(e.target.value)}
                  >
                    {countryCodes.map((country) => (
                      <option key={`${country.code}-${country.country}`} value={country.code}>
                        {country.code} {country.country}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    id="mobileNo"
                    name="mobileNo"
                    value={userField.mobileNo}
                    className="form-control form-control-sm"
                    placeholder="Enter your mobile number"
                    onChange={handleMobileNumberChange}
                  />
                </div>
              </div>


              {/* Split Date Picker */}
              <div className="form-group mb-1">
                <label htmlFor="dob" className="fs-6">
                  Date Of Birth
                </label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  value={userField.dob}
                  max={new Date().toISOString().split('T')[20]}
                  className="form-control form-control-sm date-input"
                  onChange={(e) => changeUserFieldHandler(e)}
                  style={{
                    padding: '0.5rem',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    width: '100%',
                    fontSize: '0.875rem',
                    backgroundColor: '#fff',
                    cursor: 'pointer',
                    colorScheme: 'light',
                  }}
                />
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
                    <div className="custom-dropdown">
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
                        {countries.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.name}
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
          {/* ToastContainer to display toasts */}

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
