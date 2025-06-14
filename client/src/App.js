import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CustomerDashboard from "./pages/UserDashboard";
import BusinessDashboard from "./pages/BusinessDashboard";
import ServiceDetails from "./pages/ServiceDetails";
import ServiceEdit from "./pages/ServiceEdit";
import ServiceDetail from "./pages/ServiceDetail";
import Layout from "./components/Layout";
import VenueManagement from "./pages/VenueManagement";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customer-dashboard" element={<CustomerDashboard />} />
          <Route path="/business-dashboard" element={<BusinessDashboard />} />
          <Route path="/business/service/:id" element={<ServiceDetails />} />
          <Route path="/business/service/:id/edit" element={<ServiceEdit />} />
          <Route path="/business/manage-venue" element={<VenueManagement />} />
          <Route path="/service/:id" element={<ServiceDetail />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
