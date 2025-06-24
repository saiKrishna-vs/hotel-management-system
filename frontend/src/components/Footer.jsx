import { Link } from "react-router-dom";
import React from "react";

const Footer = () => {
  const footerStyle = {
    backgroundColor: "#E0F7FA", // Light blue background
    padding: "2rem 1rem",
    marginTop: "2rem",
  };

  const containerStyle = {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    maxWidth: "1200px",
    margin: "auto",
  };

  const sectionStyle = {
    flex: "1",
    minWidth: "250px",
    marginBottom: "1rem",
  };

  const linkStyle = {
    color: "#0077B6",
    textDecoration: "none",
    fontWeight: "500",
  };

  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <div style={sectionStyle}>
          <h2 style={{ color: "#0077B6", fontSize: "1.5rem", fontWeight: "bold" }}>Trip<span style={{ color: "#000" }}>Zen</span></h2>
          <p>Your trusted travel partner for memorable journeys and exceptional hotel experiences.</p>
          <div className="flex space-x-4 mt-4">
            <a href="#" style={linkStyle}><i className="fab fa-facebook"></i></a>
            <a href="#" style={linkStyle}><i className="fab fa-twitter"></i></a>
            <a href="#" style={linkStyle}><i className="fab fa-instagram"></i></a>
            <a href="#" style={linkStyle}><i className="fab fa-linkedin"></i></a>
          </div>
        </div>

        <div style={sectionStyle}>
          <h3 style={{ fontWeight: "bold" }}>Quick Links</h3>
          <ul>
            <li><Link to="/about" style={linkStyle}>About Us</Link></li>
            <li><Link to="/services" style={linkStyle}>Services</Link></li>
            <li><Link to="/destinations" style={linkStyle}>Destinations</Link></li>
            <li><Link to="/hotels" style={linkStyle}>Hotels</Link></li>
            <li><Link to="/packages" style={linkStyle}>Packages</Link></li>
            <li><Link to="/contact" style={linkStyle}>Contact Us</Link></li>
          </ul>
        </div>

        <div style={sectionStyle}>
          <h3 style={{ fontWeight: "bold" }}>Contact Us</h3>
          <p><i className="fas fa-map-marker-alt" style={{ color: "#0077B6" }}></i> 1234 Travel Lane, Suite 500, San Francisco, CA 94103</p>
          <p><i className="fas fa-phone" style={{ color: "#0077B6" }}></i> +1 (123) 456-7890</p>
          <p><i className="fas fa-envelope" style={{ color: "#0077B6" }}></i> info@voyagehive.com</p>
        </div>

        <div style={sectionStyle}>
          <h3 style={{ fontWeight: "bold" }}>Newsletter</h3>
          <p>Subscribe to our newsletter for the latest updates and offers.</p>
          <div className="flex mt-4">
            <input type="email" placeholder="Your email address" style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc", width: "60%" }} />
            <button style={{ backgroundColor: "#0077B6", color: "white", padding: "0.5rem 1rem", borderRadius: "4px", marginLeft: "0.5rem", height: "40px", width:"100px" }}>Subscribe</button>
          </div>
          <p style={{ fontSize: "0.8rem", color: "gray" }}>By subscribing, you agree to our Privacy Policy and consent to receive updates.</p>
        </div>
      </div>

      <div style={{ borderTop: "1px solid #ccc", paddingTop: "1rem", marginTop: "1rem", textAlign: "center" }}>
        <p>&copy; 2025 TripZen. All rights reserved.</p>
        <div className="flex justify-center space-x-4">
          <Link to="/privacy-policy" style={linkStyle}>Privacy Policy</Link>
          <Link to="/terms" style={linkStyle}>Terms & Conditions</Link>
          <Link to="/sitemap" style={linkStyle}>Sitemap</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
