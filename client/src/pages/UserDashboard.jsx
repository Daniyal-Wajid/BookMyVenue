import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const UserDashboard = () => {
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [historyBookings, setHistoryBookings] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    api
      .get("/booking/my-bookings")
      .then((res) => {
        const today = new Date();
        const upcoming = [];
        const history = [];

        res.data.forEach((b) => {
          const isFuture = new Date(b.eventDate) >= today;
          const isUpcoming =
            (b.status === "Pending" || b.status === "Confirmed") && isFuture;

          const isHistory =
            b.status === "Cancelled" ||
            b.status === "Completed" ||
            (b.status === "Confirmed" && !isFuture);

          if (isUpcoming) upcoming.push(b);
          if (isHistory) history.push(b);
        });

        setUpcomingBookings(upcoming);
        setHistoryBookings(history);
      })
      .catch((err) => console.error("Error fetching bookings:", err));
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
    <div className="pt-28 min-h-screen p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="pt-10 text-center mb-12">
        <h1 className="text-4xl font-extrabold text-indigo-700 dark:text-indigo-400 mb-2">
          {user?.name ? `Hello, ${user.name}!` : "Welcome!"}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Your personalized booking dashboard
        </p>
      </div>

      {/* Upcoming Bookings */}
      <section className="mb-14">
        <h2 className="text-2xl font-semibold mb-6 text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
          📅 Upcoming Bookings
        </h2>
        {upcomingBookings.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No upcoming bookings yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {upcomingBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition duration-300 border border-gray-200 dark:border-gray-700 p-5 cursor-pointer"
                onClick={() => toggleExpand(booking._id)}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold">
                    {booking.venueId?.title || "Booked Event"}
                  </h3>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      booking.status === "Confirmed"
                        ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"
                        : booking.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200"
                        : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Event Date: {new Date(booking.eventDate).toLocaleDateString()}
                </p>

                {expandedId === booking._id && (
                  <div className="text-sm mt-4 border-t pt-3 border-gray-300 dark:border-gray-600 space-y-2">
                    {booking.decorIds?.length > 0 && (
                      <p>
                        <strong>Decor:</strong> {booking.decorIds.map((d) => d.title).join(", ")}
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
                        <strong>Menu:</strong> {booking.menuIds.map((m) => m.title).join(", ")}
                      </p>
                    )}
                    {booking.venueId?.location && (
                      <p>
                        <strong>Venue Location:</strong> {booking.venueId.location}
                      </p>
                    )}
                    <p>
                      <strong>Total:</strong> Rs. {calculateTotal(booking)}
                    </p>
                    <p>
                      <strong>Payment Status:</strong>{" "}
                      <span className="font-semibold">
                        {booking.paymentStatus || "Unpaid"}
                      </span>
                    </p>

                    <div className="flex gap-3 mt-3">
                      {/* Cancel button only if NOT confirmed */}
                      {booking.status !== "Confirmed" && (
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded text-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            cancelBooking(booking._id);
                          }}
                        >
                          Cancel
                        </button>
                      )}

                      {booking.paymentStatus !== "Paid" && (
                        <button
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded text-sm"
                          onClick={async (e) => {
                            e.stopPropagation();
                            try {
                              await api.put(`/booking/${booking._id}/payment-status`, {
                                paymentStatus: "Paid",
                              });
                              setUpcomingBookings((prev) =>
                                prev.map((b) =>
                                  b._id === booking._id
                                    ? { ...b, paymentStatus: "Paid" }
                                    : b
                                )
                              );
                              alert("Payment successful.");
                            } catch (err) {
                              console.error("Payment error:", err);
                              alert("Payment failed.");
                            }
                          }}
                        >
                          Pay Now
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

{/* Booking History */}
<section>
  <h2 className="text-2xl font-semibold mb-6 text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
    📜 Booking History
  </h2>
  {historyBookings.length === 0 ? (
    <p className="text-gray-500 dark:text-gray-400">No previous bookings found.</p>
  ) : (
    <div className="space-y-4">
      {historyBookings.map((booking) => (
        <div
          key={booking._id}
          onClick={() => toggleExpand(booking._id)}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700 cursor-pointer"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">{booking.venueId?.title || "Event"}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(booking.eventDate).toLocaleDateString()} • {booking.status}
              </p>
            </div>
            <span className="text-indigo-500 text-sm hover:underline">
              {expandedId === booking._id ? "Hide Details" : "View Details"}
            </span>
          </div>

          {expandedId === booking._id && (
            <div className="mt-4 pt-3 border-t border-gray-300 dark:border-gray-600 text-sm space-y-2">
              {booking.decorIds?.length > 0 && (
                <p>
                  <strong>Decor:</strong> {booking.decorIds.map((d) => d.title).join(", ")}
                </p>
              )}
              {booking.cateringIds?.length > 0 && (
                <p>
                  <strong>Catering:</strong> {booking.cateringIds.map((c) => c.title).join(", ")}
                </p>
              )}
              {booking.menuIds?.length > 0 && (
                <p>
                  <strong>Menu:</strong> {booking.menuIds.map((m) => m.title).join(", ")}
                </p>
              )}
              {booking.venueId?.location && (
                <p>
                  <strong>Venue Location:</strong> {booking.venueId.location}
                </p>
              )}
              <p>
                <strong>Total:</strong> Rs. {calculateTotal(booking)}
              </p>
              <p>
                <strong>Payment Status:</strong>{" "}
                <span className="font-semibold">
                  {booking.paymentStatus || "Unpaid"}
                </span>
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  )}
</section>
    </div>
  );
};

export default UserDashboard;
