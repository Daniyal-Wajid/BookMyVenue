import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchService = async () => {
    try {
      const res = await api.get(`/business/service/${id}`);
      setService(res.data);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchService();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await api.delete(`/business/service/${id}`);
        navigate("/business/dashboard");
      } catch (err) {
        alert("Failed to delete service: " + (err.response?.data || err.message));
      }
    }
  };

  const handleEdit = () => {
    navigate(`/business/service/${id}/edit`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!service) return <p>No service found</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{service.title}</h1>
      <img
        src={service.image || "https://via.placeholder.com/600x400"}
        alt={service.title}
        className="w-full h-64 object-cover rounded mb-4"
      />
      <p className="mb-6">{service.description}</p>

      <div className="flex space-x-4">
        <button
          onClick={handleEdit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ServiceDetails;
