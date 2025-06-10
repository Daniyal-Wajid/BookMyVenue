// src/pages/Login.jsx
import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await api.post("/auth/login", { email, password });
    const { token, userType } = res.data;

    localStorage.setItem("token", token);
    localStorage.setItem("userType", userType);

    // Conditional navigation based on user type
    if (userType === "customer") {
      navigate("/customer-dashboard");
    } else if (userType === "business") {
      navigate("/business-dashboard");
    } else if (userType === "admin") {
      navigate("/admin-dashboard");
    } else {
      alert("Unknown user type. Please contact support.");
    }
  } catch (err) {
    alert(err.response?.data?.msg || "Login failed");
  }
};


  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl mb-4">Login</h2>
      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-64">
        <input
          type="email"
          placeholder="Email"
          className="p-2 border"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="p-2 border"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-600 text-white py-2">
          Login
        </button>
      </form>
    </div>
  );
}
