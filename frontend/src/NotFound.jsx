import React from "react";

const Notfound = () => {
  const containerStyle = {
    marginLeft: "auto",
    marginRight: "auto",
    width: "520px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center", // Center the content
    paddingTop: "50px", // Add some top padding
  };

  const leftColumnStyle = {
    float: "left",
    width: "200px",
    textAlign: "center",
    paddingRight: "20px",
  };

  const rightColumnStyle = {
    float: "left",
    width: "300px",
    textAlign: "left",
  };

  const clearBothStyle = {
    clear: "both",
  };

  const errorCodeStyle = {
    verticalAlign: "inherit",
    fontSize: "48px",
    fontWeight: "bold",
    color: "#FF6347",
  };

  const errorDescriptionStyle = {
    verticalAlign: "inherit",
    fontSize: "18px",
    color: "#333",
  };

  const errorBriefStyle = {
    verticalAlign: "inherit",
    fontSize: "16px",
    color: "#555", // Set the color to a slightly lighter gray
  };

  return (
    <div style={containerStyle}>
      <div style={leftColumnStyle}>
        <span className="error_code" style={errorCodeStyle}>
          404
        </span>
        <br />
        <span className="error_description" style={errorDescriptionStyle}>
          Not found
        </span>
      </div>
      <div style={rightColumnStyle}>
        <span className="error_brief" style={errorBriefStyle}>
          Resource not found on this server
        </span>
      </div>
      <div style={clearBothStyle}></div>
    </div>
  );
};

export default Notfound;