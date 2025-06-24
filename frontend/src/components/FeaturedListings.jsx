import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const FeaturedListings = () => {
  const [listings, setListings] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/getListings");
      setListings(res.data);
    } catch (err) {
      console.error("Error fetching listings:", err);
    }
  };

  return (
    <div className="section-container">
      <h1 className="text-center mb-4 section-title">Popular Destinations</h1>

      <div className="row justify-content-center gx-3">
        {(showAll ? listings : listings.slice(0, 6)).map((listing, index) => (
          <div key={index} className="col-md-4 d-flex justify-content-center mb-3">
            <Link to={`/listing/${listing._id}`} className="text-decoration-none">
              <div className="destination-card">
                <div className="image-container">
                  <img
                    src={listing.image || "https://via.placeholder.com/350"}
                    className="card-img-top"
                    alt={listing.name}
                  />
                  <span className="badge popular-badge">Popular</span>
                </div>
                <div className="card-body">
                  <h5 className="location-text">{listing.name}</h5>
                  <div className="price-container">
                    <p className="card-text price-text">
                      ₹{listing.price} <span className="per-day">/ per day</span>
                    </p>
                    <div className="details-button">Details →</div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="text-center mt-4">
        {!showAll ? (
          <button
            className="btn btn-primary px-4 py-2 btn-show"
            onClick={() => setShowAll(true)}
          >
            Show More
          </button>
        ) : (
          <button
            className="btn btn-danger px-4 py-2 btn-show"
            onClick={() => setShowAll(false)}
          >
            Show Less
          </button>
        )}
      </div>

      <style>
        {`
          .section-container {
            background: rgb(232, 243, 245);
            padding: 50px 0;
          }

          .section-title {
            font-size: 2rem;
            font-weight: bold;
            color: #333;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .destination-card {
            width: 350px;
            border-radius: 15px;
            overflow: hidden;
            background: #ffffff;
            transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
            cursor: pointer;
            padding-bottom: 15px;
          }

          .destination-card:hover {
            transform: translateY(-5px);
            box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.25);
          }

          .image-container {
            position: relative;
            width: 100%;
            height: 220px;
            border-radius: 12px;
            overflow: hidden;
          }

          .image-container img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .popular-badge {
            position: absolute;
            top: 10px;
            left: 10px;
            background: #6c757d;
            color: white;
            font-size: 14px;
            font-weight: bold;
            padding: 5px 10px;
            border-radius: 12px;
          }

          .card-body {
            padding: 15px;
            text-align: left;
          }

          .location-text {
            font-size: 1.2rem;
            font-weight: bold;
            color: #333;
            margin-bottom: 8px;
          }

          .price-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .price-text {
            font-size: 1.1rem;
            font-weight: bold;
            color: #0D6EFD;
            margin-bottom: 5px;
          }

          .per-day {
            font-size: 0.9rem;
            color: #555;
            font-weight: normal;
          }

          .details-button {
            color: #0D6EFD;
            font-size: 1rem;
            font-weight: bold;
            cursor: pointer;
          }

          .details-button:hover {
            text-decoration: underline;
          }

          .row.gx-3 {
            margin-left: -10px;
            margin-right: -10px;
          }

          .col-md-4 {
            padding-left: 10px;
            padding-right: 10px;
          }

          .btn-show {
            border-radius: 30px;
            font-size: 1rem;
          }
        `}
      </style>
    </div>
  );
};

export default FeaturedListings;
