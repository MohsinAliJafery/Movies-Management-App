import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [step, setStep] = useState(1); // Track current step
  const navigate = useNavigate(); // Initialize the navigate function
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    phone: "",
    profilePicture: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleNextStep = (e) => {
    e.preventDefault(); // Prevent form submission
    if (step === 1 && (!formData.name || !formData.email || !formData.password)) {
      alert("All fields in Step 1 are required.");
      return;
    }
    if (step === 2 && (!formData.address || !formData.phone)) {
      alert("All fields in Step 2 are required.");
      return;
    }
    setStep(step + 1); // Move to the next step
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const formDataObj = new FormData();
      for (const key in formData) {
        formDataObj.append(key, formData[key]);
      }
      await axios.post("https://movie-backend-qcl3.onrender.com/api/auth/register", formDataObj, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("User registered successfully. Please login.");
      navigate('/login');
    } catch (err) {
      alert(err.response?.data || "Registration failed");
    }
  };

  const progress = (step / 3) * 100; // Calculate progress percentage

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center text-[#E50914]">
          Register
        </h1>
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full"
              style={{ width: `${progress}%`, backgroundColor: "#E50914" }}
            ></div>
          </div>
        </div>
        <p className="mb-4 text-center text-gray-600">
          Step {step} of 3
        </p>
        <form onSubmit={handleRegister}>
          {step === 1 && (
            <>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E50914]"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E50914]"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-6">
                <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E50914]"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Enter your address"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E50914]"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-6">
                <label className="block mb-1 text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Enter your phone number"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E50914]"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </>
          )}
          {step === 3 && (
            <div className="mb-6">
              <label className="block mb-1 text-sm font-medium text-gray-700">Profile Picture</label>
              <input
                type="file"
                name="profilePicture"
                className="w-full px-3 py-2"
                onChange={handleChange}
              />
            </div>
          )}
          <div className="flex justify-between">
            {step > 1 && (
              <button
                type="button"
                className="px-4 py-2 text-white bg-gray-500 rounded-lg hover:bg-gray-600"
                onClick={handlePreviousStep}
              >
                Previous
              </button>
            )}
            {step < 3 ? (
              <button
                type="button" // Use "button" to avoid submission
                className="px-4 py-2 text-white bg-[#E50914] rounded-lg hover:bg-red-700"
                onClick={handleNextStep}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600"
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
