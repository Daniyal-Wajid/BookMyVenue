import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [venue, setVenue] = useState(null);
  const [decorItems, setDecorItems] = useState([]);
  const [cateringItems, setCateringItems] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await api.get(`/business/services/${id}`);
        setVenue(res.data.venue);
        setDecorItems(res.data.decorItems);
        setCateringItems(res.data.cateringItems);
        setMenuItems(res.data.menuItems);
      } catch (err) {
        console.error(err);
        setError("Could not load service details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) return <div className="p-6 text-center text-gray-500">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="p-6 max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-indigo-600 hover:underline dark:text-indigo-400"
        >
          ← Back to Services
        </button>

        {/* Venue Details */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden mb-10">
          <img
            src={venue.image || "https://via.placeholder.com/800x400"}
            alt={venue.title}
            className="w-full h-72 object-cover"
          />
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-2">{venue.title}</h1>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{venue.description}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Location:</strong> {venue.location}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Price:</strong> Rs {venue.price}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Occasions:</strong>{" "}
              {venue.occasionTypes?.length > 0 ? venue.occasionTypes.join(", ") : "N/A"}
            </p>
          </div>
        </div>

        {/* Decor Items */}
        {decorItems.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-600 dark:text-indigo-400">
              🎀 Décor Services
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {decorItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow"
                >
                  <h3 className="text-lg font-bold">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Price: Rs {item.price}
                  </p>
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="mt-2 w-full h-40 object-cover rounded"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Catering Items */}
        {cateringItems.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-600 dark:text-indigo-400">
              🍽️ Catering Services
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {cateringItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow"
                >
                  <h3 className="text-lg font-bold">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Price: Rs {item.price}
                  </p>
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="mt-2 w-full h-40 object-cover rounded"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Menu Items */}
        {menuItems.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-indigo-600 dark:text-indigo-400">
              🧾 Menu
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {menuItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow"
                >
                  <h3 className="text-lg font-bold">{item.title || item.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Price: Rs {item.price}
                  </p>
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title || item.name}
                      className="mt-2 w-full h-40 object-cover rounded"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceDetail;
