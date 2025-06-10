import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api"; // make sure path is correct

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
        setError("Could not load service details.");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  if (loading) return <p className="p-6 text-center">Loading service details...</p>;
  if (error) return <p className="p-6 text-center text-red-500">{error}</p>;
  if (!service) return <p className="p-6 text-center">Service not found.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-indigo-600 hover:underline"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-4">{service.title}</h1>
      <img
        src={service.image || "https://via.placeholder.com/600x400"}
        alt={service.title}
        className="w-full h-64 object-cover rounded mb-4"
      />
      <p className="text-gray-700 mb-6">{service.description}</p>

      {/* Add more fields here if your service has more details */}
    </div>
  );
};

export default ServiceDetail;
