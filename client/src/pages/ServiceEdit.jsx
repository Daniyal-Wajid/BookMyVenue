import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const ServiceEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Venue info
  const [venueName, setVenueName] = useState("");
  const [venueLocation, setVenueLocation] = useState("");
  const [venuePrice, setVenuePrice] = useState("");
  const [venueDesc, setVenueDesc] = useState("");
  const [venueImage, setVenueImage] = useState("");
  const [occasionTypes, setOccasionTypes] = useState([]);

  // Related services arrays
  const [decors, setDecors] = useState([]);
  const [caterings, setCaterings] = useState([]);
  const [menus, setMenus] = useState([]);

  // Temp states for adding new items
  const [decorTitle, setDecorTitle] = useState("");
  const [decorDesc, setDecorDesc] = useState("");
  const [decorPrice, setDecorPrice] = useState("");
  const [decorImage, setDecorImage] = useState("");

  const [cateringTitle, setCateringTitle] = useState("");
  const [cateringDesc, setCateringDesc] = useState("");
  const [cateringPrice, setCateringPrice] = useState("");
  const [cateringImage, setCateringImage] = useState("");

  const [menuName, setMenuName] = useState("");
  const [menuPrice, setMenuPrice] = useState("");
  const [menuCategory, setMenuCategory] = useState("");
  const [menuImage, setMenuImage] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch venue + services on mount
  useEffect(() => {
    const fetchVenueData = async () => {
      try {
        const res = await api.get(`/business/service/${id}`);
        const { venue, decorItems, cateringItems, menuItems } = res.data;

        setVenueName(venue.title || "");
        setVenueLocation(venue.location || "");
        setVenuePrice(venue.price || "");
        setVenueDesc(venue.description || "");
        setVenueImage(venue.image || "");
        setOccasionTypes(venue.occasionTypes || []);

        setDecors(decorItems || []);
        setCaterings(cateringItems || []);
        setMenus(menuItems || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVenueData();
  }, [id]);

  // Handlers for adding new items
  const handleAddDecor = () => {
    if (!decorTitle.trim()) return alert("Decor title required");
    setDecors([
      ...decors,
      {
        _id: `new-decor-${Date.now()}`, // temp id for react keys
        title: decorTitle,
        description: decorDesc,
        price: Number(decorPrice),
        image: decorImage,
      },
    ]);
    setDecorTitle("");
    setDecorDesc("");
    setDecorPrice("");
    setDecorImage("");
  };

  const handleAddCatering = () => {
    if (!cateringTitle.trim()) return alert("Catering title required");
    setCaterings([
      ...caterings,
      {
        _id: `new-catering-${Date.now()}`,
        title: cateringTitle,
        description: cateringDesc,
        price: Number(cateringPrice),
        image: cateringImage,
      },
    ]);
    setCateringTitle("");
    setCateringDesc("");
    setCateringPrice("");
    setCateringImage("");
  };

  const handleAddMenu = () => {
    if (!menuName.trim()) return alert("Menu name required");
    setMenus([
      ...menus,
      {
        _id: `new-menu-${Date.now()}`,
        name: menuName,
        category: menuCategory,
        price: Number(menuPrice),
        image: menuImage,
      },
    ]);
    setMenuName("");
    setMenuCategory("");
    setMenuPrice("");
    setMenuImage("");
  };

  // Submit updated venue + related services to backend
  const handleSubmitVenue = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        title: venueName,
        location: venueLocation,
        price: Number(venuePrice),
        description: venueDesc,
        image: venueImage,
        occasionTypes,
        decorItems: decors.map(({ _id, title, description, price, image }) => ({
          _id: _id?.toString().startsWith("new-") ? undefined : _id, // omit _id for new items
          title,
          description,
          price,
          image,
        })),
        cateringItems: caterings.map(({ _id, title, description, price, image }) => ({
          _id: _id?.toString().startsWith("new-") ? undefined : _id,
          title,
          description,
          price,
          image,
        })),
        menuItems: menus.map(({ _id, name, category, price, image }) => ({
          _id: _id?.toString().startsWith("new-") ? undefined : _id,
          name,
          category,
          price,
          image,
        })),
      };

      await api.put(`/business/service/${id}`, payload);
      alert("Venue updated successfully");
      navigate("/business-dashboard");
    } catch (err) {
      alert("Failed to update venue: " + (err.response?.data?.message || err.message));
    }
  };

  // Toggle occasion checkbox handler
  const toggleOccasion = (type) => {
    setOccasionTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
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
        Error loading venue: {error}
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="p-6 mx-auto max-w-5xl space-y-10">
        <h1 className="text-3xl font-bold">Edit Venue with Services</h1>

        <form onSubmit={handleSubmitVenue} className="p-6 space-y-6 bg-white dark:bg-gray-800 rounded shadow">
          {/* Venue Info */}
          <h2 className="text-xl font-semibold">Venue Info</h2>

          <input
            type="text"
            placeholder="Venue Name"
            value={venueName}
            onChange={(e) => setVenueName(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700"
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={venueLocation}
            onChange={(e) => setVenueLocation(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700"
            required
          />
          <input
            type="number"
            placeholder="Venue Price"
            value={venuePrice}
            onChange={(e) => setVenuePrice(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700"
          />
          <textarea
            placeholder="Description"
            value={venueDesc}
            onChange={(e) => setVenueDesc(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700"
          />
          <input
            type="text"
            placeholder="Image URL"
            value={venueImage}
            onChange={(e) => setVenueImage(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700"
          />

          {/* Occasions */}
          <h2 className="text-xl font-semibold">Occasions</h2>
          <div className="flex flex-wrap gap-4 mb-4">
            {["Wedding", "Birthday", "Corporate", "Engagement", "Anniversary"].map((type) => (
              <label key={type} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={type}
                  checked={occasionTypes.includes(type)}
                  onChange={() => toggleOccasion(type)}
                />
                {type}
              </label>
            ))}
          </div>

          {/* Decor Services */}
          <h2 className="text-xl font-semibold">Décor Services</h2>
          {decors.map((decor, i) => (
            <div key={decor._id} className="flex gap-2 mb-2 items-center">
              <input
                type="text"
                value={decor.title}
                onChange={(e) => {
                  const newDecors = [...decors];
                  newDecors[i].title = e.target.value;
                  setDecors(newDecors);
                }}
                className="p-2 border rounded dark:bg-gray-700"
                placeholder="Title"
              />
              <input
                type="text"
                value={decor.description}
                onChange={(e) => {
                  const newDecors = [...decors];
                  newDecors[i].description = e.target.value;
                  setDecors(newDecors);
                }}
                className="p-2 border rounded dark:bg-gray-700"
                placeholder="Description"
              />
              <input
                type="number"
                value={decor.price}
                onChange={(e) => {
                  const newDecors = [...decors];
                  newDecors[i].price = e.target.value;
                  setDecors(newDecors);
                }}
                className="p-2 border rounded dark:bg-gray-700"
                placeholder="Price"
              />
              <input
                type="text"
                value={decor.image}
                onChange={(e) => {
                  const newDecors = [...decors];
                  newDecors[i].image = e.target.value;
                  setDecors(newDecors);
                }}
                className="p-2 border rounded dark:bg-gray-700"
                placeholder="Image URL"
              />
              <button
                type="button"
                onClick={() => setDecors(decors.filter((_, idx) => idx !== i))}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))}

          {/* Add new Decor */}
          <div className="flex flex-wrap gap-2 mb-4 items-center">
            <input
              type="text"
              placeholder="Title"
              value={decorTitle}
              onChange={(e) => setDecorTitle(e.target.value)}
              className="p-2 border rounded dark:bg-gray-700"
            />
            <input
              type="text"
              placeholder="Description"
              value={decorDesc}
              onChange={(e) => setDecorDesc(e.target.value)}
              className="p-2 border rounded dark:bg-gray-700"
            />
            <input
              type="number"
              placeholder="Price"
              value={decorPrice}
              onChange={(e) => setDecorPrice(e.target.value)}
              className="p-2 border rounded dark:bg-gray-700"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={decorImage}
              onChange={(e) => setDecorImage(e.target.value)}
              className="p-2 border rounded dark:bg-gray-700"
            />
            <button
              type="button"
              onClick={handleAddDecor}
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Add Decor
            </button>
          </div>

          {/* Catering Services */}
          <h2 className="text-xl font-semibold">Catering Services</h2>
          {caterings.map((catering, i) => (
            <div key={catering._id} className="flex gap-2 mb-2 items-center">
              <input
                type="text"
                value={catering.title}
                onChange={(e) => {
                  const newCaterings = [...caterings];
                  newCaterings[i].title = e.target.value;
                  setCaterings(newCaterings);
                }}
                className="p-2 border rounded dark:bg-gray-700"
                placeholder="Title"
              />
              <input
                type="text"
                value={catering.description}
                onChange={(e) => {
                  const newCaterings = [...caterings];
                  newCaterings[i].description = e.target.value;
                  setCaterings(newCaterings);
                }}
                className="p-2 border rounded dark:bg-gray-700"
                placeholder="Description"
              />
              <input
                type="number"
                value={catering.price}
                onChange={(e) => {
                  const newCaterings = [...caterings];
                  newCaterings[i].price = e.target.value;
                  setCaterings(newCaterings);
                }}
                className="p-2 border rounded dark:bg-gray-700"
                placeholder="Price"
              />
              <input
                type="text"
                value={catering.image}
                onChange={(e) => {
                  const newCaterings = [...caterings];
                  newCaterings[i].image = e.target.value;
                  setCaterings(newCaterings);
                }}
                className="p-2 border rounded dark:bg-gray-700"
                placeholder="Image URL"
              />
              <button
                type="button"
                onClick={() => setCaterings(caterings.filter((_, idx) => idx !== i))}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))}

          {/* Add new Catering */}
          <div className="flex flex-wrap gap-2 mb-4 items-center">
            <input
              type="text"
              placeholder="Title"
              value={cateringTitle}
              onChange={(e) => setCateringTitle(e.target.value)}
              className="p-2 border rounded dark:bg-gray-700"
            />
            <input
              type="text"
              placeholder="Description"
              value={cateringDesc}
              onChange={(e) => setCateringDesc(e.target.value)}
              className="p-2 border rounded dark:bg-gray-700"
            />
            <input
              type="number"
              placeholder="Price"
              value={cateringPrice}
              onChange={(e) => setCateringPrice(e.target.value)}
              className="p-2 border rounded dark:bg-gray-700"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={cateringImage}
              onChange={(e) => setCateringImage(e.target.value)}
              className="p-2 border rounded dark:bg-gray-700"
            />
            <button
              type="button"
              onClick={handleAddCatering}
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Add Catering
            </button>
          </div>

          {/* Menu Items */}
          <h2 className="text-xl font-semibold">Menu Items</h2>
          {menus.map((menu, i) => (
            <div key={menu._id} className="flex gap-2 mb-2 items-center">
              <input
                type="text"
                value={menu.name}
                onChange={(e) => {
                  const newMenus = [...menus];
                  newMenus[i].name = e.target.value;
                  setMenus(newMenus);
                }}
                className="p-2 border rounded dark:bg-gray-700"
                placeholder="Name"
              />
              <select
                value={menu.category}
                onChange={(e) => {
                  const newMenus = [...menus];
                  newMenus[i].category = e.target.value;
                  setMenus(newMenus);
                }}
                className="p-2 border rounded dark:bg-gray-700"
              >
                <option value="">Category</option>
                <option value="starter">Starter</option>
                <option value="main">Main Course</option>
                <option value="dessert">Dessert</option>
                <option value="beverage">Beverage</option>
              </select>
              <input
                type="number"
                value={menu.price}
                onChange={(e) => {
                  const newMenus = [...menus];
                  newMenus[i].price = e.target.value;
                  setMenus(newMenus);
                }}
                className="p-2 border rounded dark:bg-gray-700"
                placeholder="Price"
              />
              <input
                type="text"
                value={menu.image}
                onChange={(e) => {
                  const newMenus = [...menus];
                  newMenus[i].image = e.target.value;
                  setMenus(newMenus);
                }}
                className="p-2 border rounded dark:bg-gray-700"
                placeholder="Image URL"
              />
              <button
                type="button"
                onClick={() => setMenus(menus.filter((_, idx) => idx !== i))}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))}

          {/* Add new Menu */}
          <div className="flex flex-wrap gap-2 mb-4 items-center">
            <input
              type="text"
              placeholder="Name"
              value={menuName}
              onChange={(e) => setMenuName(e.target.value)}
              className="p-2 border rounded dark:bg-gray-700"
            />
            <select
              value={menuCategory}
              onChange={(e) => setMenuCategory(e.target.value)}
              className="p-2 border rounded dark:bg-gray-700"
            >
              <option value="">Category</option>
              <option value="starter">Starter</option>
              <option value="main">Main Course</option>
              <option value="dessert">Dessert</option>
              <option value="beverage">Beverage</option>
            </select>
            <input
              type="number"
              placeholder="Price"
              value={menuPrice}
              onChange={(e) => setMenuPrice(e.target.value)}
              className="p-2 border rounded dark:bg-gray-700"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={menuImage}
              onChange={(e) => setMenuImage(e.target.value)}
              className="p-2 border rounded dark:bg-gray-700"
            />
            <button
              type="button"
              onClick={handleAddMenu}
              className="px-4 py-2 text-white bg-purple-600 rounded hover:bg-purple-700"
            >
              Add Menu Item
            </button>
          </div>

          <button
            type="submit"
            className="px-6 py-2 text-white bg-green-600 rounded hover:bg-green-700"
          >
            Submit Venue
          </button>
        </form>
      </div>
    </div>
  );
};

export default ServiceEdit;
