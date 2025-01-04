import React, { useState, useEffect } from "react";
import logo from "../assets/logo/quak_logo.png";
import bg from "../assets/images/blurred-empty-open-space-office-600nw-2411635125.webp";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../i18n.js";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState("forget"); // "forget", "otp", "reset"
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0); // Countdown timer for resend OTP

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer); // Clean up the interval on component unmount or when countdown is zero
  }, [countdown]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  const handleResendOtp = async () => {
    setLoading(true);
    try {
      // Send OTP API Call to resend OTP
      const response = await fetch(
        "https://develop.quakbox.com/admin/api/forgot-password/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();
      if (data.status && data.code === 200) {
        alert(data.message); // Show success message
        setCountdown(30); // Set countdown to 30 seconds for example
      } else {
        alert("Failed to resend OTP");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while resending OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleForgetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Send OTP API Call
      const response = await fetch(
        "https://develop.quakbox.com/admin/api/forgot-password/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();
      if (data.status && data.code === 200) {
        alert(data.message); // Show success message
        setStep("otp"); // Move to OTP step
      } else {
        alert("Failed to send OTP");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Verify OTP API Call
      const response = await fetch(
        "https://develop.quakbox.com/admin/api/forgot-password/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp }),
        }
      );
      const data = await response.json();

      if (data.status && data.code === 200) {
        alert("OTP verified successfully"); // Show success message
        setStep("reset"); // Move to reset password step
      } else {
        // Handle validation errors from the API response
        if (data.errors) {
          if (data.errors.email) {
            alert(data.errors.email[0]);
          }
          if (data.errors.otp) {
            alert(data.errors.otp[0]);
          }
        } else {
          alert("Failed to verify OTP");
        }
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while verifying OTP");
    } finally {
      setLoading(false);
    }
  };
  // password - atul123456
  // atul.ambore9@gmail.com
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "https://develop.quakbox.com/admin/api/forgot-password/reset",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
            password: newPassword,
            password_confirmation: confirmPassword, // Include the confirmation field
          }),
        }
      );
      const data = await response.json();

      if (data.status && data.code === 200) {
        alert("Password reset successfully");
        navigate("/");
      } else if (data.errors) {
        if (data.errors.password) {
          alert(data.errors.password[0]);
        }
      } else {
        alert("Failed to reset password");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while resetting the password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="vh-100 vw-100" style={{ overflow: "hidden" }}>
      <div className="h-100">
        <div className="row h-100 g-0">
          <div
            className="col-lg-8 d-none d-lg-block position-relative"
            style={{
              backgroundImage: `url(${bg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div
              className="position-absolute top-0 start-0 w-100 h-100"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            ></div>

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

            <div className="position-absolute bottom-0 start-0 end-0 text-center text-white p-3">
              <hr />
              <div className="d-flex flex-column">
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

                <div>
                  <p className="small mb-0">
                    © 2024 Quakbox. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            className="col-lg-4 col-md-12 col-12 d-flex align-items-center justify-content-center"
            style={{ minHeight: "100vh" }}
          >
            <div className="p-4 w-100" style={{ maxWidth: "550px" }}>
              <div className="d-block d-lg-none text-center mb-4">
                <div className="d-flex align-items-center justify-content-center">
                  <img
                    src={logo}
                    alt="Logo"
                    style={{ width: "40px", marginRight: "10px" }}
                  />
                  <h2 className="fw-bold mb-0 fs-1">Quakbox</h2>
                </div>
              </div>

              <div className="bg-white rounded p-1">
                {step === "forget" && (
                  <>
                    <h2 className="text-center fw-bold mb-3 text-primary">
                      Forget Password
                    </h2>
                    <form
                      onSubmit={handleForgetPassword}
                      className="w-100 mx-auto p-4 shadow-lg rounded bg-white d-flex flex-column justify-content-center align-items-center"
                      style={{ maxWidth: "400px" }} // Add max width for the form
                    >
                      <div className="mb-3 w-100">
                        <label
                          htmlFor="email"
                          className="form-label fw-semibold"
                        >
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="form-control"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>

                      <button
                        type="button"
                        className="btn btn-link w-100 text-decoration-none mb-3"
                        onClick={() => navigate("/")}
                      >
                        <i className="bi bi-arrow-left-circle"></i> Back to Sign
                        In
                      </button>

                      <button
                        type="submit"
                        className="btn btn-primary w-100 mb-3 py-2"
                        disabled={loading}
                      >
                        {loading ? "Sending..." : "Submit"}
                      </button>
                    </form>

                    <div className="text-center my-3 text-muted">or</div>

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

                    <div className="text-center">
                      <p className=" mt-3 mb-1 ">Don't have an account?</p>
                      <button
                        className="btn btn-outline-dark rounded-pill px-4 py-2 mt-2"
                        onClick={() => navigate("/signup")}
                      >
                        Sign Up
                      </button>
                    </div>
                  </>
                )}

                {step === "otp" && (
                  <>
                    <h2 className="text-center fw-bold mb-4 text-primary">
                      Verification
                    </h2>
                    <form
                      onSubmit={handleVerifyOtp}
                      className="w-100 mx-auto p-4 shadow-lg rounded bg-white"
                      style={{ maxWidth: "400px" }} // Limiting the form width
                    >
                      {/*  */}
                      <div className="mb-4">
                        <label
                          htmlFor="otp"
                          className="form-label fw-semibold text-dark"
                        >
                          {t("Enter OTP sent to your email")}
                        </label>
                        <input
                          type="text"
                          id="otp"
                          className="form-control form-control-lg"
                          placeholder="Enter OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          required
                        />
                      </div>
                      {/*  */}
                      <button
                        type="submit"
                        className="btn btn-primary w-100 mb-3 py-2"
                        disabled={loading}
                      >
                        {loading ? (
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        ) : (
                          "Verify OTP"
                        )}
                      </button>
                      {/* Resend OTP Link */}
                      <div className="text-center mt-3">
                        <button
                          type="button"
                          className="btn btn-link text-decoration-none"
                          onClick={handleResendOtp}
                          disabled={loading || countdown > 0}
                        >
                          {loading ? (
                            "Resending..."
                          ) : countdown > 0 ? (
                            `Resend in ${countdown}s`
                          ) : (
                            <span>
                              If you didn't receive any code !
                              <span className="text-danger fw-bold">
                                {" "}
                                Resend
                              </span>
                            </span>
                          )}
                        </button>
                      </div>
                    </form>
                  </>
                )}

                {step === "reset" && (
                  <>
                    <h2 className="text-center fw-bold mb-4 text-primary">
                      Reset New Password
                    </h2>
                    <form onSubmit={handleResetPassword}>
                      {/* New Password Field */}
                      <div className="mb-3">
                        <label htmlFor="newPassword" className="form-label">
                          {t("Enter New Password")}
                        </label>
                        <input
                          type="password"
                          id="newPassword"
                          className="form-control"
                          placeholder="New Password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>

                      {/* Confirm New Password Field */}
                      <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">
                          {t("Confirm Password")}
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          className="form-control"
                          placeholder="Confirm Password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        className="btn btn-primary w-100 mb-3"
                        disabled={loading || newPassword !== confirmPassword}
                      >
                        {loading ? "Resetting..." : "Reset Password"}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgetPassword;
