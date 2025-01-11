import React from "react";

const test = () => {
  return (
    <div>
      <div className="form-group">
        <label htmlFor="country">Country</label>
        <div className="custom-dropdown">
          <div
            className="dropdown-btn"
            onClick={() => setDropdownVisible(!dropdownVisible)} // Toggle dropdown visibility
          >
            {selectedCountry ? (
              <>
                <img
                  src={selectedCountry.flag}
                  alt={selectedCountry.name}
                  style={{
                    width: "20px",
                    height: "14px",
                    marginRight: "0.5rem",
                  }}
                />
                <span>{selectedCountry.name}</span>
              </>
            ) : (
              "Select a country"
            )}
          </div>
          {dropdownVisible && (
            <div className="dropdown-menu">
              {countries.map((country) => (
                <div
                  key={country.code}
                  className="dropdown-item"
                  onClick={() => handleSelect(country)}
                >
                  <img
                    src={country.flag}
                    alt={country.name}
                    style={{
                      width: "20px",
                      height: "14px",
                      marginRight: "0.5rem",
                    }}
                  />
                  <span>{country.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default test;
