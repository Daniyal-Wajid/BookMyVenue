import React, { useEffect, useState } from "react";
import api from "../services/api";

const VenueManagement = () => {
  const [user, setUser] = useState(null);

  // Venue
  const [venueName, setVenueName] = useState("");
  const [venueLocation, setVenueLocation] = useState("");
  const [venueDesc, setVenueDesc] = useState("");
  const [venueImage, setVenueImage] = useState("");

  // Optional: Decor/Catering
  const [decorType, setDecorType] = useState("");
  const [decorName, setDecorName] = useState("");
  const [decorDesc, setDecorDesc] = useState("");

  // Optional: Menu
  const [menuName, setMenuName] = useState("");
  const [menuPrice, setMenuPrice] = useState("");
  const [menuCategory, setMenuCategory] = useState("");
  const [menuImage, setMenuImage] = useState("");

  const [venues, setVenues] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }

    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const res = await api.get("/business/venues");
      setVenues(res.data);
    } catch (err) {
      console.error("Error fetching venues:", err.response?.data || err.message);
    }
  };

  const handleAddVenue = async (e) => {
    e.preventDefault();
    try {
      await api.post("/business/add-venue", {
        name: venueName,
        location: venueLocation,
        description: venueDesc,
        image: venueImage,
      });
      setVenueName("");
      setVenueLocation("");
      setVenueDesc("");
      setVenueImage("");
      fetchVenues();
    } catch (err) {
      console.error("Error adding venue:", err.response?.data || err.message);
    }
  };

  const handleAddDecor = async (e) => {
    e.preventDefault();
    try {
      await api.post("/business/add-decor-catering", {
        type: decorType,
        name: decorName,
        description: decorDesc,
      });
      setDecorType("");
      setDecorName("");
      setDecorDesc("");
    } catch (err) {
      console.error("Error adding decor/catering:", err.response?.data || err.message);
    }
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    try {
      await api.post("/business/add-menu-item", {
        name: menuName,
        price: menuPrice,
        category: menuCategory,
        image: menuImage,
      });
      setMenuName("");
      setMenuPrice("");
      setMenuCategory("");
      setMenuImage("");
    } catch (err) {
      console.error("Error adding menu item:", err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="p-6 max-w-5xl mx-auto space-y-10">
        <h1 className="text-3xl font-bold">Welcome {user?.username}, Manage Your Venues</h1>

        {/* Venue Form */}
        <form onSubmit={handleAddVenue} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded shadow">
          <h2 className="text-2xl font-semibold mb-2">Add Venue</h2>
          <input
            type="text"
            placeholder="Venue Name"
            value={venueName}
            onChange={(e) => setVenueName(e.target.value)}
            required
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          />
          <input
            type="text"
            placeholder="Location"
            value={venueLocation}
            onChange={(e) => setVenueLocation(e.target.value)}
            required
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          />
          <textarea
            placeholder="Description"
            value={venueDesc}
            onChange={(e) => setVenueDesc(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          />
          <input
            type="text"
            placeholder="Image URL"
            value={venueImage}
            onChange={(e) => setVenueImage(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Add Venue
          </button>
        </form>

        {/* Optional: Decor/Catering */}
        <form onSubmit={handleAddDecor} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded shadow">
          <h2 className="text-2xl font-semibold mb-2">Add Décor or Catering</h2>
          <select
            value={decorType}
            onChange={(e) => setDecorType(e.target.value)}
            required
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select Type</option>
            <option value="decor">Décor</option>
            <option value="catering">Catering</option>
          </select>
          <input
            type="text"
            placeholder="Name"
            value={decorName}
            onChange={(e) => setDecorName(e.target.value)}
            required
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          />
          <textarea
            placeholder="Description"
            value={decorDesc}
            onChange={(e) => setDecorDesc(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Add Service
          </button>
        </form>

        {/* Optional: Menu Items */}
        <form onSubmit={handleAddMenuItem} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded shadow">
          <h2 className="text-2xl font-semibold mb-2">Add Menu Item</h2>
          <input
            type="text"
            placeholder="Item Name"
            value={menuName}
            onChange={(e) => setMenuName(e.target.value)}
            required
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          />
          <input
            type="number"
            placeholder="Price"
            value={menuPrice}
            onChange={(e) => setMenuPrice(e.target.value)}
            required
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          />
          <input
            type="text"
            placeholder="Image URL"
            value={menuImage}
            onChange={(e) => setMenuImage(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          />
          <select
            value={menuCategory}
            onChange={(e) => setMenuCategory(e.target.value)}
            required
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select Category</option>
            <option value="starter">Starter</option>
            <option value="main">Main Course</option>
            <option value="dessert">Dessert</option>
            <option value="beverage">Beverage</option>
          </select>
          <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
            Add Menu Item
          </button>
        </form>

        {/* Display Venues */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mt-10">Your Venues</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {venues.map((venue) => (
              <div
                key={venue._id}
                className="bg-white dark:bg-gray-800 p-4 rounded shadow border dark:border-gray-700"
              >
                <img
                  src={venue.image || "https://via.placeholder.com/300x200"}
                  alt={venue.name}
                  className="w-full h-40 object-cover mb-2 rounded"
                />
                <h3 className="text-xl font-semibold">{venue.name}</h3>
                <p className="text-gray-600 dark:text-gray-300">{venue.location}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{venue.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueManagement;
