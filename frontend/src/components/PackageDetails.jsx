

// src/components/PackageDetails.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const placeholderImage = "https://via.placeholder.com/600x350?text=No+Image";

const PackageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [packageDetails, setPackageDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/getPackage/${id}`);
        setPackageDetails(response.data);
      } catch (err) {
        console.error("Error fetching package details:", err);
        if (err.response && err.response.status === 404) {
          setError("Package not found. It might have been deleted or never existed.");
        } else if (err.name === 'CastError') {
          setError("Invalid package ID.");
        } else {
          setError("Failed to fetch package details. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPackageDetails();
  }, [id]);

  const handleBookNow = useCallback(() => {
    if (packageDetails?.cost && packageDetails?._id && packageDetails?.name) {
      navigate("/payment", {
        state: {
          packageId: packageDetails._id,
          packageName: packageDetails.name,
          cost: packageDetails.cost, // ⭐ CRITICAL: Pass the package cost here ⭐
          type: 'package',          // ⭐ CRITICAL: Indicate this is a package booking ⭐
        }
      });
    } else {
      setError("Unable to proceed with booking. Package details are incomplete.");
    }
  }, [navigate, packageDetails]);

  // Handle Delete (if you have an admin functionality for packages)
  // You'd need a similar check for admin role as in ListingDetails
  const handleDelete = useCallback(async () => {
    if (!window.confirm("Are you sure you want to delete this package? This action cannot be undone.")) {
      return;
    }

    try {
      const storedUser = localStorage.getItem("user");
      let token = null;
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          token = user.token;
        } catch (e) {
          console.error("Failed to parse user for token:", e);
          alert("Session expired or invalid user data. Please log in again.");
          navigate("/login");
          return;
        }
      }

      if (!token) {
        alert("You must be logged in to delete a package.");
        navigate("/login");
        return;
      }

      const response = await axios.delete(`http://localhost:5000/deletePackage/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        alert("Package deleted successfully!");
        navigate("/packages"); // Redirect to all packages
      } else {
        setError(response.data.message || "Failed to delete package.");
      }
    } catch (err) {
      console.error("Failed to delete package:", err);
      if (err.response) {
        if (err.response.status === 401 || err.response.status === 403) {
          alert("Authentication required or insufficient permissions to delete this package. Please log in as an admin.");
          navigate("/login");
        } else if (err.response.status === 404) {
          alert("Package not found. It might have already been deleted.");
          navigate("/packages");
        } else {
          alert(`Error deleting package: ${err.response.data.message || err.message}`);
        }
      } else if (err.request) {
        alert("Network error: Could not connect to the server.");
      } else {
        alert("An unexpected error occurred during deletion.");
      }
    }
  }, [id, navigate]);

  // Admin status check (similar to ListingDetails)
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.role === "admin") {
          setIsAdmin(true);
        }
      }
    } catch (e) {
      console.error("Failed to parse user from localStorage:", e);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-muted">Loading package details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button onClick={() => navigate("/packages")} className="btn btn-primary mt-3">
          Back to Packages
        </button>
      </div>
    );
  }

  if (!packageDetails) {
    return (
      <div className="container mt-5 text-center">
        <p className="alert alert-info">Package not found or could not be loaded.</p>
        <button onClick={() => navigate("/packages")} className="btn btn-primary mt-3">
          Back to Packages
        </button>
      </div>
    );
  }

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow p-4 border-0" style={{ maxWidth: "600px", width: "100%" }}>
        <img
          src={packageDetails.image || placeholderImage}
          alt={packageDetails.name || "Package Image"}
          className="card-img-top mb-3"
          style={{ height: "280px", objectFit: "cover", borderRadius: "6px" }}
        />
        <div className="card-body">
          <h3 className="card-title fw-bold">{packageDetails.name}</h3>
          <p className="card-text text-muted">{packageDetails.description}</p>
          <p className="card-text">
            <strong>Duration:</strong> {packageDetails.days} Days
          </p>
          <p className="card-text">
            <strong>Places to Visit:</strong> {packageDetails.placesCount} (
            {packageDetails.places.join(", ")})
          </p>
          <p className="card-text">
            <strong>Cost:</strong> ₹{packageDetails.cost?.toLocaleString('en-IN') || 'N/A'}
          </p>
          <p className="card-text">
            <strong>Contact:</strong> {packageDetails.phone || "+91 XXXXXXXXXX"}
          </p>
          <div className="d-flex gap-2 mt-4">
            <button
              onClick={handleBookNow}
              className={`btn btn-primary fw-bold shadow-sm ${isAdmin ? 'w-50' : 'w-100'}`}
              style={{ borderRadius: "6px", height: "45px" }}
              disabled={!packageDetails?.cost || packageDetails.cost <= 0} // Disable if cost is invalid
            >
              Book Package Now
            </button>
            {isAdmin && (
              <button
                onClick={handleDelete}
                className="btn btn-danger w-50 fw-bold shadow-sm"
                style={{ borderRadius: "6px", height: "45px" }}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetails;