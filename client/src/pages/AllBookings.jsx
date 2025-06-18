import React, { useEffect, useState } from "react";
import api from "../services/api";

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get("/booking/my-bookings");
        setBookings(res.data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to fetch bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <div className="p-6 text-center text-gray-500">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400 mb-6 text-center">
        📖 All Your Bookings
      </h1>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          You haven’t made any bookings yet.
        </p>
      ) : (
        <div className="space-y-6 max-w-4xl mx-auto">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700"
            >
              <h2 className="text-xl font-semibold text-indigo-700 dark:text-indigo-300 mb-2">
                Venue: {booking.venueId?.title || "N/A"}
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Date:</strong>{" "}
                {new Date(booking.eventDate).toLocaleDateString()}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Status:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    booking.status === "Confirmed"
                      ? "bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-100"
                      : booking.status === "Pending"
                      ? "bg-yellow-200 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-100"
                      : "bg-red-200 dark:bg-red-700 text-red-800 dark:text-red-100"
                  }`}
                >
                  {booking.status}
                </span>
              </p>

              {/* Decor */}
              {booking.decorIds.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-1">🎀 Decor Services:</h3>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
                    {booking.decorIds.map((item) => (
                      <li key={item._id}>{item.title || "Decor Item"}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Catering */}
              {booking.cateringIds.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-1">🍽️ Catering Services:</h3>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
                    {booking.cateringIds.map((item) => (
                      <li key={item._id}>{item.title || "Catering Item"}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Menu */}
              {booking.menuIds.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-1">🧾 Menu Items:</h3>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
                    {booking.menuIds.map((item) => (
                      <li key={item._id}>{item.title || "Menu Item"}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllBookings;
