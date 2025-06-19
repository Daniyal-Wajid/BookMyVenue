import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const BusinessDashboard = () => {
  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);
  const [pendingBookings, setPendingBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    fetchMyServices();
    fetchPendingBookings();
  }, []);

const fetchMyServices = async () => {
  try {
    const res = await api.get("/business/my-services");
    // Filter only venues
    const venueServices = res.data.filter(service => service.type === "venue");
    setServices(venueServices);
  } catch (err) {
    console.error("Error fetching services:", err.response?.data || err.message);
  }
};

const markAsCompleted = async (id) => {
  try {
    await api.put(`/booking/${id}/complete`);
    fetchPendingBookings(); // refresh the list
  } catch (err) {
    console.error("Error marking booking complete:", err.response?.data || err.message);
  }
};

const deleteBooking = async (id) => {
  if (!window.confirm("Are you sure you want to delete this booking?")) return;
  try {
    await api.delete(`/booking/${id}`);
    fetchPendingBookings(); // refresh the list
  } catch (err) {
    console.error("Error deleting booking:", err.response?.data || err.message);
  }
};


const fetchPendingBookings = async () => {
  try {
    const res = await api.get("/booking/business-bookings");
    const pendingOnly = res.data.filter(b => b.status === "Pending");
    setPendingBookings(pendingOnly);
  } catch (err) {
    console.error("Error fetching pending bookings:", err.response?.data || err.message);
  }
};


  return (
    <div className="flex flex-col gap-6 px-6 md:px-12 py-6 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Business Dashboard</h1>
        {user && (
          <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
            Welcome,{" "}
            <span className="text-green-600 font-semibold">
              {user.username || user.name}
            </span>
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Services" value={services.length} color="green" />
        <StatCard label="Pending Bookings" value={pendingBookings.length} color="yellow" />
        <StatCard label="Monthly Revenue" value="--" color="blue" />
      </div>

      {/* Services */}
      <div>
        <h2 className="text-2xl font-semibold mt-6 mb-4">My Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 col-span-full">
              You haven't added any services yet.
            </p>
          )}
          {services.map((service) => (
            <div
              key={service._id}
              className="border dark:border-gray-700 bg-white dark:bg-gray-800 p-4 rounded shadow cursor-pointer hover:ring-2 hover:ring-green-600 transition"
              onClick={() => navigate(`/business/service/${service._id}`)}
            >
              <img
                src={service.image || "https://via.placeholder.com/300x200"}
                alt={service.title || "Service"}
                className="w-full h-40 object-cover mb-2 rounded"
              />
              <h3 className="text-xl font-semibold">{service.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{service.description}</p>
            </div>
          ))}

          {/* Add New Service */}
          <button
            onClick={() => navigate("/business/manage-venue")}
            className="border border-dashed border-gray-400 dark:border-gray-600 flex items-center justify-center text-6xl font-bold text-gray-400 dark:text-gray-500 hover:text-green-600 transition-colors bg-white dark:bg-gray-800 rounded shadow"
            style={{ minHeight: "160px" }}
            title="Add New Service"
          >
            +
          </button>
        </div>
      </div>

      {/* Pending Bookings List */}
      <div>
        <h2 className="text-2xl font-semibold mt-10 mb-4">Pending Bookings</h2>
        {pendingBookings.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No pending bookings.</p>
        ) : (
          <ul className="space-y-3">
            {pendingBookings.map((booking) => (
  <li
    key={booking._id}
    className="p-4 border dark:border-gray-700 rounded bg-white dark:bg-gray-800 shadow space-y-2"
  >
    <p><strong>Event Date:</strong> {new Date(booking.eventDate).toLocaleDateString()}</p>
    <p><strong>Venue:</strong> {booking.venueId?.title || "N/A"}</p>
    <p><strong>Status:</strong> {booking.status}</p>

    <div className="flex gap-3 mt-2">
      <button
        onClick={() => markAsCompleted(booking._id)}
        className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Mark as Completed
      </button>
      <button
        onClick={() => deleteBooking(booking._id)}
        className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        Delete
      </button>
    </div>
  </li>
))}

          </ul>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color }) => {
  const colorClass = {
    green: "text-green-600",
    yellow: "text-yellow-500",
    blue: "text-blue-500",
  }[color];

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow text-center">
      <h2 className="text-xl font-semibold">{label}</h2>
      <p className={`text-2xl mt-2 font-bold ${colorClass}`}>{value}</p>
    </div>
  );
};

export default BusinessDashboard;
