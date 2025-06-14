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
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="bg-gray-200 dark:bg-gray-600 text-black dark:text-white px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
        >
          {isDark ? "☀️ Light" : "🌙 Dark"}
        </button>

        {user ? (
          <>
            <span className="text-gray-700 dark:text-gray-200 font-medium">
              Welcome, {user.name}
            </span>

            {user.role === "customer" && (
              <Link
                to="/customer-dashboard"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Customer Dashboard
              </Link>
            )}

            {user.role === "business" && (
              <Link
                to="/business-dashboard"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Business Dashboard
              </Link>
            )}

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
