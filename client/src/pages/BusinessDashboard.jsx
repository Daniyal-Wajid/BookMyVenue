import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const BusinessDashboard = () => {
  const [services, setServices] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [showForm, setShowForm] = useState(false);

  const navigate = useNavigate();

  const fetchMyServices = async () => {
    try {
      const res = await api.get("/business/my-services");
      setServices(res.data);
    } catch (err) {
      console.error("Error fetching services:", err.response?.data || err.message);
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      await api.post("/business/add-service", {
        title,
        description,
        image,
      });
      setTitle("");
      setDescription("");
      setImage("");
      setShowForm(false);
      fetchMyServices();
    } catch (err) {
      console.error("Error adding service:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchMyServices();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Business Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <div
            key={service._id}
            className="border p-4 rounded shadow cursor-pointer hover:ring-2 hover:ring-green-600 transition"
            onClick={() => navigate(`/business/service/${service._id}`)}
          >
            <img
              src={service.image || "https://via.placeholder.com/300x200"}
              alt={service.title}
              className="w-full h-40 object-cover mb-2"
            />
            <h2 className="text-xl font-semibold">{service.title}</h2>
            <p className="text-gray-600">{service.description}</p>
          </div>
        ))}

        {!showForm ? (
          <div
            onClick={() => setShowForm(true)}
            className="border border-dashed border-gray-400 flex items-center justify-center cursor-pointer rounded shadow text-gray-400 text-6xl font-bold hover:text-green-600 transition-colors"
            style={{ minHeight: "160px" }}
            title="Add New Service"
          >
            +
          </div>
        ) : (
          <form onSubmit={handleAddService} className="border p-4 rounded shadow space-y-4">
            <input
              type="text"
              placeholder="Title"
              className="border p-2 w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Description"
              className="border p-2 w-full"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Image URL"
              className="border p-2 w-full"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Add Service
              </button>
              <button
                type="button"
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BusinessDashboard;
