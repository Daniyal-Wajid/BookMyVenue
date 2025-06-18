import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

export default function SearchResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const { search } = useLocation();

  const query = new URLSearchParams(search).get("keyword");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get(`/business/search?keyword=${query}`);
        setResults(res.data);
      } catch (err) {
        console.error("Search error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchResults();
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 py-10 px-6 md:px-12">
      <h2 className="text-3xl font-bold mb-6">
        Search Results for "{query}"
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {results.map((item) => (
            <div
              key={item._id}
              className="bg-white p-4 rounded shadow hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-700">{item.description}</p>
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-40 object-cover mt-2 rounded"
                />
              )}
              <p className="text-xs mt-1 italic text-gray-500">Type: {item.type}</p>
              {item.occasionTypes && item.occasionTypes.length > 0 && (
                <p className="text-xs text-gray-600 mt-1">
                  Occasions: {item.occasionTypes.join(", ")}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
