import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const CreditCardPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const price = queryParams.get("price");

  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const handlePayment = (e) => {
    e.preventDefault();

    if (cardNumber.length !== 16 || cvv.length !== 3) {
      alert("Invalid card details!");
      return;
    }

    navigate("/payment-success");
  };

  return (
    <div className="container text-center mt-5">
      <h2>Credit Card Payment</h2>
      <p>Total Amount: <strong>₹{price}</strong></p>
      <form onSubmit={handlePayment} className="mt-4">
        <input type="text" placeholder="Card Number" maxLength="16" onChange={(e) => setCardNumber(e.target.value)} required />
        <input type="text" placeholder="Expiry Date (MM/YY)" onChange={(e) => setExpiryDate(e.target.value)} required />
        <input type="text" placeholder="CVV" maxLength="3" onChange={(e) => setCvv(e.target.value)} required />

        <button type="submit" className="btn btn-primary mt-3">Pay Now</button>
      </form>
    </div>
  );
};

export default CreditCardPayment;
