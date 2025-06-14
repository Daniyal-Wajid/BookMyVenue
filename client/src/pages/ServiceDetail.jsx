import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await api.get(`/business/services/${id}`);
        setService(response.data);
      } catch (err) {
        console.error(err);
        setError("Could not load service details.");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  if (loading)
    return (
      <div className="p-6 text-center text-gray-600 dark:text-gray-300 text-lg animate-pulse">
        Loading service details...
      </div>
    );

  if (error)
    return (
      <div className="p-6 text-center text-red-500 font-medium dark:text-red-400">
        {error}
      </div>
    );

  if (!service)
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
        Service not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="p-6 max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-indigo-600 dark:text-indigo-400 hover:underline transition"
        >
          ← Back to Services
        </button>

        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden">
          <img
            src={service.image || "https://via.placeholder.com/800x400"}
            alt={service.title}
            className="w-full h-72 object-cover"
          />

          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">{service.title}</h1>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              {service.description || "No description provided."}
            </p>

            {service.category && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span className="font-medium">Category:</span> {service.category}
              </p>
            )}
            {service.price && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span className="font-medium">Price:</span> ${service.price}
              </p>
            )}
            {service.provider && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span className="font-medium">Provided by:</span> {service.provider}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
