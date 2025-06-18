import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const html = document.documentElement;
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    navigate("/login");
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md py-4 px-8 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-white">
        EventPortal
      </Link>

      <div className="flex items-center gap-6">
        {/* Navigation Buttons */}
        <Link to="/" className="text-gray-700 dark:text-gray-200 hover:underline">
          Home
        </Link>

        {user && (
          <>
            <Link
              to={
                user.role === "customer"
                  ? "/customer-dashboard"
                  : "/business-dashboard"
              }
              className="text-gray-700 dark:text-gray-200 hover:underline"
            >
              Dashboard
            </Link>

            <Link
              to="/bookings"
              className="text-gray-700 dark:text-gray-200 hover:underline"
            >
              Bookings
            </Link>

            {/* Profile Icon */}
            <Link to="/profile" title="Profile">
              <span className="text-xl text-gray-700 dark:text-gray-200">👤</span>
            </Link>
          </>
        )}

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="bg-gray-200 dark:bg-gray-600 text-black dark:text-white px-3 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
          title="Toggle Light/Dark Mode"
        >
          {isDark ? "☀️" : "🌙"}
        </button>

        {/* Auth Buttons */}
        {user ? (
          <>
            <span className="text-gray-700 dark:text-gray-200 font-medium">
              Welcome, {user.name}
            </span>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-gray-700 dark:text-gray-200 hover:underline"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
  