import React from "react";
import { useLocation } from "react-router-dom";

const QRPayment = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const price = queryParams.get("price");

  return (
    <div className="container text-center mt-5">
      <h2>Scan QR Code to Pay</h2>
      <p>Amount: <strong>₹{price}</strong></p>
      <img 
        src="./qrImage" 
        alt="QR Code"
      />
    </div>
  );
};

export default QRPayment;

