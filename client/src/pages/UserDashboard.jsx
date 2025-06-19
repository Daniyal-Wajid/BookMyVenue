import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const UserDashboard = () => {
  const [services, setServices] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [historyBookings, setHistoryBookings] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    // Fetch all services
    api.get("/business/all-services")
      .then((res) => setServices(res.data))
      .catch((err) => console.error("Error fetching services:", err));

    // Fetch all bookings and filter upcoming on frontend
    api.get("/booking/my-bookings")
      .then((res) => {
        const today = new Date();
        const upcoming = res.data.filter(
          (b) =>
            (b.status === "Pending" || b.status === "Confirmed") &&
            new Date(b.eventDate) >= today
        );
        setUpcomingBookings(upcoming);
      })
      .catch((err) => console.error("Error fetching upcoming bookings:", err));

    // Fetch booking history (Cancelled or Confirmed, past) from backend filtered route
    api.get("/booking/my-booking-history")
      .then((res) => setHistoryBookings(res.data))
      .catch((err) => console.error("Error fetching booking history:", err));
  }, []);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const cancelBooking = async (id) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await api.put(`/booking/${id}/cancel`);
        setUpcomingBookings((prev) =>
          prev.map((b) => (b._id === id ? { ...b, status: "Cancelled" } : b))
        );
        alert("Booking cancelled.");
      } catch (err) {
        console.error("Error cancelling booking:", err);
        alert("Failed to cancel booking.");
      }
    }
  };

  const calculateTotal = (booking) => {
    const sumPrices = (arr) =>
      (arr || []).reduce((total, item) => total + (item.price || 0), 0);
    return (
      (booking.venueId?.price || 0) +
      sumPrices(booking.decorIds) +
      sumPrices(booking.cateringIds) +
      sumPrices(booking.menuIds)
    );
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">
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
        {upcomingBookings.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No upcoming bookings found.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {upcomingBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border border-gray-200 dark:border-gray-700 cursor-pointer"
                onClick={() => toggleExpand(booking._id)}
              >
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                  {booking.venueId?.title || "Booked Event"}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Date: {new Date(booking.eventDate).toLocaleDateString()}
                </p>
                <span
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                    booking.status === "Confirmed"
                      ? "bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200"
                      : booking.status === "Pending"
                      ? "bg-yellow-100 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-200"
                      : "bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200"
                  }`}
                >
                  {booking.status}
                </span>

                {/* Expanded Details */}
                {expandedId === booking._id && (
                  <div className="mt-4 border-t border-gray-300 dark:border-gray-600 pt-3 text-sm">
                    {booking.decorIds?.length > 0 && (
                      <p>
                        <strong>Decor:</strong>{" "}
                        {booking.decorIds.map((d) => d.title).join(", ")}
                      </p>
                    )}
                    {booking.cateringIds?.length > 0 && (
                      <p>
                        <strong>Catering:</strong>{" "}
                        {booking.cateringIds.map((c) => c.title).join(", ")}
                      </p>
                    )}
                    {booking.menuIds?.length > 0 && (
                      <p>
                        <strong>Menu:</strong>{" "}
                        {booking.menuIds.map((m) => m.title).join(", ")}
                      </p>
                    )}
                    {booking.venueId?.location && (
                      <p>
                        <strong>Venue Location:</strong> {booking.venueId.location}
                      </p>
                    )}
                    <p className="mt-2">
                      <strong>Total Estimated Amount:</strong> Rs.{" "}
                      {calculateTotal(booking)}
                    </p>
                    <button
                      className="mt-3 px-4 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        cancelBooking(booking._id);
                      }}
                    >
                      Cancel Booking
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Explore Venues */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400 mb-4">
          🎉 Explore Venues
        </h2>
        {services.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No venues available right now.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {services
              .filter((service) => service.type === "venue")
              .map((venue) => (
                <div
                  key={venue._id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300"
                >
                  <img
                    src={venue.image || "https://via.placeholder.com/300x200"}
                    alt={venue.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
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
      </section>

      {/* Booking History */}
      <section>
        <h2 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400 mb-4">
          📜 Booking History
        </h2>
        {historyBookings.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No booking history found.</p>
        ) : (
          <ul className="space-y-3 text-gray-700 dark:text-gray-300">
            {historyBookings.map((booking) => (
              <li
                key={booking._id}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{booking.venueId?.title || "Event"}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(booking.eventDate).toLocaleDateString()} - {booking.status}
                  </p>
                </div>
                <button
                  className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm"
                  onClick={() => navigate(`/booking/${booking._id}`)}
                >
                  View
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default UserDashboard;
