import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null); // will hold venue + related services
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchService = async () => {
    try {
      const res = await api.get(`/business/service/${id}`);
      setData(res.data); // res.data has venue, decorItems, cateringItems, menuItems
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchService();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this venue?")) {
      try {
        await api.delete(`/business/service/${id}`);
        navigate("/business-dashboard");
      } catch (err) {
        alert("Failed to delete venue: " + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleEdit = () => {
    navigate(`/business/service/${id}/edit`);
  };

  if (loading)
    return (
      <p className="text-center text-gray-600 dark:text-gray-300 animate-pulse">
        Loading...
      </p>
    );

  if (error)
    return (
      <p className="text-center text-red-500 dark:text-red-400">
        Error: {error}
      </p>
    );

  if (!data || !data.venue)
    return (
      <p className="text-center text-gray-500 dark:text-gray-400">
        No venue found
      </p>
    );

  const { venue, decorItems, cateringItems, menuItems } = data;

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white w-full sm:px-12 lg:px-24">
      <h1 className="text-3xl font-bold mb-4">{venue.title}</h1>
      <img
        src={venue.image || "https://via.placeholder.com/600x400"}
        alt={venue.title}
        className="w-full h-64 object-cover rounded mb-4"
      />
      <p className="mb-6 text-gray-800 dark:text-gray-300">{venue.description}</p>

      <div className="flex space-x-4 mb-8">
        <button
          onClick={handleEdit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Edit Venue
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Delete Venue
        </button>
      </div>

      {/* Related services */}
      <ServiceList title="Decor Items" services={decorItems} />
      <ServiceList title="Catering Items" services={cateringItems} />
      <ServiceList title="Menu Items" services={menuItems} />
    </div>
  );
};

const ServiceList = ({ title, services }) => {
  if (!services || services.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service._id}
            className="border dark:border-gray-700 bg-white dark:bg-gray-800 p-4 rounded shadow"
          >
            <img
              src={service.image || "https://via.placeholder.com/300x200"}
              alt={service.title}
              className="w-full h-32 object-cover mb-2 rounded"
            />
            <h3 className="text-xl font-semibold">{service.title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{service.description}</p>
            {service.price !== undefined && (
              <p className="mt-2 font-semibold">Price: ${service.price}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceDetails;
