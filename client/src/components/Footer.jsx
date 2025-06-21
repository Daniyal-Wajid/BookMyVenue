import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 pt-10 pb-6 border-t border-black">
      <div className="max-w-7xl mx-auto px-6">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold text-white mb-2">BookMyVenue</h3>
            <p className="text-sm text-gray-400">
              Your trusted platform to book venues, plan decor, and manage events effortlessly. We make your special moments unforgettable.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-2">Quick Links</h4>
            <ul className="space-y-1 text-sm">
              <li>
                <a href="/" className="hover:text-indigo-400 transition">
                  Home
                </a>
              </li>
              <li>
                <a href="/login" className="hover:text-indigo-400 transition">
                  Login
                </a>
              </li>
              <li>
                <a href="/register" className="hover:text-indigo-400 transition">
                  Register
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-2">Contact</h4>
            <p className="text-sm text-gray-400">📧 support@bookmyvenue.com</p>
            <p className="text-sm text-gray-400">📞 +92 309 1840367</p>
            <p className="text-sm text-gray-400">📍 Lahore, Pakistan</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()}{" "}
          <span className="text-indigo-400 font-medium">BookMyVenue</span>. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
