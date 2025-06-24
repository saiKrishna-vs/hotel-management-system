

// import React, { useEffect, useCallback } from "react"; // Added useCallback
// import { Link, useNavigate } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// // Optional: import a CSS file for styling if you extracted the inline styles
// // import './Navbar.css';

// const Navbar = ({ user, setUser }) => {
//   const navigate = useNavigate();

//   // Use useCallback to memoize handleLogout if it were passed down, good habit.
//   // For this direct usage, it's not strictly necessary but harmless.
//   const handleLogout = useCallback(() => {
//     localStorage.removeItem("user");
//     localStorage.removeItem("token"); // Good practice to remove token explicitly if stored separately
//     setUser(null); // Clear user state
//     navigate("/login"); // Redirect to login page
//   }, [navigate, setUser]); // Dependencies for useCallback

//   // Effect to load user from localStorage when component mounts
//   useEffect(() => {
//     try {
//       const storedUser = localStorage.getItem("user");
//       // console.log("Navbar useEffect - Stored user string:", storedUser); // For debugging
//       if (storedUser) {
//         const parsedUser = JSON.parse(storedUser);
//         // console.log("Navbar useEffect - Parsed user object:", parsedUser); // For debugging
//         setUser(parsedUser); // Set the user state in the parent component (App.js)
//       } else {
//         setUser(null); // Ensure user is null if nothing is in localStorage
//       }
//     } catch (e) {
//       console.error("Failed to parse user from localStorage:", e);
//       localStorage.removeItem("user"); // Clear corrupted data
//       localStorage.removeItem("token");
//       setUser(null);
//     }
//   }, [setUser]); // setUser is a dependency because it's from props.

//   return (
//     <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm sticky-top">
//       <div className="container-fluid px-5">
//         {/* Left - Brand and Links */}
//         <div className="d-flex align-items-center">
//           <Link className="navbar-brand fw-bold text-dark me-4" to="/">
//             Trip<span className="text-primary">Zen</span>
//           </Link>
//           <ul className="navbar-nav">
//             <li className="nav-item me-3">
//               <Link className="nav-link" to="/">Home</Link>
//             </li>
//             {/* Conditional rendering for admin links */}
//             {user?.role === "admin" && (
//               <>
//                 <li className="nav-item me-3">
//                   <Link className="nav-link" to="/add-listing">Add Listing</Link>
//                 </li>
//                 <li className="nav-item me-3">
//                   <Link className="nav-link" to="/add-package">Add Package</Link>
//                 </li>
//               </>
//             )}
//             <li className="nav-item me-3">
//               <Link className="nav-link" to="/all-listings">Destinations</Link>
//             </li>
//             <li className="nav-item">
//               <Link className="nav-link" to="/packages">Packages</Link>
//             </li>
//           </ul>
//         </div>

//         {/* Right - Login/Logout */}
//         <div className="d-flex align-items-center">
//           {user ? (
//             <>
//               <span className="me-3 fw-bold text-primary">
//                 Hello, {user.username || (user.role === "admin" ? "Admin" : "User")}! {/* More robust greeting */}
//               </span>
//               <button className="btn btn-danger px-4 py-2" onClick={handleLogout}>Logout</button>
//             </>
//           ) : (
//             <>
//               <Link to="/login" className="btn btn-outline-primary me-3 px-4 py-2">Sign In</Link>
//               <Link to="/signup" className="btn btn-primary px-4 py-2">Sign Up</Link>
//             </>
//           )}
//         </div>
//       </div>
//       {/* Inline styles can be moved to Navbar.css for better practice */}
//       <style>
//         {`
//           .btn-primary {
//             background-color: #007bff;
//             border-color: #007bff;
//             border-radius: 30px;
//           }
//           .btn-primary:hover {
//             background-color: #0056b3;
//             border-color: #0056b3;
//           }
//           .btn-outline-primary {
//             border-radius: 30px;
//             border-color: #007bff;
//             color: #007bff;
//           }
//           .btn-outline-primary:hover {
//             background-color: #007bff;
//             color: white;
//           }
//           .navbar {
//             width: 100%;
//             z-index: 1000;
//             background-color: #f8f9fa;
//             box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//           }
//           .text-primary {
//             color: #007bff !important; /* Added !important for stronger specificity */
//           }
//         `}
//       </style>
//     </nav>
//   );
// };

// export default Navbar;

// src/components/Navbar.jsx
import React, { useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  }, [navigate, setUser]);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } else {
        setUser(null);
      }
    } catch (e) {
      console.error("Failed to parse user from localStorage:", e);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
    }
  }, [setUser]);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm sticky-top">
      <div className="container-fluid px-5">
        <div className="d-flex align-items-center">
          <Link className="navbar-brand fw-bold text-dark me-4" to="/">
            Trip<span className="text-primary">Zen</span>
          </Link>
          <ul className="navbar-nav">
            <li className="nav-item me-3">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            {user?.role === "admin" && (
              <>
                <li className="nav-item me-3">
                  <Link className="nav-link" to="/add-listing">Add Listing</Link>
                </li>
                <li className="nav-item me-3">
                  <Link className="nav-link" to="/add-package">Add Package</Link>
                </li>
              </>
            )}
            <li className="nav-item me-3">
              <Link className="nav-link" to="/all-listings">Destinations</Link>
            </li>
            <li className="nav-item me-3">
              <Link className="nav-link" to="/packages">Packages</Link>
            </li>
            {/* ⭐ NEW: Orders link for logged-in users ⭐ */}
            {user && ( // Show "Orders" link if any user is logged in
              <li className="nav-item">
                <Link className="nav-link" to="/orders">Orders</Link> {/* Added the closing tags here */}
              </li>
            )}
          </ul>
        </div>

        {/* Right - Login/Logout */}
        <div className="d-flex align-items-center">
          {user ? (
            <>
              <span className="me-3 fw-bold text-primary">
                Hello, {user.username || (user.role === "admin" ? "Admin" : "User")}!
              </span>
              <button className="btn btn-danger px-4 py-2" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline-primary me-3 px-4 py-2">Sign In</Link>
              <Link to="/signup" className="btn btn-primary px-4 py-2">Sign Up</Link>
            </>
          )}
        </div>
      </div>
      {/* Inline styles can be moved to Navbar.css for better practice */}
      <style>
        {`
          .btn-primary {
            background-color: #007bff;
            border-color: #007bff;
            border-radius: 30px;
          }
          .btn-primary:hover {
            background-color: #0056b3;
            border-color: #0056b3;
          }
          .btn-outline-primary {
            border-radius: 30px;
            border-color: #007bff;
            color: #007bff;
          }
          .btn-outline-primary:hover {
            background-color: #007bff;
            color: white;
          }
          .navbar {
            width: 100%;
            z-index: 1000;
            background-color: #f8f9fa;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .text-primary {
            color: #007bff !important; /* Added !important for stronger specificity */
          }
        `}
      </style>
    </nav>
  );
};

export default Navbar;