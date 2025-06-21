import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get("keyword");

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await api.get(`/services/search?keyword=${keyword}`);
        setResults(response.data);
      } catch (error) {
        console.error("Search fetch error", error);
      } finally {
        setLoading(false);
      }
    };

    if (keyword) fetchResults();
  }, [keyword]);

  return (
    <div className="min-h-screen bg-[#f9fbfd] dark:bg-gray-900 text-gray-800 dark:text-gray-100 py-16 px-6 font-sans">
      <h2 className="text-3xl font-semibold text-center mb-10 text-indigo-700 dark:text-indigo-400">
        Search Results for "{keyword}"
      </h2>

      {loading ? (
        <p className="text-center text-gray-600 dark:text-gray-300">Loading...</p>
      ) : results.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No venues found matching your search.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {results
            .filter((service) => service.type === "venue")
            .map((venue) => (
              <div
                key={venue._id}
                className="bg-[#f1f5f9] dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300"
              >
                <img
                  src={
                    venue.image
                      ? `http://localhost:5000${venue.image}`
                      : "https://via.placeholder.com/300x200"
                  }
                  alt={venue.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {venue.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-2 line-clamp-3">
                    {venue.description}
                  </p>
                  <button
                    className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
                    onClick={() => navigate(`/service/${venue._id}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
