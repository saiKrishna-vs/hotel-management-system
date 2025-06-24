import axios from "axios";
import { useState } from "react";

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "customer",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/signup", formData);
      alert("Signup successful!");
    } catch (error) {
      console.error("Signup failed:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ maxWidth: "400px", width: "100%" }}>
        <h3 className="text-center mb-4">Sign Up</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              name="username"
              className="form-control"
              onChange={handleChange}
              placeholder="Enter username"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              name="email"
              type="email"
              className="form-control"
              onChange={handleChange}
              placeholder="Enter email"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              name="password"
              type="password"
              className="form-control"
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Role</label>
            <select name="role" className="form-select" onChange={handleChange}>
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
