import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const BusinessDashboard = () => {
  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    fetchMyServices();
  }, []);

  const fetchMyServices = async () => {
    try {
      const res = await api.get("/business/my-services");
      setServices(res.data);
    } catch (err) {
      console.error("Error fetching services:", err.response?.data || err.message);
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
        <StatCard label="Pending Bookings" value="--" color="yellow" />
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

          {/* + Add New Service Button */}
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
