import React from "react";

const Home = () => {
  const openNewPage = (path) => {
    window.open(window.location.origin + path, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="hero-section text-center p-5"
      style={{
        backgroundImage: "url('https://source.unsplash.com/1600x900/?travel')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <h1>Explore the World's Best Destinations</h1>
      <p>Find and list amazing places to visit.</p>

      {/* Buttons to open in new tab */}
      <div className="mt-4">
        <button className="btn btn-primary mx-2" onClick={() => openNewPage("/all-listings")}>
          All Destinations
        </button>
        <button className="btn btn-warning mx-2" onClick={() => openNewPage("/add-listing")}>
          Add Listing
        </button>
      </div>
    </div>
  );
};

export default Home;
