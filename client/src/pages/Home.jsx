import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Home() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/business/all-services")
      .then((res) => setServices(res.data))
      .catch((err) => console.error("Error fetching services:", err));
  }, []);

  const handleSearch = () => {
    if (searchKeyword.trim() !== "") {
      navigate(`/search-results?keyword=${encodeURIComponent(searchKeyword)}`);
    }
  };

  return (
    <div className="bg-[#f9fbfd] dark:bg-gray-900 text-gray-700 dark:text-white font-sans">
      {/* Hero Section - Always Dark */}
<div className="relative h-screen flex items-center justify-center text-center overflow-hidden bg-black text-white">
  <img
    src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=80"
    alt="Event Background"
    className="absolute inset-0 w-full h-full object-cover opacity-70"
  />
  <div className="absolute inset-0 bg-black bg-opacity-70" />
  <div className="relative z-10 px-6 max-w-4xl">
    <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
      Make Every Event Memorable
    </h1>
    <p className="text-lg md:text-xl text-gray-300 mb-6">
      From birthdays to weddings, corporate to casual – find everything you need in one place.
    </p>

    <div className="flex items-center justify-center mb-6">
      <input
        type="text"
        placeholder="Search venues, decor, food..."
        className="w-full max-w-md px-4 py-3 rounded-l-lg text-black bg-white outline-none"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
      />
      <button
        onClick={handleSearch}
        className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-r-lg text-white"
      >
        Search
      </button>
    </div>
  </div>
</div>

      {/* Explore Venues */}
      <section className="bg-[#f9fbfd] dark:bg-gray-900 py-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-10 text-indigo-700 dark:text-indigo-400">
            Explore Venues
          </h2>
          {services.filter((s) => s.type === "venue").length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No venues available right now.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {services
                .filter((service) => service.type === "venue")
                .map((venue) => (
                  <div
                    key={venue._id}
                    className="bg-[#f1f5f9] dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300"
                  >
                    <img
                      src={
                        venue.image
                          ? `http://localhost:5000${venue.image}`
                          : "https://via.placeholder.com/300x200"
                      }
                      alt={venue.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {venue.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-2 line-clamp-3">
                        {venue.description}
                      </p>
                      <button
                        className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
                        onClick={() => navigate(`/service/${venue._id}`)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </section>

      {/* What We Offer */}
      <section className="bg-[#f0f3f7] dark:bg-gray-800 py-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-12">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
            {[
              { icon: "🏛️", title: "Venues", desc: "Browse handpicked venues for weddings, birthdays, and business events." },
              { icon: "🎨", title: "Decor", desc: "Create stunning themes with our decor partners for all kinds of celebrations." },
              { icon: "🍽️", title: "Catering", desc: "Choose from top-rated caterers offering menus for every taste and budget." },
              { icon: "🎉", title: "Birthday & Private Events", desc: "Plan birthdays, anniversaries, engagements, and more effortlessly." },
              { icon: "🏢", title: "Corporate Events", desc: "Book venues and services for seminars, conferences, and launches." },
              { icon: "📋", title: "Full Event Management", desc: "Let professionals handle your entire event from planning to execution." }
            ].map((item, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">
                <div className="text-indigo-600 text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Us */}
      <section className="bg-[#f9fbfd] dark:bg-gray-900 pt-16 pb-8 px-6 md:px-12 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-indigo-700 dark:text-indigo-400 mb-6">
            📞 Contact Us
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-10">
            Have questions, feedback, or a custom request? We'd love to hear from you!
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thanks For reaching out to us, We'll get back to you shortly");
            }}
            className="bg-[#f1f5f9] dark:bg-gray-800 p-8 rounded-xl shadow-md space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Your Name"
                required
                className="px-4 py-3 rounded w-full text-gray-800 dark:text-white bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 outline-none"
              />
              <input
                type="email"
                placeholder="Your Email"
                required
                className="px-4 py-3 rounded w-full text-gray-800 dark:text-white bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 outline-none"
              />
            </div>
            <textarea
              placeholder="Your Message"
              rows="5"
              required
              className="w-full px-4 py-3 rounded text-gray-800 dark:text-white bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 outline-none"
            ></textarea>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
