import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });

      const { token, userType, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userType", userType);
      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, role: userType })
      );

      window.dispatchEvent(new Event("authChange"));
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side image with logo */}
      <div className="md:w-1/2 h-72 md:h-screen relative">
        <img
  src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
  alt="Login Visual"
  className="w-full h-full object-cover"
/>

        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-white text-2xl md:text-3xl font-semibold">
              Welcome back to
            </h2>
            <img
              src={logo}
              alt="EventPortal Logo"
              className="h-28 md:h-36 object-contain rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Right side login form */}
      <div className="md:w-1/2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-center px-8 py-20 md:py-32">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-8 text-center text-indigo-700 dark:text-white">
            Login to Your Account
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-800"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
