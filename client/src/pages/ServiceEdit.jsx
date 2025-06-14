import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const ServiceEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchService = async () => {
    try {
      const res = await api.get(`/business/service/${id}`);
      setTitle(res.data.title);
      setDescription(res.data.description);
      setImage(res.data.image || "");
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchService();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/business/service/${id}`, { title, description, image });
      navigate(`/business/service/${id}`);
    } catch (err) {
      alert("Failed to update service: " + (err.response?.data || err.message));
    }
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

  return (
    <div className="p-6 max-w-3xl mx-auto bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-4">Edit Service</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="border p-2 w-full rounded dark:bg-gray-800 dark:text-white dark:border-gray-600"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          className="border p-2 w-full rounded dark:bg-gray-800 dark:text-white dark:border-gray-600"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Image URL"
          className="border p-2 w-full rounded dark:bg-gray-800 dark:text-white dark:border-gray-600"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Save Changes
          </button>
          <button
            type="button"
            className="bg-gray-300 dark:bg-gray-700 dark:text-white px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
            onClick={() => navigate(`/business/service/${id}`)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceEdit;
