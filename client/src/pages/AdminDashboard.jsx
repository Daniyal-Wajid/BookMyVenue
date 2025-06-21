import React, { useState, useEffect } from "react";
import api from "../services/api";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("bookings");

  const [bookings, setBookings] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
  const fetchAll = async () => {
    try {
      const [bookingsRes, usersRes, servicesRes] = await Promise.all([
        api.get("/booking/all"),
        api.get("/user/all"),
        api.get("/business/all-services"),
      ]);

      console.log("Bookings:", bookingsRes.data);
      console.log("Users:", usersRes.data);
      console.log("Services:", servicesRes.data);

      setBookings(bookingsRes.data || []);
      setServices(servicesRes.data || []);

      const businessUsers = usersRes.data.filter((u) => u.userType === "business");
      const customerUsers = usersRes.data.filter((u) => u.userType === "customer");

      setBusinesses(businessUsers);
      setCustomers(customerUsers);
    } catch (err) {
      console.error("Admin fetch error:", err);
    }
  };

  fetchAll();
}, []);


  const renderTab = () => {
    console.log("🔍 Active tab:", activeTab);

    switch (activeTab) {
      case "bookings":
        return bookings.length > 0
          ? <BookingTab bookings={bookings} />
          : <p className="text-center text-gray-600">No bookings available.</p>;

      case "businesses":
        return businesses.length > 0
          ? <UserTab users={businesses} title="Business Users" />
          : <p className="text-center text-gray-600">No business users found.</p>;

      case "customers":
        return customers.length > 0
          ? <UserTab users={customers} title="Customer Users" />
          : <p className="text-center text-gray-600">No customer users found.</p>;

      case "services":
        return services.length > 0
          ? <ServiceTab services={services} />
          : <p className="text-center text-gray-600">No services available.</p>;

      default:
        return null;
    }
  };

  return (
    <div className="pt-28 px-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">
        🛠️ Admin Dashboard
      </h1>

      <div className="flex space-x-4 mb-8">
        {["bookings", "businesses", "customers", "services"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded font-medium transition ${
              activeTab === tab
                ? "bg-indigo-600 text-white shadow"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div>{renderTab()}</div>
    </div>
  );
};

const BookingTab = ({ bookings }) => {
  console.log("Rendering bookings tab with data:", bookings);

  if (!bookings.length) return <p>No bookings found.</p>;

  return (
    <div className="space-y-4">
      {bookings.map((b) => (
        <div key={b._id} className="bg-white p-4 rounded shadow-md">
          <p>Booking ID: {b._id}</p>
        </div>
      ))}
    </div>
  );
};


const UserTab = ({ users, title }) => (
  <div>
    <h2 className="text-2xl font-semibold mb-4">{title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {users.map((u) => (
        <div
          key={u._id}
          className="bg-white dark:bg-gray-800 p-4 rounded shadow"
        >
          <p><strong>Name:</strong> {u.name}</p>
          <p><strong>Email:</strong> {u.email}</p>
          <p><strong>Phone:</strong> {u.phoneNumber || "N/A"}</p>
        </div>
      ))}
    </div>
  </div>
);

const ServiceTab = ({ services }) => (
  <div>
    <h2 className="text-2xl font-semibold mb-4">All Services</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map((s) => (
        <div
          key={s._id}
          className="bg-white dark:bg-gray-800 p-4 rounded shadow"
        >
          <img
            src={
              s.image
                ? `http://localhost:5000${s.image}`
                : "https://via.placeholder.com/300x200"
            }
            alt={s.title}
            className="w-full h-32 object-cover rounded mb-2"
          />
          <h3 className="font-bold">{s.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">{s.description}</p>
          <p><strong>Type:</strong> {s.type}</p>
          <p><strong>Price:</strong> Rs {s.price}</p>
        </div>
      ))}
    </div>
  </div>
);

export default AdminDashboard;
