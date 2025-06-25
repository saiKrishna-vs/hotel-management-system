 # TripZen – Travel Booking Platform

TripZen is a full-stack web application for booking travel destinations and packages. It features user authentication, admin management, listings, packages, and order management, built with a React + Vite frontend and an Express + MongoDB backend.

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)
---

## Features

- User authentication (signup/login) with JWT
- Admin and customer roles
- Add, view, and delete travel listings (admin only)
- Add, view, and delete travel packages (admin only)
- Browse featured listings and packages
- Book listings/packages and view your orders
- Responsive, modern UI with React, Bootstrap, and TailwindCSS

---

## Project Structure

```
dummy/
  backend/         # Express.js backend (API, MongoDB models)
    Schemas/       # Mongoose schemas for listings and users
    uploads/       # (For file uploads, if used)
    server.js      # Main server file
    package.json   # Backend dependencies
  frontend/        # React + Vite frontend
    src/
      components/  # React components (Listings, Packages, Auth, Orders, etc.)
      pages/       # Page-level components
      context/     # React context (Auth)
      App.jsx      # Main app component
      Routes.jsx   # Route definitions
    public/        # Static assets
    package.json   # Frontend dependencies
```

---

## Backend Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Create a `.env` file** in the `backend` directory with:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

3. **Start the backend server:**
   ```bash
   npm start
   ```
   The backend will run on [http://localhost:5000](http://localhost:5000).

---

## Frontend Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the frontend dev server:**
   ```bash
   npm run dev
   ```
   The frontend will run on [http://localhost:5173](http://localhost:5173) (default Vite port).

---

## Environment Variables

- **Backend:**  
  - `MONGO_URI`: MongoDB connection string
  - `JWT_SECRET`: Secret for JWT signing
  - `PORT`: (optional) Port for backend server (default: 5000)

- **Frontend:**  
  - No special environment variables required for local development.  
  - API endpoints are hardcoded to `http://localhost:5000`.

---

## API Endpoints

### Auth
- `POST /signup` – Register a new user (role: customer or admin)
- `POST /login` – Login and receive JWT

### Listings
- `POST /addListing` – Add a new listing (admin only)
- `GET /getListings` – Get all listings
- `GET /getListing/:id` – Get a single listing by ID
- `DELETE /deleteListing/:id` – Delete a listing (admin only)

### Packages
- `POST /addPackage` – Add a new package (admin only)
- `GET /getPackages` – Get all packages
- `GET /getPackage/:id` – Get a single package by ID
- `DELETE /deletePackage/:id` – Delete a package (admin only)

### Orders
- `GET /orders` – Get orders for the logged-in user
- `POST /orders` – Create a new order (after booking/payment)

---

## Usage

- **Sign up** as a customer or admin.
- **Admins** can add new listings and packages.
- **Browse** featured destinations and packages on the home page.
- **Book** a listing or package and view your orders in the "Orders" section.
- **Login/Logout** and role-based navigation in the navbar.

---



**Note:**  
- Make sure MongoDB is running and accessible.
- The frontend expects the backend to be running on `localhost:5000`. Adjust API URLs if deploying to production.
- For production, secure your JWT secret and environment variables. 
