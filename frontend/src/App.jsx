// import React, { useState, useEffect } from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Hero from "./components/Hero";
// import AddListing from "./components/AddListing";
// import TotalListings from "./components/TotalListings";
// import FeaturedListings from "./components/FeaturedListings";
// import FeaturedPackages from "./components/FeaturedPackages"; // New Component
// import Login from "./components/Login";
// import Signup from "./components/Signup";
// import ListingDetails from "./components/ListingDetails";
// import BookingPage from "./components/BookingPage";  // Updated import
// import Footer from "./components/Footer";
// import PackagesPage from "./components/PackagesPage";
// import AddPackage from "./components/AddPackage";
// import PackageDetails from "./components/PackageDetails";
// import PaymentPage from "./components/PaymentPage";  // Updated import
// import NewPayment from "./components/NewPayment";  // New Payment Component import

// const App = () => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     checkUser();
//   }, []);

//   const checkUser = () => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       try {
//         const parsedUser = JSON.parse(storedUser);
//         if (parsedUser.token) {
//           setUser(parsedUser);
//         } else {
//           localStorage.removeItem("user");
//         }
//       } catch (error) {
//         localStorage.removeItem("user");
//       }
//     }
//   };

//   return (
//     <div>
//       <Navbar user={user} setUser={setUser} />
//       <Routes>
//         <Route 
//           path="/" 
//           element={
//             <>
//               <Hero />
//               <FeaturedListings />
//               <div className="container mt-5">
//                 <h2 className="text-center fw-bold mb-4">Popular Packages</h2>
//               </div>
//               <FeaturedPackages />
//             </>
//           } 
//         />
//         <Route path="/all-listings" element={<TotalListings />} />
//         <Route path="/add-listing" element={user ? <AddListing /> : <Navigate to="/login" />} />
//         <Route path="/login" element={<Login setUser={setUser} />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/listing/:id" element={<ListingDetails />} />
//         <Route path="/booking" element={<BookingPage />} />  {/* Booking Page route */}
//         <Route path="/packages" element={<PackagesPage />} />
//         <Route path="/add-package" element={<AddPackage /> } />
//         <Route path="/package/:id" element={<PackageDetails />} />
//         <Route path="/payment" element={<PaymentPage />} />  {/* Payment Page route */}
//         <Route path="/new-payment" element={<NewPayment />} />  {/* New Payment Page route */}
//       </Routes>
//       <Footer />
//     </div>
//   );
// };

// export default App;

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import AddListing from "./components/AddListing";
import TotalListings from "./components/TotalListings";
import FeaturedListings from "./components/FeaturedListings";
import FeaturedPackages from "./components/FeaturedPackages";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ListingDetails from "./components/ListingDetails";
import BookingPage from "./components/BookingPage";
import Footer from "./components/Footer";
import PackagesPage from "./components/PackagesPage";
import AddPackage from "./components/AddPackage";
import PackageDetails from "./components/PackageDetails";
import PaymentPage from "./components/PaymentPage";
import NewPayment from "./components/NewPayment";
import OrdersPage from "./components/OrdersPage"; // ⭐⭐⭐ Import OrdersPage ⭐⭐⭐

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // This useEffect runs once on component mount to check local storage for user data
    checkUser();
  }, []); // Empty dependency array means it runs once

  const checkUser = () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        // Basic check if the parsed object has a token (or other user-identifying property)
        if (parsedUser && parsedUser.token && parsedUser.userId && parsedUser.role) {
          setUser(parsedUser);
        } else {
          // If stored data is invalid, clear it
          localStorage.removeItem("user");
          localStorage.removeItem("token"); // Also clear token if stored separately
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      // Catch JSON parsing errors for corrupted localStorage data
      console.error("Error parsing user from localStorage:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  return (
    <div>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <FeaturedListings />
              <div className="container mt-5">
                <h2 className="text-center fw-bold mb-4">Popular Packages</h2>
              </div>
              <FeaturedPackages />
            </>
          }
        />
        <Route path="/all-listings" element={<TotalListings />} />
        {/* Protect AddListing route: only accessible if user is logged in and is admin */}
        <Route
          path="/add-listing"
          element={user?.role === "admin" ? <AddListing /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/listing/:id" element={<ListingDetails />} />
        <Route path="/booking" element={<BookingPage />} /> {/* Booking Page route */}
        <Route path="/packages" element={<PackagesPage />} />
        {/* Protect AddPackage route: only accessible if user is logged in and is admin */}
        <Route
          path="/add-package"
          element={user?.role === "admin" ? <AddPackage /> : <Navigate to="/login" />}
        />
        <Route path="/package/:id" element={<PackageDetails />} />
        <Route path="/payment" element={<PaymentPage />} /> {/* Payment Page route */}
        <Route path="/new-payment" element={<NewPayment />} /> {/* New Payment Page route */}

        {/* ⭐⭐⭐ Add the OrdersPage route, protected for logged-in users ⭐⭐⭐ */}
        <Route
          path="/orders"
          element={user ? <OrdersPage /> : <Navigate to="/login" />}
        />

        {/* Optional: A catch-all route for 404 Not Found pages */}
        <Route path="*" element={
          <div className="container text-center mt-5">
            <h1 className="display-4">404 - Page Not Found</h1>
            <p className="lead">The page you are looking for does not exist.</p>
            <button className="btn btn-primary mt-3" onClick={() => window.location.href = '/'}>Go to Home</button>
          </div>
        } />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;