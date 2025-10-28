import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Menu, X } from "lucide-react";
import LoginModal from "../Pages/Login";
import { toast } from "sonner";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
const [showLoginModal, setShowLoginModal] = useState(false);
  return (
    <>
   <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm font-poppins">
       
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8"
            alt="DocBuy Logo"
          />
          <span className="text-xl font-semibold text-gray-800">UnfoldBook</span>
        </a>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 text-sm font-medium">
          {["Home", "About", "Services", "Pricing", "Contact"].map((item) => (
            <li key={item}>
              <a
                href="#"
                className="text-gray-700 hover:text-emerald-600 transition-colors duration-200"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>

        {/* User + Mobile Menu Button */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
              >
                {user?.name?.charAt(0).toUpperCase() ||
                  user?.email?.charAt(0).toUpperCase() ||
                  "U"}
              </button>

              {/* Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-3 w-48 rounded-lg bg-white shadow-lg border border-gray-100 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email}
                    </p>
                  </div>
                  <ul className="py-1 text-sm text-gray-700">
                    <li>
                      <a
                        href="/dashboard"
                        className="block px-4 py-2 hover:bg-gray-50"
                      >
                        Dashboard
                      </a>
                    </li>
                    <li>
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50"
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
             onClick={()=>{
                 if (!user) {
    toast.success("You must log in to buy this document."); 
    setShowLoginModal(true);
    return;
  }
             }}
              className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition"
            >
              Login
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 transition"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white shadow-sm">
          <ul className="flex flex-col p-4 space-y-2">
            {["Home", "About", "Services", "Pricing", "Contact"].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="block py-2 px-3 rounded-md text-gray-700 hover:bg-gray-100 hover:text-emerald-600 transition"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
    </>
  );
};

export default Navbar;
