import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Menu, X, Search, ShoppingCart } from "lucide-react";
import LoginModal from "../Pages/Login";
import SignupModal from "../Pages/SignupModal";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {/* Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onOpenSignup={() => setIsSignupOpen(true)}
      />
      <SignupModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        onOpenLogin={() => setShowLoginModal(true)}
      />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-lg border-b border-blue-100 shadow-sm font-poppins transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="h-8" />
          </a>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-8 text-sm font-medium">
            <li>
              <a
                href="/"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
              >
                Services
              </a>
            </li>
            {user && (
              <li>
                <a
                  href="/my-document"
                  className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
                >
                  My Document
                </a>
              </li>
            )}
          </ul>

          {/* Icons & User Menu */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <button
              onClick={() => console.log("Search clicked")}
              className="p-2 rounded-full hover:bg-blue-50 transition"
              aria-label="Search"
            >
              <Search size={20} className="text-gray-600" />
            </button>

            {/* Cart */}
            <button
              onClick={() => navigate("/cart")}
              className="relative p-2 rounded-full hover:bg-blue-50 transition"
              aria-label="Cart"
            >
              <ShoppingCart size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                {user?.cart?.length || 0}
              </span>
            </button>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="hidden md:flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-sm hover:shadow-md transition-all duration-300"
                >
                  {user?.name?.charAt(0).toUpperCase() ||
                    user?.email?.charAt(0).toUpperCase() ||
                    "U"}
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-52 rounded-xl bg-white shadow-lg border border-blue-100 overflow-hidden animate-fadeIn">
                    <div className="px-4 py-3 border-b border-blue-50">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email}
                      </p>
                    </div>
                    <ul className="py-1 text-sm text-gray-700">
                      {user?.role === "admin" && (
                        <li>
                          <a
                            href="/admin"
                            className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition"
                          >
                            Admin Dashboard
                          </a>
                        </li>
                      )}
                      <li>
                        <button
                          onClick={logout}
                          className="w-full text-left px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition"
                        >
                          Sign out
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition hidden md:block"
              >
                Login
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:bg-blue-50 transition"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-blue-100 bg-white shadow-sm animate-slideDown">
            <ul className="flex flex-col p-4 space-y-2">
              {!user && (
                <li>
                  <button
                    onClick={() => {
                      setShowLoginModal(true);
                      setIsMenuOpen(false);
                    }}
                    className="block py-2 px-3 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                  >
                    Login
                  </button>
                </li>
              )}
              <li>
                <a
                  href="/"
                  className="block py-2 px-3 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 px-3 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 px-3 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  Services
                </a>
              </li>
              {user && (
                <li>
                  <a
                    href="/my-document"
                    className="block py-2 px-3 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                  >
                    My Document
                  </a>
                </li>
              )}
            </ul>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
