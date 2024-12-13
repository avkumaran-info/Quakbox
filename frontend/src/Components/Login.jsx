import React from "react";
import quakboxLogo from "../assets/logo/quak_logo.png"; 

const Login = () => {
  return (
    <>
      <section className="vh-100" style={{ backgroundColor: "#9A616D;" }}>
        <div className="container py-3">
          <div className="row d-flex justify-content-center align-items-center">
            <div className="col col-xl-10">
              <div className="card" style={{ "border-radius": "1rem;" }}>
                <div className="row g-0">
                  <div className="col-md-6 col-lg-5 d-none d-md-block">
                    <div
                      id="carouselExampleIndicators"
                      class="carousel slide "
                      data-bs-ride="carousel"
                    >
                      <div class="carousel-indicators">
                        <button
                          type="button"
                          data-bs-target="#carouselExampleIndicators"
                          data-bs-slide-to="0"
                          class="active"
                          aria-current="true"
                          aria-label="Slide 1"
                        ></button>
                        <button
                          type="button"
                          data-bs-target="#carouselExampleIndicators"
                          data-bs-slide-to="1"
                          aria-label="Slide 2"
                        ></button>
                        <button
                          type="button"
                          data-bs-target="#carouselExampleIndicators"
                          data-bs-slide-to="2"
                          aria-label="Slide 3"
                        ></button>
                      </div>
                      <div class="carousel-inner">
                        <div class="carousel-item active">
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
                            alt="login form"
                            className="img-fluid"
                            style={{
                              borderRadius: "1rem 0 0 1rem",
                              width: "1200px",
                            }}
                          />
                        </div>
                        <div class="carousel-item">
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
                            alt="login form"
                            className="img-fluid"
                            style={{ borderRadius: "1rem 0 0 1rem" }}
                          />
                        </div>
                        <div class="carousel-item">
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
                            alt="login form"
                            className="img-fluid"
                            style={{ borderRadius: "1rem 0 0 1rem" }}
                          />
                        </div>
                      </div>
                      <button
                        class="carousel-control-prev"
                        type="button"
                        data-bs-target="#carouselExampleIndicators"
                        data-bs-slide="prev"
                      >
                        <span
                          class="carousel-control-prev-icon"
                          aria-hidden="true"
                        ></span>
                        <span class="visually-hidden">Previous</span>
                      </button>
                      <button
                        class="carousel-control-next"
                        type="button"
                        data-bs-target="#carouselExampleIndicators"
                        data-bs-slide="next"
                      >
                        <span
                          class="carousel-control-next-icon"
                          aria-hidden="true"
                        ></span>
                        <span class="visually-hidden">Next</span>
                      </button>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-7 d-flex align-items-center">
                    <div className="card-body p-4 p-lg-4 text-black">
                      <form>
                        <div className="d-flex align-items-center mb-2 pb-1">
                          <div class="col-4 col-md-1">
                            <img src={quakboxLogo} className="img-fluid" alt="Quakbox Logo" />
                          </div>
                          <div className="ms-2"></div>
                          <span className="h1 fw-bold ">Quakbox</span>
                        </div>

                        <h5
                          className="fw-normal pb-3"
                          style={{ letterSpacing: " 1px;" }}
                        >
                          Sign into your account
                        </h5>

                        <div data-mdb-input-init className="form-outline mb-2">
                          <label
                            className="form-label"
                            htmlFor="form2Example17"
                          >
                            Email address
                          </label>
                          <input
                            type="email"
                            id="form2Example17"
                            className="form-control form-control-lg"
                          />
                        </div>

                        <div data-mdb-input-init className="form-outline mb-2">
                          <label
                            className="form-label"
                            htmlFor="form2Example27"
                          >
                            Password
                          </label>
                          <input
                            type="password"
                            id="form2Example27"
                            className="form-control form-control-lg"
                          />
                        </div>

                        <div className="form-check mb-2  d-flex justify-content-between">
                          <div>
                            <input
                              className="form-check-input "
                              type="checkbox"
                              value=""
                              id="form1Example3"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="form1Example3"
                            >
                              {" "}
                              Remember me{" "}
                            </label>
                          </div>

                          <a href="#!">Forgot password?</a>
                        </div>

                        <div className="pt-1 mb-2">
                          <button
                            data-mdb-button-init
                            data-mdb-ripple-init
                            className="btn btn-primary btn-lg btn-block"
                            type="button"
                          >
                            Login
                          </button>
                        </div>

                        <div className="d-flex align-items-center mb-3">
                          <div className="flex-grow-1 border-top"></div>
                          <span className="mx-2 text-muted">or</span>
                          <div className="flex-grow-1 border-top"></div>
                        </div>

                        <button
                          type="submit"
                          style={{ backgroundColor: "rgb(240, 27, 27)" }}
                          data-mdb-button-init
                          data-mdb-ripple-init
                          className="btn btn-primary btn-lg btn-block mb-2 w-100"
                        >
                          <i className="fab fa-google me-2 "></i> Google
                        </button>

                        <button
                          type="submit"
                          style={{ backgroundColor: " #3b5998" }}
                          data-mdb-button-init
                          data-mdb-ripple-init
                          className="btn btn-primary btn-lg btn-block w-100"
                        >
                          <i className="fab fa-facebook-f mb-2 "></i> Facebook
                        </button>
                        <p
                          className="mb-2 mt-3 pb-lg-2"
                          style={{ color: " #393f81" }}
                        >
                          Don't have an account?{" "}
                          <a href="#!" style={{ color: "#393f81;" }}>
                            Register here
                          </a>
                        </p>
                        <a href="#!" className="small text-muted">
                          Terms of use.
                        </a>
                        <a href="#!" className="small text-muted">
                          Privacy policy
                        </a>
                      </form>
                    </div>
                  </div>
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
