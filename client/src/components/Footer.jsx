import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white text-center py-4 mt-10">
      <div className="max-w-7xl mx-auto">
        <p>© {new Date().getFullYear()} Eventify. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
