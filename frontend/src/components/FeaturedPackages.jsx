import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const FeaturedPackages = () => {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await axios.get("http://localhost:5000/getPackages");
      setPackages(res.data.slice(0, 3)); // Only show first 3 packages
    } catch (err) {
      console.error("Error fetching packages:", err);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center fw-bold mb-4 text-primary"></h2>
      <div className="row justify-content-center">
        {packages.length > 0 ? (
          packages.map((pkg) => (
            <div key={pkg.id} className="col-md-4 d-flex justify-content-center">
              <div
                className="card shadow-sm border rounded-3 mb-4 d-flex flex-column"
                style={{
                  width: "320px",  // Increased width
                  height: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <img
                  src={pkg.image || "https://via.placeholder.com/400"}
                  className="card-img-top rounded-top"
                  alt={pkg.name}
                  style={{ height: "180px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="card-title fw-bold text-primary">{pkg.name}</h5>
                    <p className="card-text text-muted small">{pkg.description}</p>
                    <p className="fw-bold">₹{pkg.cost}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted">No packages available</p>
        )}
      </div>
    </div>
  );
};

export default FeaturedPackages;
