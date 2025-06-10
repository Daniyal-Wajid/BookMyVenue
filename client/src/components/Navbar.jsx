import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md py-4 px-8 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        EventPortal
      </Link>

      <div className="flex items-center gap-6">
        {user ? (
          <>
            <span className="text-gray-700 font-medium">
              Welcome, {user.name}
            </span>

            {user.role === "customer" && (
              <Link
                to="/customer-dashboard"
                className="text-blue-600 hover:underline"
              >
                Customer Dashboard
              </Link>
            )}

            {user.role === "business" && (
              <Link
                to="/business-dashboard"
                className="text-blue-600 hover:underline"
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
            <Link to="/login" className="text-gray-700 hover:underline">
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
