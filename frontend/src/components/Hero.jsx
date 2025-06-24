import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Hero = () => {
  return (
    <div
      className="hero-section d-flex align-items-center justify-content-center text-center"
      style={{
        width: "100vw",
        height: "80vh",
        backgroundImage:
          "url(https://img.freepik.com/free-vector/realistic-travel-background-with-elements_52683-77784.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
        textShadow: "2px 2px 10px rgba(0,0,0,0.6)",
        padding: "20px",
        marginTop: "20px",
        marginBottom: "0px"
      }}
    >
      <div className="container">
        <h1 className="display-4 fw-bold">
          Discover the World's <span className="text-warning">Finest</span>
        </h1>
        <h1 className="display-4 fw-bold">Destinations</h1>
        <p className="lead mt-3">
          Exceptional travel experiences curated for the discerning explorer.
        </p>
      </div>
    </div>
  );
};

export default Hero;
