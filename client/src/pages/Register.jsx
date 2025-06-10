import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("customer");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", { name, email, password, userType });
      alert("Registered successfully!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl mb-4">Register</h2>
      <form onSubmit={handleRegister} className="flex flex-col gap-4 w-64">
        <input
          type="text"
          placeholder="Name"
          className="p-2 border"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <select
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
          className="p-2 border"
        >
          <option value="customer">Customer</option>
          <option value="business">Business</option>
        </select>
        <button type="submit" className="bg-green-600 text-white py-2">
          Register
        </button>
      </form>
    </div>
  );
}
