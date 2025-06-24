// import React, { useEffect, useState, useCallback } from "react";
// import { useLocation, useNavigate } from "react-router-dom"; // Use useLocation to get passed state
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";

// const PaymentPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   // Get package/listing details from navigation state
//   const { packageId, packageName, cost, type, listingId, listingName, checkInDate } = location.state || {};

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [userToken, setUserToken] = useState(null);
//   const [paymentSuccess, setPaymentSuccess] = useState(false); // To track if payment was "successful"

//   // Simulating a payment process (replace with actual payment gateway integration)
//   const handleSimulatePayment = useCallback(async () => {
//     setLoading(true);
//     setError("");

//     if (!userToken) {
//       setError("User not authenticated. Please log in.");
//       navigate("/login");
//       setLoading(false);
//       return;
//     }

//     if (!cost) {
//       setError("Payment amount is missing. Please go back and select a package/listing.");
//       setLoading(false);
//       return;
//     }

//     try {
//       // Simulate payment processing delay
//       await new Promise((resolve) => setTimeout(resolve, 2000));

//       // --- After successful simulated payment, create an order ---
//       const orderData = {
//         type: type, // 'listing' or 'package'
//         amount: cost,
//         packageName: packageName, // Can be undefined if it's a listing
//         listingName: listingName, // Can be undefined if it's a package
//         packageId: packageId, // Can be undefined if it's a listing
//         listingId: listingId, // Can be undefined if it's a package
//         checkInDate: checkInDate // Relevant for listings
//       };

//       const response = await axios.post("http://localhost:5000/orders", orderData, { // Use /orders without /api
//         headers: {
//           Authorization: `Bearer ${userToken}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (response.status === 201) {
//         setPaymentSuccess(true);
//         alert("Payment successful and order placed!");
//         // Optionally navigate to orders page or a confirmation page
//         // navigate('/orders');
//       } else {
//         setError(response.data.message || "Failed to place order after payment.");
//       }
//     } catch (err) {
//       console.error("Payment/Order creation error:", err);
//       if (err.response) {
//         if (err.response.status === 401 || err.response.status === 403) {
//           setError("Authentication failed or unauthorized to place order. Please log in again.");
//           localStorage.removeItem("user");
//           localStorage.removeItem("token");
//           navigate("/login");
//         } else if (err.response.status === 400) {
//           setError(`Invalid order data: ${err.response.data.message}`);
//         } else {
//           setError(`Error processing payment/order: ${err.response.data.message || err.response.statusText}`);
//         }
//       } else if (err.request) {
//         setError("Network error: Could not connect to the server.");
//       } else {
//         setError("An unexpected error occurred.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [userToken, cost, packageName, packageId, type, listingId, listingName, checkInDate, navigate]);


//   useEffect(() => {
//     // Check for user token in localStorage when the component mounts
//     try {
//       const storedUser = localStorage.getItem("user");
//       if (storedUser) {
//         const parsedUser = JSON.parse(storedUser);
//         if (parsedUser.token) {
//           setUserToken(parsedUser.token);
//         } else {
//           setError("No authentication token found. Please log in.");
//           navigate("/login");
//         }
//       } else {
//         setError("You are not logged in. Please log in to make a payment.");
//         navigate("/login");
//       }
//     } catch (e) {
//       console.error("Failed to parse user from localStorage:", e);
//       setError("Failed to load user data. Please log in again.");
//       localStorage.removeItem("user");
//       localStorage.removeItem("token");
//       navigate("/login");
//     } finally {
//       setLoading(false); // Set loading to false once token check is done
//     }
//   }, [navigate]); // navigate is a dependency for useCallback, not useEffect directly related to userToken.

//   // Conditional rendering
//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//         <p className="ms-3 text-muted">Preparing payment...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="container mt-5 text-center">
//         <div className="alert alert-danger" role="alert">
//           {error}
//         </div>
//         <button onClick={() => navigate(-1)} className="btn btn-primary mt-3">
//           Go Back
//         </button>
//       </div>
//     );
//   }

//   if (paymentSuccess) {
//     return (
//       <div className="container mt-5 text-center">
//         <div className="alert alert-success" role="alert">
//           Payment and Order Confirmed!
//         </div>
//         <h3 className="mb-3">Thank you for your booking!</h3>
//         <p>Your order for {packageName || listingName} has been successfully placed.</p>
//         <button onClick={() => navigate("/orders")} className="btn btn-info me-2">
//           View Your Orders
//         </button>
//         <button onClick={() => navigate("/")} className="btn btn-primary">
//           Continue Browse
//         </button>
//       </div>
//     );
//   }

//   // Main render for payment form
//   return (
//     <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light">
//       <div className="card shadow p-4 border-0" style={{ maxWidth: "500px", width: "100%" }}>
//         <h2 className="text-center mb-4 text-primary">Confirm Your Booking</h2>
//         <div className="mb-3">
//           <p className="fw-bold">Item:</p>
//           <p>{packageName || listingName || "N/A"}</p>
//         </div>
//         <div className="mb-3">
//           <p className="fw-bold">Total Amount:</p>
//           <h4 className="text-success">₹{cost?.toLocaleString('en-IN') || 'N/A'}</h4>
//         </div>

//         {/* Payment Form (Simplified for demonstration) */}
//         <div className="mb-3">
//           <label htmlFor="cardName" className="form-label">Name on Card</label>
//           <input type="text" className="form-control" id="cardName" placeholder="John Doe" required />
//         </div>
//         <div className="mb-3">
//           <label htmlFor="cardNumber" className="form-label">Card Number</label>
//           <input type="text" className="form-control" id="cardNumber" placeholder="XXXX XXXX XXXX XXXX" required />
//         </div>
//         <div className="row mb-3">
//           <div className="col-md-6">
//             <label htmlFor="expiryDate" className="form-label">Expiry Date</label>
//             <input type="text" className="form-control" id="expiryDate" placeholder="MM/YY" required />
//           </div>
//           <div className="col-md-6">
//             <label htmlFor="cvv" className="form-label">CVV</label>
//             <input type="text" className="form-control" id="cvv" placeholder="XXX" required />
//           </div>
//         </div>

//         <button
//           onClick={handleSimulatePayment}
//           className="btn btn-primary w-100 mt-3 py-2 fw-bold"
//           disabled={loading || !userToken || !cost} // Disable if loading, no token, or no cost
//         >
//           {loading ? "Processing..." : "Pay Now"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PaymentPage;
import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ⭐ UPDATED: Get all relevant details from navigation state ⭐
  const {
    packageId,
    packageName,
    cost, // This will now be the calculated total amount for listings
    type, // 'listing' or 'package'
    listingId,
    listingName,
    checkInDate, // ⭐ NEW: Check-in date for listings ⭐
    checkOutDate, // ⭐ NEW: Check-out date for listings ⭐
    numDays // ⭐ NEW: Number of days for listings ⭐
  } = location.state || {};

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userToken, setUserToken] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Simulating a payment process
  const handleSimulatePayment = useCallback(async () => {
    setLoading(true);
    setError("");

    if (!userToken) {
      setError("User not authenticated. Please log in.");
      navigate("/login");
      setLoading(false);
      return;
    }

    if (!cost) {
      setError("Payment amount is missing. Please go back and select a package/listing.");
      setLoading(false);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate payment processing delay

      // --- After successful simulated payment, create an order ---
      const orderData = {
        type: type,
        amount: cost,
        packageName: packageName,
        listingName: listingName,
        packageId: packageId,
        listingId: listingId,
        checkInDate: checkInDate,   // ⭐ Pass check-in date to backend ⭐
        checkOutDate: checkOutDate, // ⭐ Pass check-out date to backend ⭐
        numDays: numDays // Pass numDays if your backend schema can store it (optional)
      };

      const response = await axios.post("http://localhost:5000/orders", orderData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        setPaymentSuccess(true);
        // No need for alert here, as we show success message on page
        // alert("Payment successful and order placed!");
      } else {
        setError(response.data.message || "Failed to place order after payment.");
      }
    } catch (err) {
      console.error("Payment/Order creation error:", err);
      if (err.response) {
        if (err.response.status === 401 || err.response.status === 403) {
          setError("Authentication failed or unauthorized to place order. Please log in again.");
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          navigate("/login");
        } else if (err.response.status === 400) {
          setError(`Invalid order data: ${err.response.data.message}`);
        } else {
          setError(`Error processing payment/order: ${err.response.data.message || err.response.statusText}`);
        }
      } else if (err.request) {
        setError("Network error: Could not connect to the server.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }, [userToken, cost, packageName, packageId, type, listingId, listingName, checkInDate, checkOutDate, numDays, navigate]); // Added new dependencies

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.token) {
          setUserToken(parsedUser.token);
        } else {
          setError("No authentication token found. Please log in.");
          navigate("/login");
        }
      } else {
        setError("You are not logged in. Please log in to make a payment.");
        navigate("/login");
      }
    } catch (e) {
      console.error("Failed to parse user from localStorage:", e);
      setError("Failed to load user data. Please log in again.");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Conditional rendering
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="ms-3 text-muted">Preparing payment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button onClick={() => navigate(-1)} className="btn btn-primary mt-3">
          Go Back
        </button>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-success" role="alert">
          Payment and Order Confirmed!
        </div>
        <h3 className="mb-3">Thank you for your booking!</h3>
        <p>Your order for **{packageName || listingName}** has been successfully placed.</p>
        {type === 'listing' && checkInDate && checkOutDate && (
            <p className="mb-1">From **{new Date(checkInDate).toLocaleDateString()}** to **{new Date(checkOutDate).toLocaleDateString()}**</p>
        )}
        <button onClick={() => navigate("/orders")} className="btn btn-info me-2">
          View Your Orders
        </button>
        <button onClick={() => navigate("/")} className="btn btn-primary">
          Continue Browse
        </button>
      </div>
    );
  }

  // Main render for payment form
  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow p-4 border-0" style={{ maxWidth: "500px", width: "100%" }}>
        <h2 className="text-center mb-4 text-primary">Confirm Your Booking</h2>
        <div className="mb-3">
          <p className="fw-bold">Item:</p>
          <p>{packageName || listingName || "N/A"}</p>
        </div>

        {/* ⭐ NEW: Display Check-in/Check-out for Listings ⭐ */}
        {type === 'listing' && checkInDate && checkOutDate && (
            <div className="mb-3">
                <p className="fw-bold">Check-in Date:</p>
                <p>{new Date(checkInDate).toLocaleDateString()}</p>
                <p className="fw-bold">Check-out Date:</p>
                <p>{new Date(checkOutDate).toLocaleDateString()}</p>
                <p className="fw-bold">Nights:</p>
                <p>{numDays}</p>
            </div>
        )}

        <div className="mb-3">
          <p className="fw-bold">Total Amount:</p>
          <h4 className="text-success">₹{cost?.toLocaleString('en-IN') || 'N/A'}</h4>
        </div>

        {/* Payment Form (Simplified for demonstration) */}
        <div className="mb-3">
          <label htmlFor="cardName" className="form-label">Name on Card</label>
          <input type="text" className="form-control" id="cardName" placeholder="John Doe" required />
        </div>
        <div className="mb-3">
          <label htmlFor="cardNumber" className="form-label">Card Number</label>
          <input type="text" className="form-control" id="cardNumber" placeholder="XXXX XXXX XXXX XXXX" required />
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="expiryDate" className="form-label">Expiry Date</label>
            <input type="text" className="form-control" id="expiryDate" placeholder="MM/YY" required />
          </div>
          <div className="col-md-6">
            <label htmlFor="cvv" className="form-label">CVV</label>
            <input type="text" className="form-control" id="cvv" placeholder="XXX" required />
          </div>
        </div>

        <button
          onClick={handleSimulatePayment}
          className="btn btn-primary w-100 mt-3 py-2 fw-bold"
          disabled={loading || !userToken || !cost || cost <= 0} // Disable if loading, no token, or invalid cost
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;