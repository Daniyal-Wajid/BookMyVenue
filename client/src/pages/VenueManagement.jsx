import React, { useEffect, useState } from "react";
import api from "../services/api";

const VenueManagement = () => {
  const [user, setUser] = useState(null);
  const [occasionTypes, setOccasionTypes] = useState([]);

  // Venue
  const [venueName, setVenueName] = useState("");
  const [venueLocation, setVenueLocation] = useState("");
  const [venueDesc, setVenueDesc] = useState("");
  const [venueImage, setVenueImage] = useState("");
  const [venuePrice, setVenuePrice] = useState("");

  // Décor
  const [decorTitle, setDecorTitle] = useState("");
  const [decorDesc, setDecorDesc] = useState("");
  const [decorImage, setDecorImage] = useState("");
  const [decorPrice, setDecorPrice] = useState("");
  const [decors, setDecors] = useState([]);

  // Catering
  const [cateringTitle, setCateringTitle] = useState("");
  const [cateringDesc, setCateringDesc] = useState("");
  const [cateringImage, setCateringImage] = useState("");
  const [cateringPrice, setCateringPrice] = useState("");
  const [caterings, setCaterings] = useState([]);

  // Menus
  const [menuName, setMenuName] = useState("");
  const [menuPrice, setMenuPrice] = useState("");
  const [menuCategory, setMenuCategory] = useState("");
  const [menuImage, setMenuImage] = useState("");
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleAddDecor = () => {
    if (decorTitle && decorDesc) {
      setDecors([
        ...decors,
        {
          title: decorTitle,
          description: decorDesc,
          image: decorImage,
          price: decorPrice,
        },
      ]);
      setDecorTitle("");
      setDecorDesc("");
      setDecorImage("");
      setDecorPrice("");
    }
  };

  const handleAddCatering = () => {
    if (cateringTitle && cateringDesc) {
      setCaterings([
        ...caterings,
        {
          title: cateringTitle,
          description: cateringDesc,
          image: cateringImage,
          price: cateringPrice,
        },
      ]);
      setCateringTitle("");
      setCateringDesc("");
      setCateringImage("");
      setCateringPrice("");
    }
  };

  const handleAddMenu = () => {
    if (menuName && menuPrice && menuCategory) {
      setMenus([
        ...menus,
        {
          name: menuName,
          price: menuPrice,
          category: menuCategory,
          image: menuImage,
        },
      ]);
      setMenuName("");
      setMenuPrice("");
      setMenuCategory("");
      setMenuImage("");
    }
  };

  const handleSubmitVenue = async (e) => {
    e.preventDefault();

    try {
      await api.post("/business/add-service", {
        title: venueName,
        description: venueDesc,
        image: venueImage,
        type: "venue",
        price: parseFloat(venuePrice) || 0,
        location: venueLocation,
        occasionTypes,
      });

      await api.post("/business/add-multiple-services", {
        decorItems: decors.map((d) => ({
          ...d,
          price: parseFloat(d.price) || 0,
          location: venueLocation,
        })),
        cateringItems: caterings.map((c) => ({
          ...c,
          price: parseFloat(c.price) || 0,
          location: venueLocation,
        })),
        menuItems: menus.map((m) => ({
          title: m.name,
          description: `${m.category} – Rs ${m.price}`,
          image: m.image,
          price: parseFloat(m.price) || 0,
          location: venueLocation,
        })),
      });

      alert("Venue and services submitted successfully!");

      // Reset fields
      setVenueName("");
      setVenueLocation("");
      setVenueDesc("");
      setVenueImage("");
      setVenuePrice("");
      setOccasionTypes([]);
      setDecors([]);
      setCaterings([]);
      setMenus([]);
    } catch (err) {
      console.error("Error adding venue and services:", err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="p-6 mx-auto max-w-5xl space-y-10">
        <h1 className="text-3xl font-bold">
          Hi {user?.username}, Add Venue with Services
        </h1>

        <form onSubmit={handleSubmitVenue} className="p-6 space-y-6 bg-white dark:bg-gray-800 rounded shadow">
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

          <h2 className="text-xl font-semibold">Occasions</h2>
          <div className="flex flex-wrap gap-4 mb-4">
            {["Wedding", "Birthday", "Corporate", "Engagement", "Anniversary"].map((type) => (
              <label key={type} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={type}
                  checked={occasionTypes.includes(type)}
                  onChange={(e) => {
                    const value = e.target.value;
                    setOccasionTypes((prev) =>
                      prev.includes(value)
                        ? prev.filter((item) => item !== value)
                        : [...prev, value]
                    );
                  }}
                />
                {type}
              </label>
            ))}
          </div>

          {/* Decor */}
          <h2 className="text-xl font-semibold">Décor Services</h2>
          <div className="flex flex-wrap gap-2 mb-2">
            <input type="text" placeholder="Title" value={decorTitle} onChange={(e) => setDecorTitle(e.target.value)} className="p-2 border rounded dark:bg-gray-700" />
            <input type="text" placeholder="Description" value={decorDesc} onChange={(e) => setDecorDesc(e.target.value)} className="p-2 border rounded dark:bg-gray-700" />
            <input type="text" placeholder="Image URL" value={decorImage} onChange={(e) => setDecorImage(e.target.value)} className="p-2 border rounded dark:bg-gray-700" />
            <input type="number" placeholder="Price" value={decorPrice} onChange={(e) => setDecorPrice(e.target.value)} className="p-2 border rounded dark:bg-gray-700" />
            <button type="button" onClick={handleAddDecor} className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">Add</button>
          </div>
          <ul className="pl-5 list-disc text-sm text-gray-600 dark:text-gray-300">
            {decors.map((d, i) => (
              <li key={i}>{d.title} – {d.description} – Rs {d.price} {d.image && `(img: ${d.image})`}</li>
            ))}
          </ul>

          {/* Catering */}
          <h2 className="text-xl font-semibold">Catering Services</h2>
          <div className="flex flex-wrap gap-2 mb-2">
            <input type="text" placeholder="Title" value={cateringTitle} onChange={(e) => setCateringTitle(e.target.value)} className="p-2 border rounded dark:bg-gray-700" />
            <input type="text" placeholder="Description" value={cateringDesc} onChange={(e) => setCateringDesc(e.target.value)} className="p-2 border rounded dark:bg-gray-700" />
            <input type="text" placeholder="Image URL" value={cateringImage} onChange={(e) => setCateringImage(e.target.value)} className="p-2 border rounded dark:bg-gray-700" />
            <input type="number" placeholder="Price" value={cateringPrice} onChange={(e) => setCateringPrice(e.target.value)} className="p-2 border rounded dark:bg-gray-700" />
            <button type="button" onClick={handleAddCatering} className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">Add</button>
          </div>
          <ul className="pl-5 list-disc text-sm text-gray-600 dark:text-gray-300">
            {caterings.map((c, i) => (
              <li key={i}>{c.title} – {c.description} – Rs {c.price} {c.image && `(img: ${c.image})`}</li>
            ))}
          </ul>

          {/* Menu */}
          <h2 className="text-xl font-semibold">Menu Items</h2>
          <div className="grid grid-cols-1 gap-2 mb-2 md:grid-cols-4">
            <input type="text" placeholder="Name" value={menuName} onChange={(e) => setMenuName(e.target.value)} className="p-2 border rounded dark:bg-gray-700" />
            <input type="number" placeholder="Price" value={menuPrice} onChange={(e) => setMenuPrice(e.target.value)} className="p-2 border rounded dark:bg-gray-700" />
            <select value={menuCategory} onChange={(e) => setMenuCategory(e.target.value)} className="p-2 border rounded dark:bg-gray-700">
              <option value="">Category</option>
              <option value="starter">Starter</option>
              <option value="main">Main Course</option>
              <option value="dessert">Dessert</option>
              <option value="beverage">Beverage</option>
            </select>
            <input type="text" placeholder="Image URL" value={menuImage} onChange={(e) => setMenuImage(e.target.value)} className="p-2 border rounded dark:bg-gray-700" />
          </div>
          <button type="button" onClick={handleAddMenu} className="mb-2 px-4 py-2 text-white bg-purple-600 rounded hover:bg-purple-700">Add Menu Item</button>
          <ul className="pl-5 list-disc text-sm text-gray-600 dark:text-gray-300">
            {menus.map((m, i) => (
              <li key={i}>{m.name} – {m.category} – Rs {m.price} {m.image && `(img: ${m.image})`}</li>
            ))}
          </ul>

          <button type="submit" className="px-6 py-2 text-white bg-green-600 rounded hover:bg-green-700">
            Submit Venue
          </button>
        </form>
      </div>
    </div>
  );
};

export default VenueManagement;
