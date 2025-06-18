import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchKeyword.trim() !== "") {
      navigate(`/search-results?keyword=${encodeURIComponent(searchKeyword)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="relative h-screen flex items-center justify-center text-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1920&auto=format&fit=crop&q=80"
          alt="Event Background"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-black bg-opacity-60" />
        <div className="relative z-10 px-6 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            Plan. Host. Celebrate.
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 mb-6">
            Your all-in-one event management solution – simple, elegant, powerful.
          </p>

          <div className="flex items-center justify-center mb-6">
            <input
              type="text"
              placeholder="Search events, venues, organizers..."
              className="w-full max-w-md px-4 py-3 rounded-l-lg text-black outline-none"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-r-lg"
            >
              Search
            </button>
          </div>

          <Link
            to="/login"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3 rounded-lg shadow-lg transition duration-300"
          >
            Get Started
          </Link>
        </div>
      </div>

      <section className="bg-white text-gray-900 py-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-10">Why Choose EventPortal?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <div className="text-blue-600 text-5xl mb-4">🎉</div>
              <h3 className="text-xl font-semibold mb-2">Effortless Planning</h3>
              <p>Organize your event in minutes with our streamlined tools and templates.</p>
            </div>
            <div>
              <div className="text-blue-600 text-5xl mb-4">📍</div>
              <h3 className="text-xl font-semibold mb-2">Smart Venue Finder</h3>
              <p>Discover venues near you with filters for size, amenities, and availability.</p>
            </div>
            <div>
              <div className="text-blue-600 text-5xl mb-4">📈</div>
              <h3 className="text-xl font-semibold mb-2">Real-Time Insights</h3>
              <p>Track RSVPs, manage bookings, and gain valuable event insights effortlessly.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
