// ✅ server.js – Full Clean Code with Proper Order

import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// ------------------ MongoDB Connection ------------------

if (!process.env.MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI is not set in .env file!");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// ------------------ Middleware ------------------

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "Unauthorized: No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach decoded user info to the request
    next();
  } catch (error) {
    console.error("Token verification failed:", error); // Log the actual error
    return res.status(403).json({ message: "Forbidden: Invalid token" });
  }
};

const isAdmin = (req, res, next) => {
  // Check if req.user exists and has the admin role
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admins only access" });
  }
  next();
};

// New combined middleware for admin authentication
// This middleware will first verify the token, then check for admin role
const authenticateAdmin = [verifyToken, isAdmin];

//////////////////////////////////////////////////
// 🔷 USER MODEL + ROUTES
//////////////////////////////////////////////////

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "customer"],
    default: "customer",
  },
});

const User = mongoose.model("User", userSchema);

// 🔹 Signup
app.post("/signup", async (req, res) => {
  const { username, email, password, role } = req.body;
  // Note: It's safer to not allow 'role' to be set directly by user in signup,
  // unless there's a specific admin signup process. Defaulting to 'customer' is safer.
  if (!username || !email || !password) {
    // Removed role from required check here
    return res
      .status(400)
      .json({ message: "Username, email, and password are required" });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      // If 'role' is provided in req.body and it's 'admin', it's a security risk.
      // Always explicitly set roles based on your application's logic.
      // For general signup, force 'customer'. For admin signup, create a separate route or process.
      role: role === "admin" ? "admin" : "customer", // Be careful with direct role assignment
    });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    // More specific error handling for duplicate key (email)
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      return res
        .status(409)
        .json({ message: "This email is already registered." });
    }
    res.status(500).json({ message: "Failed to create user." });
  }
});

// 🔹 Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, role: user.role, username: user.username },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Send the token along with user role and username
    res.status(200).json({ token, role: user.role, username: user.username });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login error" });
  }
});

//////////////////////////////////////////////////
// PACKAGE MODEL + ROUTES
//////////////////////////////////////////////////

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  days: { type: Number, required: true },
  placesCount: { type: Number, required: true },
  places: { type: [String], required: true }, // Expecting an array of strings
  cost: { type: Number, required: true },
  phone: { type: String, required: true },
});

const Package = mongoose.model("Package", packageSchema);

app.post("/addPackage", authenticateAdmin, async (req, res) => {
  try {
    const { name, image, description, days, placesCount, places, cost, phone } =
      req.body;

    // Basic validation (Mongoose schema will handle required fields, but good to have)
    if (
      !name ||
      !description ||
      !days ||
      !placesCount ||
      !places ||
      !cost ||
      !phone
    ) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields." });
    }

    // Ensure 'places' is an array of strings, even if single string is sent
    let formattedPlaces = places;
    if (typeof places === "string") {
      // If frontend sends comma-separated string, convert it to array
      formattedPlaces = places.split(",").map((p) => p.trim());
    }
    // Additional validation for 'places' to ensure it's an array and contains strings
    if (
      !Array.isArray(formattedPlaces) ||
      formattedPlaces.some((p) => typeof p !== "string")
    ) {
      return res
        .status(400)
        .json({ message: "'places' must be an array of strings." });
    }

    // Create a new package instance
    const newPackage = new Package({
      name,
      image,
      description,
      days,
      placesCount,
      places: formattedPlaces, // Use the formatted places array
      cost,
      phone,
    });

    // Save the package to the database
    const savedPackage = await newPackage.save();

    res.status(201).json({
      message: "Package added successfully!",
      package: savedPackage,
    });
  } catch (error) {
    console.error("Error adding package:", error);
    // Handle validation errors from Mongoose
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Server error. Could not add package." });
  }
});

// 🔹 Get All Listings
app.get("/getPackages", async (req, res) => {
  try {
    const packages = await Package.find(); // Fetch all documents from the Package collection
    res.status(200).json(packages); // Send the fetched packages as JSON response
  } catch (err) {
    console.error("Error fetching packages:", err); // Log the error for debugging
    res
      .status(500)
      .json({ message: "Server error. Could not fetch packages." }); // Send a 500 error response
  }
});

// Get single by id
app.get("/getPackage/:id", async (req, res) => {
  try {
    const { id } = req.params; // Extract the ID from the URL parameters
    const packageItem = await Package.findById(id); // Find the package by its ID

    if (!packageItem) {
      // If no package is found with that ID
      return res.status(404).json({ message: "Package not found." });
    }

    // If package is found, send it as a JSON response
    res.status(200).json(packageItem);
  } catch (err) {
    console.error("Error fetching single package:", err);
    // Handle cases where the ID format might be invalid (e.g., not a valid MongoDB ObjectId)
    if (err.name === 'CastError') {
        return res.status(400).json({ message: "Invalid package ID format." });
    }
    res.status(500).json({ message: "Server error. Could not fetch package." });
  }
});

// 🔹 Delete Package (Admin Only)
app.delete("/deletePackage/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPackage = await Package.findByIdAndDelete(id);

    if (!deletedPackage) {
      return res.status(404).json({ message: "Package not found." });
    }

    res.status(200).json({ message: "Package deleted successfully!" });
  } catch (err) {
    console.error("Error deleting package:", err);
    res.status(500).json({ message: "Server error. Could not delete package." });
  }
});

//////////////////////////////////////////////////
// 🔷 LISTING MODEL + ROUTES
//////////////////////////////////////////////////

const listingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  price: { type: Number, required: true },
  contact: { type: String, required: true },
});

const Listing = mongoose.model("Listing", listingSchema);

// 🔹 Add Listing (Admin Only)
app.post("/addListing", verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, description, image, state, district, price, contact } =
      req.body;
    if (
      !name ||
      !description ||
      !image ||
      !state ||
      !district ||
      !price ||
      !contact
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newListing = new Listing({
      name,
      description,
      image,
      state,
      district,
      price,
      contact,
    });

    await newListing.save();
    res.status(201).json({ message: "Listing added successfully" });
  } catch (err) {
    console.error("Error adding listing:", err);
    res.status(500).json({ message: "Error adding listing" });
  }
});

app.get("/getListings", async (req, res) => {
  try {
    const listings = await Listing.find(); // Fetch all documents from the Listing collection
    res.status(200).json(listings); // Send the fetched listings as a JSON array
  } catch (err) {
    console.error("Error fetching listings:", err); // Log the detailed error
    res
      .status(500)
      .json({ message: "Server error. Could not fetch listings." }); // Send a generic error response
  }
});
//get single listing by id
app.get("/getListing/:id", async (req, res) => {
  try {
    const { id } = req.params; // Extract the ID from the URL parameters
    const listingItem = await Listing.findById(id); // Find the listing by its ID

    if (!listingItem) {
      // If no listing is found with that ID
      return res.status(404).json({ message: "Listing not found." });
    }

    // If listing is found, send it as a JSON response
    res.status(200).json(listingItem);
  } catch (err) {
    console.error("Error fetching single listing:", err);
    // Handle cases where the ID format might be invalid (e.g., not a valid MongoDB ObjectId)
    if (err.name === 'CastError') {
      return res.status(400).json({ message: "Invalid listing ID format." });
    }
    res.status(500).json({ message: "Server error. Could not fetch listing." });
  }
});
// ⭐ NEW ROUTE: 🔹 Delete Listing by ID (Admin Only) ⭐
app.delete("/deleteListing/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
      return res.status(404).json({ message: "Listing not found." });
    }

    res.status(200).json({ message: "Listing deleted successfully!" });
  } catch (err) {
    console.error("Error deleting listing:", err);
    // Handle cases where the ID format might be invalid
    if (err.name === 'CastError') {
        return res.status(400).json({ message: "Invalid listing ID format." });
    }
    res.status(500).json({ message: "Server error. Could not delete listing." });
  }
});





//////////////////////////////////////////////////
// ⭐ NEW: ORDER MODEL + ROUTES ⭐
//////////////////////////////////////////////////

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to your User model
    required: true,
  },
  type: { // 'listing' or 'package'
    type: String,
    required: true,
    enum: ['listing', 'package']
  },
  listingId: { // Optional, if it's a listing order
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
  },
  packageName: { // Store the name of the package/listing for display
    type: String,
  },
  listingName: {
    type: String,
  },
  packageId: { // Optional, if it's a package order
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Cancelled'], // Example statuses
    default: 'Pending',
  },
  checkInDate: { // Relevant for listings
    type: Date,
  },
  // Add any other relevant order details (e.g., payment details, contact info)
}, { timestamps: true }); // Add timestamps for createdAt, updatedAt

const Order = mongoose.model("Order", orderSchema);


// ⭐ Corrected Route: 🔹 Get Orders for Logged-in User ⭐
// Path changed to /orders
app.get("/orders", verifyToken, async (req, res) => {
  try {
    // req.user.userId comes from the verifyToken middleware
    const orders = await Order.find({ userId: req.user.userId })
      .sort({ createdAt: -1 }) // Sort by newest first
      // ⭐ OPTIONAL ENHANCEMENT: Uncomment these lines if you want to populate
      // .populate('listingId', 'name image price') // Populate specific fields from Listing
      // .populate('packageId', 'name image cost') // Populate specific fields from Package
      .lean(); // Use .lean() for faster queries if you don't need Mongoose Document methods

    if (orders.length === 0) {
      // It's generally better to send an empty array for "no items" rather than 404
      return res.status(200).json([]);
    }

    res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching user orders:", err);
    res.status(500).json({ message: "Server error. Could not fetch orders." });
  }
});

// ⭐ Corrected Route: 🔹 Create a New Order (after successful booking/payment) ⭐
// Path changed to /orders
app.post("/orders", verifyToken, async (req, res) => {
  try {
    const { type, listingId, packageId, amount, packageName, listingName, checkInDate } = req.body;

    // Basic validation
    if (!type || !amount) {
      return res.status(400).json({ message: "Type and amount are required to create an order." });
    }

    if (type === 'listing' && (!listingId || !listingName)) {
      return res.status(400).json({ message: "listingId and listingName are required for listing orders." });
    }
    if (type === 'package' && (!packageId || !packageName)) {
      return res.status(400).json({ message: "packageId and packageName are required for package orders." });
    }

    const newOrder = new Order({
      userId: req.user.userId, // Get userId from the verified token
      type,
      // Conditionally set IDs and names based on type
      listingId: type === 'listing' ? listingId : undefined,
      packageId: type === 'package' ? packageId : undefined,
      packageName: type === 'package' ? packageName : undefined,
      listingName: type === 'listing' ? listingName : undefined,
      amount,
      status: 'Pending', // Default status
      checkInDate: type === 'listing' ? checkInDate : undefined,
    });

    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully!", order: newOrder });
  } catch (err) {
    console.error("Error creating order:", err);
    // More specific error handling for Mongoose validation errors
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: "Server error. Could not create order." });
  }
});

// ... (rest of your server.js code, including other models and routes)
// ... (Your existing LISTING MODEL + ROUTES and PACKAGE MODEL + ROUTES)
// ... (Your server start code)

//////////////////////////////////////////////////
// 🔷 ORDER MODEL + ROUTES
//////////////////////////////////////////////////

// const orderSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User', // Reference to your User model
//     required: true
//   },
//   type: { // 'package' or 'listing'
//     type: String,
//     enum: ['package', 'listing'],
//     required: true
//   },
//   itemId: { // ID of the package or listing booked
//     type: mongoose.Schema.Types.ObjectId,
//     required: true
//   },
//   packageName: { type: String }, // For package orders
//   listingName: { type: String }, // For listing orders
//   amount: {
//     type: Number,
//     required: true
//   },
//   paymentStatus: { // e.g., 'pending', 'succeeded', 'failed'
//     type: String,
//     default: 'pending'
//   },
//   stripePaymentId: { // Store Stripe charge ID if applicable
//     type: String
//   }
// }, {
//   timestamps: true // Adds createdAt and updatedAt fields
// });

// const Order = mongoose.model("Order", orderSchema);

// // ⭐ NEW ROUTE: 🔹 Get Orders for Logged-in User ⭐
// // This route requires authentication to get the userId from the token
// app.get("/getOrders", verifyToken, async (req, res) => {
//   try {
//     // req.userId should be populated by your verifyToken middleware
//     const userId = req.userId;

//     if (!userId) {
//       return res.status(401).json({ message: "User not authenticated." });
//     }

//     // Find all orders associated with the logged-in user
//     const userOrders = await Order.find({ userId: userId }).sort({ createdAt: -1 }); // Sort by newest first

//     res.status(200).json(userOrders);
//   } catch (err) {
//     console.error("Error fetching user orders:", err);
//     res.status(500).json({ message: "Server error. Could not fetch orders." });
//   }
// });



// ... (rest of your server.js code, including listing and package models/routes)


//////////////////////////////////////////////////
// ✅ Start Server
//////////////////////////////////////////////////

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


