import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const placeholderImage = "https://via.placeholder.com/600x350?text=No+Image";

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false); // State to track admin status

  // ⭐ NEW STATE FOR DATES ⭐
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [numDays, setNumDays] = useState(0); // To store number of days

  // --- Effect to fetch listing details and check admin status ---
  useEffect(() => {
    const fetchListingDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/getListing/${id}`);
        setListing(response.data);
      } catch (err) {
        console.error("Error fetching listing details:", err);
        if (err.response && err.response.status === 404) {
          setError("Listing not found. It might have been deleted or never existed.");
        } else if (err.name === 'CastError') {
          setError("Invalid listing ID.");
        } else {
          setError("Failed to fetch listing details. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    const checkAdminStatus = () => {
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
    };

    fetchListingDetails();
    checkAdminStatus();
  }, [id]);

  // ⭐ NEW: useEffect to calculate total amount when dates or listing price change ⭐
  useEffect(() => {
    if (checkInDate && checkOutDate && listing?.price) {
      const start = new Date(checkInDate);
      const end = new Date(checkOutDate);

      // Ensure valid dates and end date is after start date
      if (start < end) {
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Calculate number of nights
        setNumDays(diffDays);
        setTotalAmount(diffDays * listing.price);
        setError(""); // Clear any previous errors related to dates
      } else {
        setNumDays(0);
        setTotalAmount(0);
        if (checkInDate && checkOutDate) { // Only set error if both dates are selected but invalid
          setError("Check-out date must be after check-in date.");
        }
      }
    } else {
        setNumDays(0);
        setTotalAmount(0);
        // Do not set error here, as dates might just not be selected yet
    }
  }, [checkInDate, checkOutDate, listing?.price]);


  // --- Memoized handleBookNow ---
  const handleBookNow = useCallback(() => {
    if (!checkInDate || !checkOutDate) {
      setError("Please select both check-in and check-out dates.");
      return;
    }
    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      setError("Check-out date must be after check-in date.");
      return;
    }
    if (new Date(checkInDate) < new Date()) { // Prevent booking in the past
      setError("Check-in date cannot be in the past.");
      return;
    }
    if (numDays <= 0) { // Should be caught by previous checks, but good to have
        setError("Number of days must be at least 1.");
        return;
    }


    if (listing?.price && listing._id && listing.name && totalAmount > 0) {
      navigate("/payment", {
        state: {
          listingId: listing._id,
          listingName: listing.name,
          cost: totalAmount, // Pass the calculated total amount
          type: 'listing',
          checkInDate: checkInDate,   // ⭐ Pass check-in date ⭐
          checkOutDate: checkOutDate, // ⭐ Pass check-out date ⭐
          numDays: numDays            // ⭐ Pass number of days ⭐
        }
      });
    } else {
      setError("Unable to proceed with booking. Please check details and dates.");
    }
  }, [navigate, listing, checkInDate, checkOutDate, totalAmount, numDays]);

  // --- Memoized handleDelete for better performance and consistency ---
  const handleDelete = useCallback(async () => {
    if (!window.confirm("Are you sure you want to delete this listing? This action cannot be undone.")) {
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
        alert("You must be logged in to delete a listing.");
        navigate("/login");
        return;
      }

      const response = await axios.delete(`http://localhost:5000/deleteListing/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        alert("Listing deleted successfully!");
        navigate("/all-listings");
      } else {
        setError(response.data.message || "Failed to delete listing.");
      }
    } catch (err) {
      console.error("Failed to delete listing:", err);
      if (err.response) {
        if (err.response.status === 401 || err.response.status === 403) {
          alert("Authentication required or insufficient permissions to delete this listing. Please log in as an admin.");
          navigate("/login");
        } else if (err.response.status === 404) {
          alert("Listing not found. It might have already been deleted.");
          navigate("/all-listings");
        } else {
          alert(`Error deleting listing: ${err.response.data.message || err.message}`);
        }
      } else if (err.request) {
        alert("Network error: Could not connect to the server.");
      } else {
        alert("An unexpected error occurred during deletion.");
      }
    }
  }, [id, navigate]);

  // --- Conditional Renderings for Loading, Error, and Not Found ---
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-muted">Loading listing details...</p>
      </div>
    );
  }

  if (error && !checkInDate && !checkOutDate) { // Only show error if not date related, or if dates are problematic
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button onClick={() => navigate("/all-listings")} className="btn btn-primary mt-3">
          Back to Listings
        </button>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container mt-5 text-center">
        <p className="alert alert-info">Listing not found or could not be loaded.</p>
        <button onClick={() => navigate("/all-listings")} className="btn btn-primary mt-3">
          Back to Listings
        </button>
      </div>
    );
  }

  // Get today's date for min attribute of date inputs
  const today = new Date().toISOString().split('T')[0];

  // --- Main Render for Listing Details ---
  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow p-4 border-0" style={{ maxWidth: "600px", width: "100%" }}>
        {/* Image at the Top */}
        <img
          src={listing.image || placeholderImage}
          alt={listing.name || "Listing Image"}
          className="card-img-top mb-3"
          style={{ height: "280px", objectFit: "cover", borderRadius: "6px" }}
        />

        {/* Card Content */}
        <div className="card-body">
          <h3 className="card-title fw-bold">{listing.name}</h3>

          {/* Details Section */}
          <p className="card-text text-muted">{listing.description}</p>
          <p className="card-text"><strong>Location:</strong> {listing.district}, {listing.state}</p>
          <p className="card-text">
            <strong>Price:</strong> ₹{listing.price?.toLocaleString('en-IN') || 'N/A'} per night
          </p>
          <p className="card-text">
            <strong>Contact:</strong> {listing.contact || "+91 XXXXXXXXXX"}
          </p>

          {/* ⭐ NEW: Date Input Fields ⭐ */}
          <div className="mb-3">
            <label htmlFor="checkInDate" className="form-label fw-bold">Check-in Date</label>
            <input
              type="date"
              className="form-control"
              id="checkInDate"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              min={today} // Prevent selecting past dates
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="checkOutDate" className="form-label fw-bold">Check-out Date</label>
            <input
              type="date"
              className="form-control"
              id="checkOutDate"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              min={checkInDate || today} // Check-out cannot be before check-in or today
              required
            />
          </div>

          {/* ⭐ NEW: Display Calculated Total Amount ⭐ */}
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          {checkInDate && checkOutDate && numDays > 0 && (
            <div className="mt-4 p-3 bg-info-subtle rounded-3 text-dark">
              <h5 className="fw-bold mb-2">Booking Summary:</h5>
              <p className="mb-1">
                <i className="bi bi-calendar-check me-2"></i>
                Check-in: <strong>{new Date(checkInDate).toLocaleDateString()}</strong>
              </p>
              <p className="mb-1">
                <i className="bi bi-calendar-x me-2"></i>
                Check-out: <strong>{new Date(checkOutDate).toLocaleDateString()}</strong>
              </p>
              <p className="mb-1">
                <i className="bi bi-moon me-2"></i>
                Nights: <strong>{numDays}</strong>
              </p>
              <h4 className="mt-3 text-primary fw-bold">
                Total Amount: ₹{totalAmount.toLocaleString('en-IN')}
              </h4>
            </div>
          )}


          {/* Buttons */}
          <div className="d-flex gap-2 mt-4">
            <button
              onClick={handleBookNow}
              className={`btn btn-primary fw-bold shadow-sm ${isAdmin ? 'w-50' : 'w-100'}`}
              style={{ borderRadius: "6px", height: "45px" }}
              disabled={!listing || !checkInDate || !checkOutDate || totalAmount <= 0 || !!error} // Disable if dates/amount are invalid
            >
              Book Now
            </button>
            {/* Show Delete button only if user is admin */}
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

export default ListingDetails;