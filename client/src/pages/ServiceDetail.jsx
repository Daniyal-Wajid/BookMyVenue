import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);


  const [venue, setVenue] = useState(null);
  const [decorItems, setDecorItems] = useState([]);
  const [cateringItems, setCateringItems] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  const [selectedDecor, setSelectedDecor] = useState([]);
  const [selectedCatering, setSelectedCatering] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState([]);

  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [existingBookings, setExistingBookings] = useState([]);

  const [bookingMsg, setBookingMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  const fetchDetails = async () => {
    try {
      const res = await api.get(`/business/service/${id}`);
      setVenue(res.data.venue);
      setDecorItems(res.data.decorItems);
      setCateringItems(res.data.cateringItems);
      setMenuItems(res.data.menuItems);

      const bookings = await api.get(`/booking/bookings-by-venue/${id}`);
      setExistingBookings(bookings.data || []);
    } catch (err) {
      console.error(err);
      setError("Could not load service details.");
    } finally {
      setLoading(false);
    }
  };

  fetchDetails();

  // Load user from localStorage
  const savedUser = localStorage.getItem("user");
  if (savedUser) {
    setUser(JSON.parse(savedUser));
  }
}, [id]);

  const isOverlapping = (date, start, end) => {
    return existingBookings.some((b) => {
      if (b.eventDate !== date) return false;
      return !(end <= b.startTime || start >= b.endTime);
    });
  };

  const getItemPrice = (items, selectedIds) =>
    items
      .filter((item) => selectedIds.includes(item._id))
      .reduce((sum, item) => sum + (item.price || 0), 0);

  const calculateTotal = () => {
    return (
      (venue?.price || 0) +
      getItemPrice(decorItems, selectedDecor) +
      getItemPrice(cateringItems, selectedCatering) +
      getItemPrice(menuItems, selectedMenu)
    );
  };

  const handleBooking = async () => {
    if (!eventDate || !startTime || !endTime) {
      return alert("Please select event date, start time and end time.");
    }

    if (startTime >= endTime) {
      return alert("Start time must be before end time.");
    }

    if (isOverlapping(eventDate, startTime, endTime)) {
      return alert("This time slot is already booked. Please choose another.");
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      await api.post(
        "/booking/book",
        {
          venueId: venue._id,
          businessId: venue.userId,
          decorIds: selectedDecor,
          cateringIds: selectedCatering,
          menuIds: selectedMenu,
          eventDate,
          startTime,
          endTime,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setBookingMsg("Booking successful!");
    } catch (err) {
      console.error(err);
      alert("Booking failed.");
    }
  };

  if (loading)
    return <div className="p-6 text-center text-gray-500">Loading...</div>;
  if (error)
    return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="pt-28 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
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
            src={
              venue.image
                ? `http://localhost:5000${venue.image}`
                : "https://via.placeholder.com/800x400"
            }
            alt={venue.title}
            className="w-full h-72 object-cover"
          />
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-2">{venue.title}</h1>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{venue.description}</p>
            <p><strong>Location:</strong> {venue.location}</p>
            <p><strong>Price:</strong> Rs {venue.price}</p>
            <p><strong>Occasions:</strong> {venue.occasionTypes?.join(", ") || "N/A"}</p>
          </div>
        </div>

       {/* Booking Form - Only for non-business users */}
{user?.role !== "business" && (
  <div className="mb-10 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
    <h2 className="text-2xl font-semibold mb-4 text-indigo-600 dark:text-indigo-400">
      🗓️ Book This Service
    </h2>

    <div className="mb-4">
      <label className="block mb-1 font-medium">Event Date</label>
      <input
        type="date"
        className="w-full p-2 rounded bg-gray-50 dark:bg-gray-700"
        value={eventDate}
        onChange={(e) => setEventDate(e.target.value)}
      />
    </div>

    <div className="mb-4">
      <label className="block mb-1 font-medium">Start Time</label>
      <input
        type="time"
        className="w-full p-2 rounded bg-gray-50 dark:bg-gray-700"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
      />
    </div>

    <div className="mb-4">
      <label className="block mb-1 font-medium">End Time</label>
      <input
        type="time"
        className="w-full p-2 rounded bg-gray-50 dark:bg-gray-700"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
      />
    </div>

    <div className="text-xl font-semibold my-4">
      💰 Total Estimated Cost: Rs {calculateTotal()}
    </div>

    <button
      onClick={handleBooking}
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
    >
      Confirm Booking
    </button>

    {bookingMsg && (
      <p className="mt-4 text-sm text-green-600 dark:text-green-400">{bookingMsg}</p>
    )}
  </div>
)}


        {/* Service Lists */}
        <SelectableServiceList
          title="🎀 Décor Services"
          services={decorItems}
          selected={selectedDecor}
          setSelected={setSelectedDecor}
        />
        <SelectableServiceList
          title="🍽️ Catering Services"
          services={cateringItems}
          selected={selectedCatering}
          setSelected={setSelectedCatering}
        />
        <SelectableServiceList
          title="🧾 Menu"
          services={menuItems}
          selected={selectedMenu}
          setSelected={setSelectedMenu}
        />
      </div>
    </div>
  );
};

const SelectableServiceList = ({ title, services, selected, setSelected }) => {
  if (!services || services.length === 0) return null;

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-semibold mb-4 text-indigo-600 dark:text-indigo-400">
        {title}
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        {services.map((item) => (
          <div
            key={item._id}
            className={`bg-white dark:bg-gray-800 p-4 rounded-xl shadow cursor-pointer border-2 ${
              selected.includes(item._id)
                ? "border-green-500"
                : "border-transparent"
            }`}
            onClick={() =>
              setSelected((prev) =>
                prev.includes(item._id)
                  ? prev.filter((id) => id !== item._id)
                  : [...prev, item._id]
              )
            }
          >
            <h3 className="text-lg font-bold">{item.title || item.name}</h3>
            <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Price: Rs {item.price}
            </p>
            {item.image && (
              <img
                src={`http://localhost:5000${item.image}`}
                alt={item.title || item.name}
                className="mt-2 w-full h-40 object-cover rounded"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceDetail;
