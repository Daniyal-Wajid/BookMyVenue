import React, { useEffect, useState } from "react";
import api from "../services/api";

const VenueManagement = () => {
  const [user, setUser] = useState(null);
  const [occasionTypes, setOccasionTypes] = useState([]);

  // Venue
  const [venueName, setVenueName] = useState("");
  const [venueLocation, setVenueLocation] = useState("");
  const [venueDesc, setVenueDesc] = useState("");
  const [venueImageFile, setVenueImageFile] = useState(null);
  const [venuePrice, setVenuePrice] = useState("");

  // Services State
  const [decors, setDecors] = useState([]);
  const [caterings, setCaterings] = useState([]);
  const [menus, setMenus] = useState([]);

  const [decorInputs, setDecorInputs] = useState({ title: "", description: "", price: "", image: null });
  const [cateringInputs, setCateringInputs] = useState({ title: "", description: "", price: "", image: null });
  const [menuInputs, setMenuInputs] = useState({ name: "", price: "", category: "", image: null });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

 const handleAddService = (type) => {
  if (type === "decor") {
    const { title, description, price, image } = decorInputs;
    if (title && description && price && image) {
      setDecors([...decors, decorInputs]);
      setDecorInputs({ title: "", description: "", price: "", image: null });
    } else {
      alert("Please fill all fields for Decor before adding.");
    }
  } else if (type === "catering") {
    const { title, description, price, image } = cateringInputs;
    if (title && description && price && image) {
      setCaterings([...caterings, cateringInputs]);
      setCateringInputs({ title: "", description: "", price: "", image: null });
    } else {
      alert("Please fill all fields for Catering before adding.");
    }
  } else if (type === "menu") {
    const { name, price, category, image } = menuInputs;
    if (name && price && category && image) {
      setMenus([
      ...menus,
      {
        title: name, // ✅ Fix: add title
        description: "No description", // ✅ Fix: required in backend
        price,
        category,
        image,
      },
    ]);
      setMenuInputs({ name: "", price: "", category: "", image: null });
    } else {
      alert("Please fill all fields for Menu before adding.");
    }
  }
};


const handleSubmitVenue = async (e) => {
  e.preventDefault();

  try {
    // Step 1: Submit Venue
    const formData = new FormData();
    formData.append("title", venueName);
    formData.append("description", venueDesc);
    formData.append("price", parseFloat(venuePrice) || 0);
    formData.append("location", venueLocation);
    formData.append("type", "venue");
    formData.append("image", venueImageFile);
    occasionTypes.forEach((type) => formData.append("occasionTypes[]", type));

    const venueRes = await api.post("/business/add-service", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const venueId = venueRes.data.venueId;
    if (!venueId) {
      alert("Venue ID not received!");
      return;
    }

    // Step 2: Submit Related Services with venueId
    const servicesFormData = new FormData();
    servicesFormData.append("venueId", venueId); // ✅

    servicesFormData.append("decorItems", JSON.stringify(decors));
    servicesFormData.append("cateringItems", JSON.stringify(caterings));
    servicesFormData.append("menuItems", JSON.stringify(menus));

    decors.forEach((d, i) => {
      if (d.image) servicesFormData.append(`decorImage_${i}`, d.image);
    });

    caterings.forEach((c, i) => {
      if (c.image) servicesFormData.append(`cateringImage_${i}`, c.image);
    });

    menus.forEach((m, i) => {
      if (m.image) servicesFormData.append(`menuImage_${i}`, m.image);
    });

    await api.post("/business/add-multiple-services", servicesFormData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    alert("Venue and services submitted successfully!");
    setVenueName("");
    setVenueLocation("");
    setVenueDesc("");
    setVenueImageFile(null);
    setVenuePrice("");
    setOccasionTypes([]);
    setDecors([]);
    setCaterings([]);
    setMenus([]);
  } catch (err) {
    console.error("Error adding venue and services:", err.message);
    alert("Something went wrong. Check console.");
  }
};


  return (
    <div className="pt-28 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="p-6 mx-auto max-w-5xl space-y-8">
        <h1 className="text-3xl font-bold">Hi {user?.name}, Add Venue with Services</h1>

        <form onSubmit={handleSubmitVenue} className="space-y-6" encType="multipart/form-data">
          {/* Venue Info */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Venue Info</h2>
            <input className="w-full p-2 rounded bg-white dark:bg-gray-700" type="text" placeholder="Venue Name" value={venueName} onChange={(e) => setVenueName(e.target.value)} required />
            <input className="w-full p-2 rounded bg-white dark:bg-gray-700" type="text" placeholder="Location" value={venueLocation} onChange={(e) => setVenueLocation(e.target.value)} required />
            <input className="w-full p-2 rounded bg-white dark:bg-gray-700" type="number" placeholder="Venue Price" value={venuePrice} onChange={(e) => setVenuePrice(e.target.value)} />
            <textarea className="w-full p-2 rounded bg-white dark:bg-gray-700" placeholder="Description" value={venueDesc} onChange={(e) => setVenueDesc(e.target.value)} />
            <input className="w-full p-2 rounded bg-white dark:bg-gray-700" type="file" accept="image/*" onChange={(e) => setVenueImageFile(e.target.files[0])} required />
          </div>

          {/* Occasions */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Occasions</h2>
            <div className="flex flex-wrap gap-4">
              {["Wedding", "Birthday", "Corporate", "Engagement", "Anniversary"].map((type) => (
                <label key={type} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={type}
                    checked={occasionTypes.includes(type)}
                    onChange={(e) => {
                      const value = e.target.value;
                      setOccasionTypes((prev) =>
                        prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
                      );
                    }}
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          {/* Decor */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Decor Services</h2>
            <div className="flex flex-wrap gap-2">
              <input type="text" placeholder="Title" value={decorInputs.title} onChange={(e) => setDecorInputs({ ...decorInputs, title: e.target.value })} className="p-2 rounded bg-white dark:bg-gray-700" />
              <input type="text" placeholder="Description" value={decorInputs.description} onChange={(e) => setDecorInputs({ ...decorInputs, description: e.target.value })} className="p-2 rounded bg-white dark:bg-gray-700" />
              <input type="number" placeholder="Price" value={decorInputs.price} onChange={(e) => setDecorInputs({ ...decorInputs, price: e.target.value })} className="p-2 rounded bg-white dark:bg-gray-700" />
              <input type="file" accept="image/*" onChange={(e) => setDecorInputs({ ...decorInputs, image: e.target.files[0] })} className="p-2 rounded bg-white dark:bg-gray-700" />
              <button type="button" onClick={() => handleAddService("decor")} className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">Add</button>
            </div>
            <ul className="list-disc pl-5 text-sm">
              {decors.map((d, i) => (
                <li key={i}>{d.title} - Rs {d.price}</li>
              ))}
            </ul>
          </div>

          {/* Catering */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Catering Services</h2>
            <div className="flex flex-wrap gap-2">
              <input type="text" placeholder="Title" value={cateringInputs.title} onChange={(e) => setCateringInputs({ ...cateringInputs, title: e.target.value })} className="p-2 rounded bg-white dark:bg-gray-700" />
              <input type="text" placeholder="Description" value={cateringInputs.description} onChange={(e) => setCateringInputs({ ...cateringInputs, description: e.target.value })} className="p-2 rounded bg-white dark:bg-gray-700" />
              <input type="number" placeholder="Price" value={cateringInputs.price} onChange={(e) => setCateringInputs({ ...cateringInputs, price: e.target.value })} className="p-2 rounded bg-white dark:bg-gray-700" />
              <input type="file" accept="image/*" onChange={(e) => setCateringInputs({ ...cateringInputs, image: e.target.files[0] })} className="p-2 rounded bg-white dark:bg-gray-700" />
              <button type="button" onClick={() => handleAddService("catering")} className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">Add</button>
            </div>
            <ul className="list-disc pl-5 text-sm">
              {caterings.map((c, i) => (
                <li key={i}>{c.title} - Rs {c.price}</li>
              ))}
            </ul>
          </div>

          {/* Menu */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Menu Items</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <input type="text" placeholder="Name" value={menuInputs.name} onChange={(e) => setMenuInputs({ ...menuInputs, name: e.target.value })} className="p-2 rounded bg-white dark:bg-gray-700" />
              <input type="number" placeholder="Price" value={menuInputs.price} onChange={(e) => setMenuInputs({ ...menuInputs, price: e.target.value })} className="p-2 rounded bg-white dark:bg-gray-700" />
              <select value={menuInputs.category} onChange={(e) => setMenuInputs({ ...menuInputs, category: e.target.value })} className="p-2 rounded bg-white dark:bg-gray-700">
                <option value="">Category</option>
                <option value="starter">Starter</option>
                <option value="main">Main Course</option>
                <option value="dessert">Dessert</option>
                <option value="beverage">Beverage</option>
              </select>
              <input type="file" accept="image/*" onChange={(e) => setMenuInputs({ ...menuInputs, image: e.target.files[0] })} className="p-2 rounded bg-white dark:bg-gray-700" />
            </div>
            <button type="button" onClick={() => handleAddService("menu")} className="mt-2 px-4 py-2 text-white bg-purple-600 rounded hover:bg-purple-700">Add Menu</button>
            <ul className="list-disc pl-5 text-sm">
              {menus.map((m, i) => (
                <li key={i}>{m.name} ({m.category}) - Rs {m.price}</li>
              ))}
            </ul>
          </div>

          <button type="submit" className="px-6 py-2 text-white bg-green-600 rounded hover:bg-green-700">
            Submit Venue
          </button>
        </form>
      </div>
    </div>
  );
};

export default VenueManagement;
