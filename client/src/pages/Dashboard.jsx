import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const type = localStorage.getItem("userType");

    if (!token) return navigate("/login");
    setUserType(type);
  }, [navigate]);

  const getGreeting = () => {
    switch (userType) {
      case "admin":
        return {
          title: "Welcome Admin!",
          desc: "Manage users, services, and platform settings here.",
          icon: "🛠️",
          bg: "bg-red-100 dark:bg-red-900",
        };
      case "business":
        return {
          title: "Hello Business Owner!",
          desc: "Manage your services, bookings, and profile.",
          icon: "📊",
          bg: "bg-yellow-100 dark:bg-yellow-900",
        };
      case "customer":
        return {
          title: "Welcome!",
          desc: "Browse and book the best venues and services.",
          icon: "🎉",
          bg: "bg-indigo-100 dark:bg-indigo-900",
        };
      default:
        return {
          title: "Dashboard",
          desc: "Welcome to your personalized dashboard.",
          icon: "👋",
          bg: "bg-gray-100 dark:bg-gray-800",
        };
    }
  };

  const greeting = getGreeting();

  return (
    <div className={`min-h-screen py-20 px-6 md:px-12 ${greeting.bg} text-gray-900 dark:text-white transition-all`}>
      <div className="max-w-3xl mx-auto text-center bg-white dark:bg-gray-900 rounded-xl shadow-lg p-10 border border-gray-200 dark:border-gray-700">
        <div className="text-5xl mb-4">{greeting.icon}</div>
        <h1 className="text-3xl font-bold mb-3 text-indigo-700 dark:text-pink-300">
          {greeting.title}
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">{greeting.desc}</p>
      </div>
    </div>
  );
}
