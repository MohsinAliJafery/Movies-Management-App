import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate from React Router
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = ({ setAuthToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [rememberMe, setRememberMe] = useState(false); // State for Remember Me

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://movie-backend-qcl3.onrender.com/api/auth/login",
        {
          email,
          password,
          rememberMe, // Include rememberMe in the request
        },
        { withCredentials: true }
      );
  
      if (response.status === 200) {
        const { userId, userName, userAvatar } = response.data;
        setAuthToken({ userId, email, name: userName });
  
        // Store user data in localStorage for persistent access
        localStorage.setItem("userName", userName);
        localStorage.setItem("userId", userId);
        localStorage.setItem("userAvatar", userAvatar);
  
        // Show success toast
        toast.success("You have been logged in successfully!");

        // Navigate to home page
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data || "Login failed"); // Show error toast
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center mb-6 text-[#E50914]">Login</h2>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E50914] text-gray-700"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E50914] text-gray-700"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              className="mr-2"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <label htmlFor="rememberMe" className="text-sm text-gray-700">Remember Me</label>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 bg-[#E50914] text-white rounded-lg hover:bg-red-700 transition-all duration-300"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-700">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-[#E50914] font-semibold hover:underline"
            >
              Register here
            </a>
          </p>
        </div>
      </div>

      {/* Toast Container for notifications */}
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default Login;
