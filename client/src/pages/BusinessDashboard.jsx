import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const BusinessDashboard = () => {
  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);
  const [pendingBookings, setPendingBookings] = useState([]);
  const [confirmedBookings, setConfirmedBookings] = useState([]);
  const [completedBookings, setCompletedBookings] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState(0);
  const [expandedHistoryId, setExpandedHistoryId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    fetchMyServices();
    fetchBookings();
  }, []);

  const fetchMyServices = async () => {
    try {
      const res = await api.get("/business/my-services");
      const venueServices = res.data.filter((service) => service.type === "venue");
      setServices(venueServices);
    } catch (err) {
      console.error("Error fetching services:", err);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await api.get("/booking/business-bookings");

      setPendingBookings(res.data.filter((b) => b.status === "Pending"));

      const confirmed = res.data.filter(
        (b) => b.status === "Confirmed" && b.paymentStatus === "Paid"
      );
      setConfirmedBookings(confirmed);

      setCompletedBookings(res.data.filter((b) => b.status === "Completed"));

      const now = new Date();
      const upcomingCount = confirmed.filter(
        (booking) => new Date(booking.eventDate) > now
      ).length;
      setUpcomingEvents(upcomingCount);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  // Verify payment and confirm booking
  const verifyPayment = async (id) => {
    try {
      await api.put(`/booking/${id}/verify-payment`);
      fetchBookings();
      alert("Payment verified and booking confirmed!");
    } catch (err) {
      console.error("Error verifying payment:", err);
      alert("Failed to verify payment.");
    }
  };

  // Mark booking as completed
  const markAsCompleted = async (id) => {
    try {
      await api.put(`/booking/${id}/complete`);
      fetchBookings();
      alert("Booking marked as completed!");
    } catch (err) {
      console.error("Error marking booking complete:", err);
      alert("Failed to mark booking as complete.");
    }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    try {
      await api.delete(`/booking/${id}`);
      fetchBookings();
    } catch (err) {
      console.error("Error deleting booking:", err);
    }
  };

  const toggleExpandHistory = (id) => {
    setExpandedHistoryId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="pt-28 pb-16 px-6 md:px-12 bg-[#f9fbfd] dark:bg-gray-900 min-h-screen text-gray-700 dark:text-white font-sans">
      {/* Header */}
      <div className="pt-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-3">
        <h1 className="text-3xl font-semibold tracking-tight text-indigo-700 dark:text-indigo-400">
          Business Dashboard
        </h1>
        {user && (
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Welcome, <span className="font-semibold text-green-600">{user.name}</span>
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <StatCard label="Total Services" value={services.length} color="green" />
        <StatCard label="Pending Bookings" value={pendingBookings.length} color="yellow" />
        <StatCard label="Upcoming Events" value={upcomingEvents} color="blue" />
      </div>

      {/* My Services */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400 mb-4">My Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service._id}
              className="bg-[#fdfefe] dark:bg-gray-800 p-4 rounded-lg shadow hover:ring-2 hover:ring-green-600 cursor-pointer transition"
              onClick={() => navigate(`/business/service/${service._id}`)}
            >
              <img
                src={
                  service.image
                    ? `http://localhost:5000${service.image}`
                    : "https://via.placeholder.com/300x200"
                }
                alt={service.title}
                className="w-full h-40 object-cover rounded mb-3"
              />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{service.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{service.description}</p>
            </div>
          ))}

          {/* Add Service Card */}
          <button
            onClick={() => navigate("/business/manage-venue")}
            className="border-2 border-dashed border-gray-400 dark:border-gray-600 flex items-center justify-center text-6xl font-bold text-gray-400 dark:text-gray-500 hover:text-green-600 transition rounded-lg shadow bg-[#fdfefe] dark:bg-gray-800"
            style={{ minHeight: "180px" }}
            title="Add New Service"
          >
            +
          </button>
        </div>
      </section>

      {/* Pending Bookings */}
      <section>
        <h2 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400 mb-4">Pending Bookings</h2>
        {pendingBookings.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No pending bookings.</p>
        ) : (
          <ul className="space-y-4">
            {pendingBookings.map((booking) => (
              <li
                key={booking._id}
                className="bg-[#fdfefe] dark:bg-gray-800 p-5 rounded-lg shadow border dark:border-gray-700"
              >
                <div className="mb-2 space-y-1">
                  <p><strong>Event Date:</strong> {new Date(booking.eventDate).toLocaleDateString()}</p>
                  <p><strong>Venue:</strong> {booking.venueId?.title || "N/A"}</p>
                  <p><strong>Status:</strong> {booking.status}</p>
                  <p>
                    <strong>Payment:</strong>{" "}
                    <span className={booking.paymentStatus === "Paid" ? "text-green-600" : "text-red-500"}>
                      {booking.paymentStatus || "Unpaid"}
                    </span>
                  </p>
                </div>
                <div className="flex gap-3 mt-3">
                  {booking.paymentStatus === "Unpaid" ? (
                    <button
                      onClick={() => verifyPayment(booking._id)}
                      className="px-4 py-2 rounded text-white text-sm bg-blue-600 hover:bg-blue-700"
                      title="Verify Payment"
                    >
                      Verify Payment
                    </button>
                  ) : (
                    <button
                      disabled
                      className="px-4 py-2 rounded text-white text-sm bg-gray-400 cursor-not-allowed"
                      title="Payment already verified"
                    >
                      Payment Verified
                    </button>
                  )}
                  <button
                    onClick={() => deleteBooking(booking._id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Confirmed Bookings */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400 mb-4">Confirmed Bookings</h2>
        {confirmedBookings.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No confirmed bookings.</p>
        ) : (
          <ul className="space-y-4">
            {confirmedBookings.map((booking) => (
              <li
                key={booking._id}
                className="bg-[#fdfefe] dark:bg-gray-800 p-5 rounded-lg shadow border dark:border-gray-700"
              >
                <div className="mb-2 space-y-1">
                  <p><strong>Event Date:</strong> {new Date(booking.eventDate).toLocaleDateString()}</p>
                  <p><strong>Venue:</strong> {booking.venueId?.title || "N/A"}</p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className="text-green-600 font-semibold">{booking.status}</span>
                  </p>
                  <p>
                    <strong>Payment:</strong>{" "}
                    <span className="text-green-600 font-semibold">{booking.paymentStatus || "Paid"}</span>
                  </p>
                </div>
                <div className="mt-3 flex gap-3">
                  {booking.status === "Confirmed" && booking.paymentStatus === "Paid" ? (
                    <button
                      onClick={() => markAsCompleted(booking._id)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
                      title="Mark booking as complete"
                    >
                      Mark as Complete
                    </button>
                  ) : (
                    <button
                      disabled
                      className="px-4 py-2 bg-gray-400 cursor-not-allowed text-white rounded text-sm"
                      title="Cannot mark complete"
                    >
                      Complete
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Completed Bookings / History */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400 mb-4">Booking History</h2>
        {completedBookings.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No completed bookings yet.</p>
        ) : (
          <ul className="space-y-4">
            {completedBookings.map((booking) => (
              <li
                key={booking._id}
                className="bg-[#fdfefe] dark:bg-gray-800 p-5 rounded-lg shadow border dark:border-gray-700 cursor-pointer"
                onClick={() => toggleExpandHistory(booking._id)}
              >
                <div className="flex justify-between items-center mb-2">
                  <p><strong>Event Date:</strong> {new Date(booking.eventDate).toLocaleDateString()}</p>
                  <p><strong>Venue:</strong> {booking.venueId?.title || "N/A"}</p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className="text-gray-600 dark:text-gray-300 font-semibold">{booking.status}</span>
                  </p>
                </div>

                {expandedHistoryId === booking._id && (
                  <div className="mt-4 border-t border-gray-300 dark:border-gray-600 pt-3 space-y-2 text-sm">
                    {/* Customer Info */}
                    {booking.customerId && (
                      <>
                        <p><strong>Customer Name:</strong> {booking.customerId.name || "N/A"}</p>
                        <p><strong>Contact:</strong> {booking.customerId.phoneNumber || booking.customerId.phone || "N/A"}</p>
                      </>
                    )}

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
                      <strong>Payment Status:</strong>{" "}
                      <span className="font-semibold">{booking.paymentStatus || "Paid"}</span>
                    </p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

const StatCard = ({ label, value, color }) => {
  const colors = {
    green: "text-green-600",
    yellow: "text-yellow-500",
    blue: "text-blue-500",
  };

  return (
    <div className="bg-[#fdfefe] dark:bg-gray-800 p-6 rounded-lg shadow text-center">
      <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">{label}</h3>
      <p className={`text-3xl font-extrabold mt-2 ${colors[color]}`}>{value}</p>
    </div>
  );
};

export default BusinessDashboard;
