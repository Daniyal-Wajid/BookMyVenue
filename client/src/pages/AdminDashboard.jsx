import React, { useState, useEffect } from "react";
import api from "../services/api";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("bookings");
  const [bookings, setBookings] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [bookingsRes, usersRes, servicesRes] = await Promise.all([
          api.get("/booking/all"),
          api.get("/user/all"),
          api.get("/business/all-services"),
        ]);

        setBookings(bookingsRes.data || []);
        setServices(servicesRes.data || []);

        const businessUsers = usersRes.data.filter((u) => u.userType === "business");
        const customerUsers = usersRes.data.filter((u) => u.userType === "customer");

        setBusinesses(businessUsers);
        setCustomers(customerUsers);
      } catch (err) {
        console.error("Admin fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const exportToPDF = (data, headers, title) => {
    const doc = new jsPDF();
    doc.text(title, 14, 16);
    doc.autoTable({ head: [headers], body: data });
    doc.save(`${title}.pdf`);
  };

  const exportToExcel = (data, headers, title) => {
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, title);
    XLSX.writeFile(workbook, `${title}.xlsx`);
  };

  const tabs = [
    { key: "bookings", label: "Bookings" },
    { key: "businesses", label: "Business Users" },
    { key: "customers", label: "Customer Users" },
    { key: "services", label: "Services" },
  ];

  const renderTab = () => {
    if (loading) return <p className="text-center text-gray-500 mt-20">Loading...</p>;

    switch (activeTab) {
      case "bookings":
        return bookings.length > 0 ? (
          <DataTab
            title="Bookings"
            headers={["Customer", "Business", "Event Date", "Time"]}
            data={bookings.map((b) => [
              b.customerId?.name || "N/A",
              b.businessId?.name || "N/A",
              new Date(b.eventDate).toLocaleDateString(),
              `${b.startTime} - ${b.endTime}`,
            ])}
          />
        ) : (
          <p className="text-center text-gray-600">No bookings available.</p>
        );

      case "businesses":
        return businesses.length > 0 ? (
          <DataTab
            title="Business Users"
            headers={["Image", "Name", "Email", "Phone"]}
            data={businesses.map((u) => [
              u.image ? `http://localhost:5000${u.image}` : "https://via.placeholder.com/100",
              u.name,
              u.email,
              u.phoneNumber || "N/A",
            ])}
            isImage={true}
          />
        ) : (
          <p className="text-center text-gray-600">No business users found.</p>
        );

      case "customers":
        return customers.length > 0 ? (
          <DataTab
            title="Customer Users"
            headers={["Image", "Name", "Email", "Phone"]}
            data={customers.map((u) => [
              u.image ? `http://localhost:5000${u.image}` : "https://via.placeholder.com/100",
              u.name,
              u.email,
              u.phoneNumber || "N/A",
            ])}
            isImage={true}
          />
        ) : (
          <p className="text-center text-gray-600">No customer users found.</p>
        );

      case "services":
        return services.length > 0 ? (
          <DataTab
            title="Services"
            headers={["Image", "Title", "Description", "Price"]}
            data={services.map((s) => [
              s.image ? `http://localhost:5000${s.image}` : "https://via.placeholder.com/100",
              s.title,
              s.description,
              `Rs ${s.price}`,
            ])}
            isImage={true}
          />
        ) : (
          <p className="text-center text-gray-600">No services available.</p>
        );

      default:
        return null;
    }
  };

  const DataTab = ({ title, headers, data, isImage }) => (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => exportToPDF(data, headers, title)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Download PDF
        </button>
        <button
          onClick={() => exportToExcel(data, headers, title)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Download Excel
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-4 py-2 text-left">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-2">
                    {isImage && j === 0 ? (
                      <img src={cell} alt="" className="w-12 h-12 rounded object-cover" />
                    ) : (
                      cell
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="pt-28 px-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="pt-10 text-3xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">
        Admin Dashboard
      </h1>

      <div className="flex space-x-4 mb-8">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 rounded font-medium transition ${
              activeTab === key
                ? "bg-indigo-600 text-white shadow"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div>{renderTab()}</div>
    </div>
  );
};

export default AdminDashboard;
