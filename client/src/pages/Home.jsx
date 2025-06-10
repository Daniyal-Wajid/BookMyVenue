import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-10 items-center">
        {/* Text Section */}
        <div>
          <h1 className="text-5xl font-bold text-gray-800 mb-6 leading-tight">
            Manage Your Events <br /> With Ease & Elegance
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            An all-in-one platform to create, manage, and grow your events.
            Whether you're a business or a customer – you're covered.
          </p>
          <Link
            to="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
        </div>

        {/* Image Section */}
        <div className="flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d2VkZGluZ3xlbnwwfHwwfHx8MA%3D%3D"
            alt="Event"
            className="rounded-xl shadow-lg w-full h-auto max-h-[500px] object-cover"
          />
        </div>
      </div>
    </div>
  );
}
