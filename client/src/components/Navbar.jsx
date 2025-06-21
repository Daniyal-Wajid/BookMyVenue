import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isDark, setIsDark] = useState(false);

  const loadUser = () => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    loadUser();
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }

    const handleAuthChange = () => loadUser();
    window.addEventListener("authChange", handleAuthChange);
    return () => window.removeEventListener("authChange", handleAuthChange);
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
    localStorage.removeItem("role");
    window.dispatchEvent(new Event("authChange"));
    navigate("/login");
  };

  const handleDashboardClick = () => {
    if (!user) return;
    if (user.role === "admin") {
      navigate("/admin-dashboard");
    } else if (user.role === "business") {
      navigate("/business-dashboard");
    } else if (user.role === "customer") {
      navigate("/customer-dashboard");
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 md:px-12 py-3 flex justify-between items-center
      bg-gray-900/80 backdrop-blur-lg shadow-sm border-b border-gray-700 transition-all">

      {/* Logo & Branding */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
        <img
          src={logo}
          alt="logo"
          className="h-24 w-27 rounded-full object-cover"
        />
        <span
          className="text-2xl font-bold text-pink-300"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        ></span>
      </div>

      {/* Navigation & Actions */}
      <div className="flex items-center gap-5 text-base">
        <button
          onClick={() => navigate("/")}
          className="text-gray-200 hover:underline"
        >
          Home
        </button>

        {user && (
          <button
            onClick={handleDashboardClick}
            className="text-gray-200 hover:underline"
          >
            Dashboard
          </button>
        )}

        {user?.role === "business" && (
          <button
            onClick={() => navigate("/business/bookings")}
            className="text-gray-200 hover:underline"
          >
            Bookings
          </button>
        )}

        {!user ? (
          <>
            <button
              onClick={() => navigate("/login")}
              className="text-gray-200 hover:underline"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Register
            </button>
          </>
        ) : (
          <>
            <span className="text-sky-400 font-semibold hidden sm:inline">
              {user.name}
            </span>
            <button onClick={() => navigate("/profile")} title="Profile">
              <img
                src={
                  user?.image
                    ? `http://localhost:5000${user.image}`
                    : "https://i.pravatar.cc/40?img=47"
                }
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500"
              />
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>

            <button
              onClick={toggleDarkMode}
              className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-600"
              title="Toggle Light/Dark Mode"
            >
              {isDark ? "☀️" : "🌙"}
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
