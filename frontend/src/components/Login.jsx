// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const Login = ({ setUser }) => {
//   const [loginData, setLoginData] = useState({ email: "", password: "" });
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setLoginData({ ...loginData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const { email, password } = loginData;

//     if (!email || !password) {
//       setError("Both fields are required!");
//       return;
//     }

//     try {
//       const response = await axios.post("http://localhost:5000/login", {
//         email,
//         password,
//       });

//       // Fetch full user info using email (you can modify backend to return username too)
//       const user = {
//         email,
//         token: response.data.token,
//         role: response.data.role,
//         username: email.split("@")[0], // You can adjust this based on your backend
//       };

//       localStorage.setItem("user", JSON.stringify(user));
//       setUser(user);
//       navigate(user.role === "admin" ? "/admin-dashboard" : "/packages");
//     } catch (err) {
//       setError(err.response?.data?.message || "Login failed!");
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <div className="row justify-content-center">
//         <div className="col-md-6">
//           <div className="card shadow-lg">
//             <div className="card-body p-4">
//               <h3 className="card-title text-center mb-4">Login</h3>
//               {error && <div className="alert alert-danger">{error}</div>}
//               <form onSubmit={handleSubmit}>
//                 <div className="mb-3">
//                   <label htmlFor="email" className="form-label">Email address</label>
//                   <input
//                     type="email"
//                     className="form-control"
//                     id="email"
//                     name="email"
//                     value={loginData.email}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>

//                 <div className="mb-3">
//                   <label htmlFor="password" className="form-label">Password</label>
//                   <input
//                     type="password"
//                     className="form-control"
//                     id="password"
//                     name="password"
//                     value={loginData.password}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>

//                 <button type="submit" className="btn btn-primary w-100">Login</button>
//               </form>

//               <div className="mt-3 text-center">
//                 <p>
//                   Don't have an account? <a href="/signup">Sign up here</a>
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

// src/components/Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ setUser }) => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = loginData;

    if (!email || !password) {
      setError("Both fields are required!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      // Assuming your backend sends 'username' and 'role' in the response.
      // If not, ensure your backend's login route is updated to include `username`
      // in the response, or adjust how `username` is derived here.
      const user = {
        email,
        token: response.data.token,
        role: response.data.role,
        userId: response.data.userId, // It's good to store userId if your backend provides it
        username: response.data.username || email.split("@")[0], // Prefer backend username, fallback to email part
      };

      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      // ⭐⭐⭐ Change this line ⭐⭐⭐
      navigate("/"); // Redirect to the home page (which displays featured listings/packages)

      // If you still want role-specific redirects:
      // if (user.role === "admin") {
      //   navigate("/admin-dashboard"); // Make sure this route exists and is defined in App.js
      // } else {
      //   navigate("/"); // Regular users go to home page
      // }

    } catch (err) {
      // Improved error handling for better user feedback
      let errorMessage = "Login failed! Please try again.";
      if (err.response) {
        // Server responded with a status code outside of 2xx range
        if (err.response.status === 400) {
            errorMessage = err.response.data.message || "Invalid email or password.";
        } else if (err.response.status === 401) {
            errorMessage = "Unauthorized: Invalid credentials.";
        } else {
            errorMessage = `Server error: ${err.response.status} - ${err.response.data.message || "Something went wrong."}`;
        }
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = "Network error: Could not connect to the server. Please check your internet connection.";
      }
      setError(errorMessage);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg">
            <div className="card-body p-4">
              <h3 className="card-title text-center mb-4">Login</h3>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={loginData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100">Login</button>
              </form>

              <div className="mt-3 text-center">
                <p>
                  Don't have an account? <a href="/signup">Sign up here</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;