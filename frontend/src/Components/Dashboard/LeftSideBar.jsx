import React from "react";

const LeftSidebar = ({ news, photos, videos }) => {
  return (
    <div
      className="col-3 bg-light position-fixed d-none d-md-block"
      style={{
        top: "56px", // Height of the navbar
        bottom: "0",
        left: "0",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto", // Allows scrolling if content overflows
      }}
    >
      <div className="card bg-light h-100 d-flex justify-content-center flex-column">
        {/* QB News Section */}
        <div
          className="flex-grow-1 d-flex flex-column"
          style={{ overflow: "hidden" }}
        >
          <div className="text-center mb-3 p-1">
            {" "}
            {/* Centered Header */}
            <h5
              className="text-light text-center h-100"
              style={{
                background: "linear-gradient(to right, #1e90ff, #87cefa)", // Static gradient
                color: "white",
                padding: "8px", // Optional padding for better spacing
                margin: 0, // Ensure no unwanted margins
              }}
            >
              QB News
            </h5>
          </div>
          <div
            id="newsCarousel"
            className="carousel slide flex-grow-1"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner h-100">
              {news.map((item, index) => (
                <div
                  key={index}
                  className={`carousel-item ${index === 0 ? "active" : ""}`}
                  style={{ height: "100%" }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      height: "100%",
                      justifyContent: "space-between",
                      padding: "15px",
                    }}
                  >
                    <img
                      src={item.image}
                      className="d-block"
                      alt={item.title}
                      style={{
                        width: "100%",
                        height: "180px", // Standardized height
                        objectFit: "cover",
                        borderRadius: "5px",
                      }}
                    />
                    <div className="text-center mt-3">
                      <h6 className="fw-bold">{item.title}</h6>
                      <p className="text-muted mb-1">{item.description}</p>
                      <p className="text-dark small">{item.longDescription}</p>
                    </div>
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
        <div
          className="flex-grow-1 d-flex flex-column mt-4"
          style={{ overflow: "hidden" }}
        >
          <div className="text-center mb-3">
            {" "}
            {/* Centered Header */}
            <h5
              className="text-light text-center h-100"
              style={{
                background: "linear-gradient(to right, #1e90ff, #87cefa)", // Static gradient
                color: "white",
                padding: "8px", // Optional padding for better spacing
                margin: 0, // Ensure no unwanted margins
              }}
            >
              Popular Photos and Videos
            </h5>
          </div>
          <div
            id="mediaCarousel"
            className="carousel slide flex-grow-1"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner h-100">
              {[...photos, ...videos].map((item, index) => (
                <div
                  key={index}
                  className={`carousel-item ${index === 0 ? "active" : ""}`}
                  style={{ height: "100%" }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      height: "100%",
                      justifyContent: "space-between",
                      padding: "15px",
                    }}
                  >
                    <img
                      src={item.image}
                      className="d-block"
                      alt={item.title}
                      style={{
                        width: "100%",
                        height: "180px", // Standardized height
                        objectFit: "cover",
                        borderRadius: "5px",
                      }}
                    />
                    <div className="text-center mt-3">
                      <h6 className="fw-bold">{item.title}</h6>
                      <p className="text-muted mb-1">{item.description}</p>
                      <p className="text-dark small">{item.longDescription}</p>
                    </div>
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
    </div>
  );
};

export default LeftSidebar;
