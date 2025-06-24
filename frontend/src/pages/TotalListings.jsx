import React from "react";

const TotalListings = ({ listings }) => {
  return (
    <div className="container mt-5">
      <h2>All Destinations</h2>
      <div className="row">
        {listings.map((listing, index) => (
          <div key={index} className="col-md-4">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">{listing.title}</h5>
                <p className="card-text">{listing.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TotalListings;
