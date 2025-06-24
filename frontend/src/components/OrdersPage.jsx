import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "bootstrap/dist/css/bootstrap.min.css";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError("");
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          setError("You need to be logged in to view your orders.");
          setLoading(false);
          // Optional: redirect to login if not logged in
          navigate("/login");
          return;
        }
        const user = JSON.parse(storedUser);
        const token = user.token;

        // CORRECTED: Request to /orders (no /api)
        const response = await axios.get("http://localhost:5000/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        if (err.response) {
          if (err.response.status === 401 || err.response.status === 403) {
            setError("Your session has expired or you are unauthorized. Please log in again.");
            localStorage.removeItem('user'); // Clear stale token
            navigate("/login"); // Redirect to login
          } else if (err.response.status === 404) {
            setError("Orders not found. It might be an issue with the server route.");
          } else {
            setError(`Failed to fetch orders: ${err.response.data.message || err.message}`);
          }
        } else if (err.request) {
          setError("Network error: Could not connect to the server. Please check your internet connection.");
        } else {
          setError("An unexpected error occurred while fetching orders.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]); // Add navigate to dependency array

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="ms-3 text-muted">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        {error.includes("log in") && (
          <button onClick={() => navigate("/login")} className="btn btn-primary mt-3">
            Go to Login
          </button>
        )}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <p className="alert alert-info">You have no orders yet. Start booking some amazing trips!</p>
        <button onClick={() => navigate("/")} className="btn btn-primary mt-3">
          Browse Listings & Packages
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">
      <h2 className="text-center fw-bold mb-4">Your Orders</h2>
      <div className="row justify-content-center">
        {orders.map((order) => (
          <div key={order._id} className="col-md-8 mb-4">
            <div className={`card shadow-sm h-100 ${order.status === 'Cancelled' ? 'border-danger' : ''}`}>
              <div className="card-body">
                <h5 className="card-title fw-bold text-primary mb-2">
                  Order for: {order.listingName || order.packageName || "N/A"}
                </h5>
                <p className="card-text mb-1">
                  <strong>Type:</strong> {order.type === 'listing' ? 'Listing Booking' : 'Package Purchase'}
                </p>
                {order.type === 'listing' && order.checkInDate && order.checkOutDate && (
                  <>
                    <p className="card-text mb-1">
                      <strong>Check-in:</strong> {new Date(order.checkInDate).toLocaleDateString()}
                    </p>
                    <p className="card-text mb-1">
                      <strong>Check-out:</strong> {new Date(order.checkOutDate).toLocaleDateString()}
                    </p>
                    {order.numDays && (
                      <p className="card-text mb-1">
                        <strong>Nights:</strong> {order.numDays}
                      </p>
                    )}
                  </>
                )}
                <p className="card-text mb-1">
                  <strong>Amount:</strong> ₹{order.amount?.toLocaleString('en-IN') || 'N/A'}
                </p>
                <p className="card-text mb-1">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`badge ${
                      order.status === "Completed"
                        ? "bg-success"
                        : order.status === "Pending"
                        ? "bg-warning text-dark"
                        : "bg-danger"
                    }`}
                  >
                    {order.status}
                  </span>
                </p>
                <p className="card-text mb-1">
                  <small className="text-muted">
                    Ordered on: {new Date(order.createdAt).toLocaleDateString()}{" "}
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </small>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;