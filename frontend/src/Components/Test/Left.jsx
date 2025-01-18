import React from "react";

const Left = ({ news, photos, videos }) => {
  return (
    <div
      className="col-md-3 d-none d-md-block bg-light position-fixed"
      style={{
        top: "55px", // Height of the navbar
        bottom: "60px", // Space reserved for the footer
        left: "0",
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 105px)", // Adjust height for navbar and footer
        // padding: "10px",
        overflow: "hidden", // Prevent scrolling
        boxSizing: "border-box", // Ensure padding doesn't overflow
      }}
    >
      {/* QB News Section */}
      <div className="card mb-1" style={{ flex: 1 }}>
        <div
          className="d-flex align-items-center text-light p-1"
          style={{
            background: "linear-gradient(to right, #c0c0c0, #c0c0c0)",
            color: "white",
            padding: "8px 15px",
            fontSize: "16px",
          }}
        >
          <div className="d-flex  align-items-center">
            {/* QBNews Logo */}
            <h5
              className=" text-center"
              style={{
                background: "linear-gradient(to right, #c0c0c0, #c0c0c0)",
                color: "blue",
                padding: "8px",
                margin: 0,
                fontSize: "13px",
              }}
            >
              QBNews
            </h5>

            {/* Navigation */}
            <nav style={{ flex: 1 }}>
              <ul
                className="list-unstyled d-flex mb-0"
                style={{
                  padding: "0",
                  margin: "0",
                  listStyleType: "none",
                  display: "flex",
                  //   gap: "1px",
                }}
              >
                <li>
                  <a href="#" style={{ textDecoration: "none" }}>
                    {" "}
                    <h5
                      className=" text-center"
                      style={{
                        background:
                          "linear-gradient(to right, #c0c0c0, #c0c0c0)",
                        color: "blue",
                        padding: "8px",
                        margin: 0,
                        fontSize: "13px",
                      }}
                    >
                      {" "}
                      News
                    </h5>
                  </a>
                </li>
                <li>
                  <a href="#" style={{ textDecoration: "none" }}>
                    <h5
                      className=" text-center"
                      style={{
                        background:
                          "linear-gradient(to right, #c0c0c0, #c0c0c0)",
                        color: "blue",
                        padding: "8px",
                        margin: 0,
                        fontSize: "13px",
                      }}
                    >
                      {" "}
                      Entertainment
                    </h5>
                  </a>
                </li>
                <li>
                  <a href="#" style={{ textDecoration: "none" }}>
                    <h5
                      className=" text-center"
                      style={{
                        background:
                          "linear-gradient(to right, #c0c0c0, #c0c0c0)",
                        color: "blue",
                        padding: "8px",
                        margin: 0,
                        fontSize: "13px",
                      }}
                    >
                      {" "}
                      Sports
                    </h5>
                  </a>
                </li>
                <li>
                  <a href="#" style={{ textDecoration: "none" }}>
                    <h5
                      className=" text-center"
                      style={{
                        background:
                          "linear-gradient(to right, #c0c0c0, #c0c0c0)",
                        color: "blue",
                        padding: "8px",
                        margin: 0,
                        fontSize: "13px",
                      }}
                    >
                      {" "}
                      More
                    </h5>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div
          id="newsCarousel"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            {news.slice(0, 3).map((item, index) => (
              <div
                key={index}
                className={`carousel-item ${index === 0 ? "active" : ""}`}
              >
                <div className="text-center">
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      width: "100%", // Ensure image fills the width
                      height: "120px", // Set height
                      objectFit: "fill", // Image fits within the container
                      borderRadius: "0", // Optional: Remove rounding for a box shape
                      border: "1px solid #ccc", // Optional: Add border for a box look
                    }}
                    className="mb-3"
                  />
                  <h6
                    className="fw-bold text-truncate"
                    style={{ fontSize: "14px", maxWidth: "100%" }}
                  >
                    {item.title}
                  </h6>
                  <p
                    className="text-muted text-truncate"
                    style={{ fontSize: "12px", maxWidth: "100%" }}
                  >
                    {item.description}
                  </p>
                  <p
                    className="small text-dark text-truncate"
                    style={{ maxWidth: "100%" }}
                  >
                    {item.longDescription}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#newsCarousel"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#newsCarousel"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>

      {/* Popular Photos and Videos Section */}
      <div className="card mb-4" style={{ flex: 1 }}>
        <h5
          className=" text-center"
          style={{
            background: "linear-gradient(to right, #c0c0c0, #c0c0c0)",
            color: "blue",
            padding: "8px",
            margin: 0,
            fontSize: "16px",
          }}
        >
          Popular Photos and Videos
        </h5>
        <div
          id="mediaCarousel"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            {[...photos, ...videos].slice(0, 3).map((item, index) => (
              <div
                key={index}
                className={`carousel-item ${index === 0 ? "active" : ""}`}
              >
                <div className="text-center">
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      width: "100%", // Ensure image fills the width
                      height: "120px", // Set height
                      objectFit: "fill", // Image fits within the container
                      borderRadius: "0", // Optional: Remove rounding for a box shape
                      border: "1px solid #ccc", // Optional: Add border for a box look
                    }}
                    className="mb-3"
                  />
                  <h6
                    className="fw-bold text-truncate"
                    style={{ fontSize: "14px", maxWidth: "100%" }}
                  >
                    {item.title}
                  </h6>
                  <p
                    className="text-muted text-truncate"
                    style={{ fontSize: "12px", maxWidth: "100%" }}
                  >
                    {item.description}
                  </p>
                  <p
                    className="small text-dark text-truncate"
                    style={{ maxWidth: "100%" }}
                  >
                    {item.longDescription}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#mediaCarousel"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#mediaCarousel"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Left;
