import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported

const AddPackage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    description: "",
    days: "",
    placesCount: "",
    places: "", // Store as string, then convert to array
    cost: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState(null); // State to store user info
  const [token, setToken] = useState(null); // State to store token

  // Effect to load user and token from localStorage and check admin role
  useEffect(() => {
    const rawUser = localStorage.getItem("user");
    // console.log("AddPackage.jsx: Raw user from localStorage:", rawUser);

    if (rawUser) {
      try {
        const parsedUser = JSON.parse(rawUser);
        // console.log("AddPackage.jsx: Parsed user object:", parsedUser);
        setUser(parsedUser);
        setToken(parsedUser.token); // Ensure token is extracted and set

        // Redirect if not an admin
        if (parsedUser.role !== "admin") {
          alert("Access Denied: You must be an admin to add a package.");
          navigate("/"); // Redirect to home or another appropriate page
        }
      } catch (e) {
        console.error("AddPackage.jsx: Failed to parse user from localStorage:", e);
        setError("Failed to load user data. Please login again.");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login"); // Redirect to login on parsing error
      }
    } else {
      // If no user in localStorage, redirect to login
      alert("Please login to access this page.");
      navigate("/login");
    }
  }, [navigate]); // Dependency on navigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setSuccess(""); // Clear previous success messages

    // Basic client-side validation
    const requiredFields = [
      "name",
      "image",
      "description",
      "days",
      "placesCount",
      "places",
      "cost",
      "phone",
    ];
    for (const field of requiredFields) {
      if (!formData[field]) {
        setError(`Please fill in the ${field} field.`);
        return;
      }
    }

    // Convert 'days', 'placesCount', 'cost' to numbers
    const dataToSend = {
      ...formData,
      days: Number(formData.days),
      placesCount: Number(formData.placesCount),
      cost: Number(formData.cost),
      // 'places' will be handled by the backend (comma-separated string to array)
      // or you can do it here: places: formData.places.split(',').map(p => p.trim())
    };

    // Ensure token is available before sending request
    if (!token) {
      setError("Authentication token not found. Please login again.");
      navigate("/login");
      return;
    }

    console.log("Payload to be sent:", dataToSend); // For debugging

    try {
      const response = await axios.post("http://localhost:5000/addPackage", dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`, // Crucial: Send the token in the Authorization header
          "Content-Type": "application/json", // Explicitly set content type
        },
      });
      setSuccess(response.data.message || "Package added successfully!");
      setFormData({ // Clear form after successful submission
        name: "",
        image: "",
        description: "",
        days: "",
        placesCount: "",
        places: "",
        cost: "",
        phone: "",
      });
    } catch (err) {
      console.error("Error adding package:", err);
      // More specific error handling based on backend responses
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(err.response.data.message || "Error adding package.");
      } else if (err.request) {
        // The request was made but no response was received
        setError("Network Error: Could not connect to the server. Please ensure the backend is running.");
      } else {
        // Something happened in setting up the request that triggered an Error
        setError("An unexpected error occurred.");
      }
    }
  };

  // Only render the form if the user is an admin
  if (!user || user.role !== "admin") {
    // You could render a loading state or a "redirecting" message here
    return (
        <div className="container mt-5 text-center">
            <p className="alert alert-info">Checking admin access or redirecting...</p>
        </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg p-4">
            <h2 className="card-title text-center mb-4 text-primary">Add New Package</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <form onSubmit={handleSubmit}>
              {/* Name */}
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Package Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Image URL */}
              <div className="mb-3">
                <label htmlFor="image" className="form-label">Image URL</label>
                <input
                  type="url"
                  className="form-control"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Description */}
              <div className="mb-3">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              {/* Days and Places Count */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="days" className="form-label">Number of Days</label>
                  <input
                    type="number"
                    className="form-control"
                    id="days"
                    name="days"
                    value={formData.days}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="placesCount" className="form-label">Number of Places</label>
                  <input
                    type="number"
                    className="form-control"
                    id="placesCount"
                    name="placesCount"
                    value={formData.placesCount}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </div>
              </div>

              {/* Places (comma-separated) */}
              <div className="mb-3">
                <label htmlFor="places" className="form-label">Places (comma-separated)</label>
                <input
                  type="text"
                  className="form-control"
                  id="places"
                  name="places"
                  value={formData.places}
                  onChange={handleChange}
                  placeholder="e.g., Goa, Mumbai, Delhi"
                  required
                />
              </div>

              {/* Cost and Phone */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="cost" className="form-label">Cost (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    id="cost"
                    name="cost"
                    value={formData.cost}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="phone" className="form-label">Contact Phone</label>
                  <input
                    type="tel" // Use type="tel" for phone numbers
                    className="form-control"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="d-grid gap-2 mt-4">
                <button type="submit" className="btn btn-primary btn-lg">Add Package</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPackage;