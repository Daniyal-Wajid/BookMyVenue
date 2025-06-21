import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("customer");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phoneNumber", phone); // match backend field name
    formData.append("password", password);
    formData.append("userType", userType);
    if (image) {
      formData.append("image", image);
    }

    try {
      await api.post("/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Registered successfully!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left image section */}
      <div className="md:w-1/2 h-72 md:h-auto relative">
        <img
          src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1600&q=80"
          alt="Register Visual"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-white text-2xl md:text-3xl font-semibold">Welcome to</h2>
            <img
              src={logo}
              alt="BookMyVenue Logo"
              className="h-28 md:h-36 object-contain rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Right form section */}
      <div className="md:w-1/2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-center px-8 py-20 md:py-32">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-8 text-center">Create Your Account</h2>

          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-800"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-800"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Phone Number"
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-800"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-800"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-800"
            >
              <option value="customer">Customer</option>
              <option value="business">Business</option>
              
            </select>

            <input
              type="file"
              accept="image/*"
              className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded"
              onChange={(e) => setImage(e.target.files[0])}
            />

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded transition"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
