import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const NewPayment = () => {
  const { state } = useLocation(); // Get the state passed from BookingPage
  const totalPrice = state?.totalPrice; // Extract the totalPrice from the state
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState(""); // Store selected payment method
  const [error, setError] = useState(""); // Error message if no payment method is selected

  // Handle payment process
  const handlePayment = () => {
    if (!paymentMethod) {
      setError("Please select a payment method.");
      return;
    }

    // Simulate a successful payment
    alert(`Payment of ₹${totalPrice} via ${paymentMethod} was successful!`);
    navigate("/");  // Redirect to the home page or another page after successful payment
  };

  // Ensure totalPrice is valid and not NaN
  useEffect(() => {
    if (isNaN(totalPrice) || totalPrice <= 0) {
      setError("Invalid price. Please try again.");
    }
  }, [totalPrice]);

  return (
    <div className="container py-5">
      <div className="card shadow p-4" style={{ maxWidth: "600px", margin: "0 auto" }}>
        <h3 className="text-center mb-4">Payment for Your Booking</h3>

        {/* Display the total price */}
        <p className="text-center">
          <strong>Total Amount: ₹{totalPrice}</strong>
        </p>

        {/* Payment Method Selection */}
        <div className="mb-4">
          <label className="form-label">Select Payment Method</label>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              id="creditCard"
              name="paymentMethod"
              value="Credit Card"
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <label className="form-check-label" htmlFor="creditCard">
              Credit Card
            </label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              id="upi"
              name="paymentMethod"
              value="UPI"
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <label className="form-check-label" htmlFor="upi">
              UPI
            </label>
          </div>
        </div>

        {/* Display error message if no payment method is selected */}
        {error && <p className="text-danger">{error}</p>}

        {/* Proceed to Pay button */}
        <button className="btn btn-success w-100 mt-3" onClick={handlePayment}>
          Proceed to Pay ₹{totalPrice}
        </button>
      </div>
    </div>
  );
};

export default NewPayment;
