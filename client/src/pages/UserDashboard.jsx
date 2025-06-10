import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; // use your api.js with axios and token

const CustomerDashboard = () => {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
      api.get("/business/all-services")
      .then((res) => setServices(res.data))
      .catch((err) => console.error("Error fetching services:", err));
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">
        Customer Dashboard
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {services.length === 0 && (
          <p className="text-center col-span-full text-gray-500">No services found.</p>
        )}
        {services.map((service) => (
          <div
            key={service._id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={service.image || "https://via.placeholder.com/300x200"}
              alt={service.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {service.title}
              </h2>
              <p className="text-gray-600 mt-2">{service.description}</p>
              <button
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                onClick={() => navigate(`/service/${service._id}`)}
              >
                More Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerDashboard;
