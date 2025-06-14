import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gray-900 text-white flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <img
        src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1920&auto=format&fit=crop&q=80"
        alt="Event Background"
        className="absolute inset-0 w-full h-full object-cover opacity-70"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />

      {/* Hero Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
          Plan. Host. Celebrate.
        </h1>
        <p className="text-lg md:text-2xl text-gray-200 mb-8">
          Your all-in-one event management solution – simple, elegant, powerful.
        </p>
        <Link
          to="/login"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3 rounded-lg shadow-lg transition duration-300"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}
