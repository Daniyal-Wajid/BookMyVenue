import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const CustomerDashboard = () => {
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    };

    loadUser();

    api
      .get("/business/all-services")
      .then((res) => setServices(res.data))
      .catch((err) => console.error("Error fetching services:", err));

    setBookings([
      {
        id: 1,
        title: "Wedding Event",
        date: "2025-07-21",
        status: "Confirmed",
      },
      {
        id: 2,
        title: "Birthday Party",
        date: "2025-08-02",
        status: "Pending",
      },
    ]);
  }, []);

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">
      {/* Welcome */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-indigo-700 dark:text-indigo-400 mb-2">
          {user?.name ? `Welcome, ${user.name}!` : "Welcome, Guest!"}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Plan your events with ease and elegance
        </p>
      </div>

      {/* Upcoming Bookings */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400 mb-4">
          📅 Upcoming Bookings
        </h2>
        {bookings.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No upcoming bookings found.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow hover:shadow-md border border-gray-100 dark:border-gray-700"
              >
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                  {booking.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Date: {booking.date}
                </p>
                <span
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                    booking.status === "Confirmed"
                      ? "bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200"
                      : "bg-yellow-100 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-200"
                  }`}
                >
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Explore Services */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400 mb-4">
          🎉 Explore Services
        </h2>
        {services.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No services available right now.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service._id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300"
              >
                <img
                  src={service.image || "https://via.placeholder.com/300x200"}
                  alt={service.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-2 line-clamp-3">
                    {service.description}
                  </p>
                  <button
                    className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
                    onClick={() => navigate(`/service/${service._id}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Booking History */}
      <section>
        <h2 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400 mb-4">
          📜 Booking History
        </h2>
        <ul className="space-y-3 text-gray-700 dark:text-gray-300">
          <li className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow flex justify-between items-center">
            <div>
              <p className="font-medium">Corporate Gala 2024</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                March 2024 - Completed
              </p>
            </div>
            <button className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm">
              View
            </button>
          </li>
          <li className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow flex justify-between items-center">
            <div>
              <p className="font-medium">Wedding Celebration</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Jan 2024 - Cancelled
              </p>
            </div>
            <button className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm">
              View
            </button>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default CustomerDashboard;
