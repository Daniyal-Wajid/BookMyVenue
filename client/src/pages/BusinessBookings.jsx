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
    <div className="pt-28 pb-16 px-6 md:px-12 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">
      <h1 className="pt-10 text-3xl font-extrabold text-indigo-700 dark:text-indigo-400 mb-8">
        📋 Bookings Made By Customers
      </h1>

      {bookings.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No bookings found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bookings.map((booking) => (
  <div
    key={booking._id}
    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700"
  >
    <h2 className="text-xl font-bold text-indigo-700 dark:text-indigo-300 mb-2">
      {booking.venueId?.title || "Venue"}
    </h2>

    <div className="text-sm space-y-1">
      <p>
        <strong className="text-gray-700 dark:text-gray-300">Date:</strong>{" "}
        {new Date(booking.eventDate).toLocaleDateString()}
      </p>
      <p>
        <strong className="text-gray-700 dark:text-gray-300">Status:</strong>{" "}
        {booking.status}
      </p>
      <p>
        <strong className="text-gray-700 dark:text-gray-300">Booked By:</strong>{" "}
        {booking.customerId?.name} ({booking.customerId?.email}) - 📞 {booking.customerId?.phoneNumber}
      </p>

      {booking.decorIds?.length > 0 && (
        <p>
          <strong className="text-gray-700 dark:text-gray-300">Décor:</strong>{" "}
          {booking.decorIds.map((d) => d.title).join(", ")}
        </p>
      )}
      {booking.cateringIds?.length > 0 && (
        <p>
          <strong className="text-gray-700 dark:text-gray-300">Catering:</strong>{" "}
          {booking.cateringIds.map((c) => c.title).join(", ")}
        </p>
      )}
      {booking.menuIds?.length > 0 && (
        <p>
          <strong className="text-gray-700 dark:text-gray-300">Menu:</strong>{" "}
          {booking.menuIds.map((m) => m.title).join(", ")}
        </p>
      )}
    </div>
  </div>
))}

        </div>
      )}
    </div>
  );
};

export default BusinessBookings;
