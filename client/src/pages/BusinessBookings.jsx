import React, { useEffect, useState } from "react";
import api from "../services/api";

const BusinessBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api
      .get("/booking/business-bookings")
      .then((res) => setBookings(res.data))
      .catch((err) => console.error("Error fetching business bookings:", err));
  }, []);

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">
        📋 Bookings Made By Customers
      </h1>

      {bookings.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No bookings found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow"
            >
              <h2 className="text-xl font-semibold text-indigo-700 dark:text-indigo-300 mb-2">
                {booking.venueId?.title || "Venue"}
              </h2>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(booking.eventDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Status:</strong> {booking.status}
              </p>
              <p className="mt-2">
                <strong>Booked By:</strong> {booking.customerId?.name} (
                {booking.customerId?.email})
              </p>

              {booking.decorIds?.length > 0 && (
                <div className="mt-2">
                  <strong>Décor:</strong>{" "}
                  {booking.decorIds.map((d) => d.title).join(", ")}
                </div>
              )}
              {booking.cateringIds?.length > 0 && (
                <div>
                  <strong>Catering:</strong>{" "}
                  {booking.cateringIds.map((c) => c.title).join(", ")}
                </div>
              )}
              {booking.menuIds?.length > 0 && (
                <div>
                  <strong>Menu:</strong>{" "}
                  {booking.menuIds.map((m) => m.title).join(", ")}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BusinessBookings;
