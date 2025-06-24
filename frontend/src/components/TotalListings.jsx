import { useEffect, useState, useCallback } from "react"; // Added useCallback
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap CSS is imported
// import "./TotalListings.css"; // Import the CSS file

const TotalListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Keep as null, or an empty string, consistent with usage
  const navigate = useNavigate();

  // Use useCallback to memoize fetchListings if it's passed down as a prop,
  // otherwise, it's a minor optimization. Good practice for async functions in effects.
  const fetchListings = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/getListings");
      setListings(res.data);
    } catch (err) {
      console.error("Error fetching listings:", err); // Log the actual error for debugging
      setError("Failed to load listings. Please try again later."); // User-friendly message
    } finally {
      setLoading(false); // Ensure loading is always set to false
    }
  }, []); // Empty dependency array means this function is created once

  useEffect(() => {
    fetchListings();
  }, [fetchListings]); // Add fetchListings to the dependency array of useEffect

  return (
    <div className="section-container">
      <h2 className="text-center mb-3 section-title">All Hotels</h2>
      <p className="text-center section-description">
        Explore our curated selection of top-rated hotels with the best
        amenities and deals.
      </p>

      {loading ? (
        <h4 className="text-center text-muted">Loading hotels...</h4> // Changed "listings" to "hotels" for consistency with heading
      ) : error ? (
        <h4 className="text-center text-danger">{error}</h4>
      ) : listings.length > 0 ? (
        <div className="row justify-content-center gx-3">
          {listings.map((listing) => (
            <div
              className="col-md-4 d-flex justify-content-center mb-3"
              key={listing._id}
              onClick={() =>
                // Pass a more descriptive object if needed, or just the ID
                navigate(`/listing/${listing._id}`, { state: { listing } })
              }
              style={{ cursor: "pointer" }}
            >
              <div className="destination-card">
                <div className="image-container">
                  <img
                    src={listing.image || "https://via.placeholder.com/350x220?text=No+Image"} // Updated placeholder dimensions
                    className="card-img-top"
                    alt={listing.name || "Hotel Image"} // More descriptive alt text
                  />
                </div>
                <div className="card-body">
                  <h5 className="location-text">{listing.name}</h5>
                  <div className="price-container">
                    <p className="card-text price-text">
                      ₹{listing.price.toLocaleString('en-IN')} <span className="per-day">/ per day</span> {/* Format price for Indian Rupees */}
                    </p>
                    <div className="details-button">Details &rarr;</div> {/* Unicode arrow */}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <h4 className="text-center text-muted">No hotels available at the moment.</h4> // More specific message
      )}
   


      <style>
        {`
          .section-container {
            background: rgb(234, 234, 234);
            padding: 50px 0;
            margin-top: 30px;
          }
          .section-title {
            font-size: 2rem;
            font-weight: bold;
            color: #333;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .section-description {
            font-size: 1rem;
            color: #555;
            margin-bottom: 20px;
          }
          .destination-card {
            width: 100%;
            max-width: 420px;
            border-radius: 15px;
            height: 335px;
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
            width: 100%;
            height: 220px;
            overflow: hidden;
          }
          .image-container img {
            width: 100%;
            height: 100%;
            object-fit: cover;
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
          }
          .per-day {
            font-size: 0.9rem;
            color: #555;
          }
          .details-button {
            color: #0D6EFD;
            font-size: 1rem;
            font-weight: bold;
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
        `}
      </style>
    </div>
  );
};

export default TotalListings;
