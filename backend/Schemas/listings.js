const mongoose = require('mongoose');
// import mongoose from 'mongoose';

// Listing Schema
const listingSchema = new mongoose.Schema({
  name: String,
  description: String,
  state: String,
  country: String,
  price: Number,
  amenities: [String],
  contact: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;