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

  return (
    <div className="p-10 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {userType === "admin" && <p>Welcome Admin, manage everything here!</p>}
      {userType === "business" && <p>Welcome Business Owner, manage your events!</p>}
      {userType === "customer" && <p>Welcome Customer, book your dream events!</p>}
    </div>
  );
}
