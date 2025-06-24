import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TotalListings from "./pages/TotalListings";
import AddListing from "./pages/AddListing";

const AppRoutes = ({ listings, handleAddListing }) => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/all-listings" element={<TotalListings listings={listings} />} />
      <Route path="/add-listing" element={<AddListing onAdd={handleAddListing} />} />
    </Routes>
  );
};

export default AppRoutes;
