import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import dayjs from "dayjs";
import qrImage from "./qrImage.jpg"; // ✅ Correct way to import the image

const BookingPage = () => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [total, setTotal] = useState(0);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expDate: "",
    cvv: "",
  });

  const pricePerDay = 1000;

  const calculateDays = () => {
    if (!checkIn || !checkOut) return 0;
    const diff = dayjs(checkOut).diff(dayjs(checkIn), "day");
    return diff > 0 ? diff : 0;
  };

  const handlePayNow = () => {
    const days = calculateDays();
    if (days <= 0) return alert("Check-out must be after check-in.");
    const totalAmount = days * pricePerDay;
    setTotal(totalAmount);
    setShowPaymentOptions(true);
  };

  const handleCardDetailsChange = (e) => {
    setCardDetails({
      ...cardDetails,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="container py-5">
      <div className="card shadow p-4" style={{ maxWidth: "600px", margin: "0 auto" }}>
        {!showPaymentOptions ? (
          <>
            <h3 className="text-center mb-4">Booking</h3>

            <div className="mb-3">
              <label className="form-label">Check-In Date</label>
              <input
                type="date"
                className="form-control"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Check-Out Date</label>
              <input
                type="date"
                className="form-control"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>

            <p className="mt-3"><strong>Price Per Night:</strong> ₹{pricePerDay}</p>
            <p><strong>No. of Days:</strong> {calculateDays()}</p>
            <p><strong>Total Price:</strong> ₹{calculateDays() * pricePerDay}</p>

            <button className="btn btn-success w-100 mt-3" onClick={handlePayNow}>
              Pay Now
            </button>
          </>
        ) : (
          <div>
            <h4 className="text-center mb-4">Choose Payment Method</h4>
            <div className="d-flex justify-content-center">
              <button
                className="btn btn-primary me-3"
                onClick={() => setPaymentMethod("Credit Card")}
              >
                Credit Card
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setPaymentMethod("UPI")}
              >
                UPI
              </button>
            </div>

            <p className="mt-3 text-center">
              <strong>Total Amount:</strong> ₹{total}
            </p>

            {paymentMethod === "Credit Card" && (
              <div className="mt-4">
                <h5>Enter Credit Card Details</h5>
                <div className="mb-3">
                  <label className="form-label">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    className="form-control"
                    value={cardDetails.cardNumber}
                    onChange={handleCardDetailsChange}
                    placeholder="1234 5678 1234 5678"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Expiration Date</label>
                  <input
                    type="text"
                    name="expDate"
                    className="form-control"
                    value={cardDetails.expDate}
                    onChange={handleCardDetailsChange}
                    placeholder="MM/YY"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    className="form-control"
                    value={cardDetails.cvv}
                    onChange={handleCardDetailsChange}
                    placeholder="123"
                  />
                </div>
                <button
                  className="btn btn-success w-100"
                  onClick={() => alert("Payment Successful via Credit Card")}
                >
                  Pay Now
                </button>
              </div>
            )}

            {paymentMethod === "UPI" && (
              <div className="mt-4 text-center">
                <h5>Scan the QR Code to Pay via UPI</h5>
                <img
                  src={qrImage} // ✅ Using imported image
                  alt="UPI QR Code"
                  style={{ width: "250px", height: "250px" }}
                />
                <button
                  className="btn btn-success w-100 mt-3"
                  onClick={() => alert("Payment Successful via UPI")}
                >
                  Pay Now
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
