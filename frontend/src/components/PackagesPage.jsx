import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Placeholder image for packages without an image
const placeholderImage = "https://via.placeholder.com/320x200?text=No+Image";

const PackagesPage = () => {
  // State variables for package data, loading status, and errors
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // useEffect hook to fetch packages when the component mounts
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        // Make an API request to fetch packages from the backend
        const response = await axios.get("http://localhost:5000/getPackages");
        // Update the packages state with the fetched data
        setPackages(response.data);
        // Set loading to false as the data has been fetched
        setLoading(false);
      } catch (err) {
        // Log any errors that occur during fetching
        console.error("Error fetching packages:", err);
        // Set an error message for display
        setError("Failed to load packages. Please try again later."); // More user-friendly message
        // Set loading to false even if there's an error
        setLoading(false);
      }
    };

    fetchPackages(); // Call the fetchPackages function
  }, []); // Empty dependency array means this effect runs once after the initial render

  // Determine if the current user is an admin by checking localStorage
  // This assumes the 'role' is directly stored in localStorage after login.
  // For more robust handling, you might parse the 'user' object from localStorage
  // if it contains other user details along with the role.
  const isAdmin = localStorage.getItem("role") === "admin";

  return (
    <div className="bg-light py-5 mt-4">
      <div className="container">
        <h1 className="text-center text-primary mb-5">Explore Our Packages</h1>

        {/* Conditional rendering based on loading, error, and data availability */}
        {loading ? (
          <div className="text-center text-muted">Loading packages...</div>
        ) : error ? (
          <div className="alert alert-danger text-center">{error}</div>
        ) : packages.length === 0 ? (
          <div className="text-center text-muted">No packages available. Check back soon!</div> // More inviting message
        ) : (
          // Display packages in a responsive grid
          <div className="row justify-content-center g-4">
            {packages.map((pkg) => (
              <div key={pkg._id} className="col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm border-0">
                  <div className="overflow-hidden" style={{ height: "220px" }}>
                    <img
                      src={pkg.image || placeholderImage} // Use placeholder if image is missing
                      className="card-img-top"
                      alt={pkg.name || "Package"} // Use package name as alt text, or generic
                      style={{ objectFit: "cover", height: "100%", width: "100%" }}
                    />
                  </div>
                  <div className="card-body d-flex flex-column justify-content-between">
                    <h5 className="card-title">{pkg.name}</h5>
                    {/* Display cost, handling cases where it might be missing or invalid */}
                    <p className="card-text fw-bold text-primary">
                      {pkg.cost && !isNaN(pkg.cost)
                        ? `₹${pkg.cost.toLocaleString('en-IN')}` // Format cost for Indian Rupees
                        : "Price Not Available"}
                    </p>
                    {/* Link to the individual package details page */}
                    <Link
                      to={`/package/${pkg._id}`}
                      className="text-decoration-none text-end text-primary fw-semibold"
                    >
                      View Details &rarr; {/* Unicode arrow for better appearance */}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Show Add Package Button for Admins Only */}
        {isAdmin && (
          <div className="text-center mt-5">
            <Link to="/add-package" className="btn btn-success btn-lg px-4">
              Add New Package
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackagesPage;