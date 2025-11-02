import React, { useState } from "react";
import {
  Home,
  Heart,
  ShoppingCart,
  User,
  Search,
  Store,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import SignupModal from "../Pages/SignupModal";
import LoginModal from "../Pages/Login";
import { useAuth } from "../context/AuthContext";

const BottomNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // Temporary hardcoded values (can replace with context/localStorage later)
  const [cartItems, setCartItems] = useState(2);
  const [wishlistItems, setWishlistItems] = useState(2);

  // Modals
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navItems = [
    { label: "Shop", icon: Store, path: "/" },
    { label: "Wishlist", icon: Heart, path: "/wishlist", count: wishlistItems },
    { label: "Cart", icon: ShoppingCart, path: "/cart", count: cartItems },
    { label: "Search", icon: Search, path: "/search" },
  ];

  return (
    <>
      {/* Login & Signup Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onOpenSignup={() => {
          setShowLoginModal(false);
          setIsSignupOpen(true);
        }}
      />
      <SignupModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        onOpenLogin={() => {
          setIsSignupOpen(false);
          setShowLoginModal(true);
        }}
      />

      {/* Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md flex justify-around items-center py-2 z-50 font-poppins">
        {navItems.map(({ label, icon: Icon, path, count }) => {
          const isActive = location.pathname === path;

          return (
            <button
              key={label}
              onClick={() => navigate(path)}
              className={`relative flex flex-col items-center text-xs ${
                isActive ? "text-emerald-600" : "text-gray-600"
              } hover:text-emerald-600 transition`}
            >
              <Icon size={26} />
              {count > 0 && (
                <span
                  className={`absolute -top-1 -right-1 bg-black text-white text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center`}
                >
                  {count}
                </span>
              )}
              <span className="mt-1 font-medium">{label}</span>
            </button>
          );
        })}

        {/* Account Section */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex flex-col items-center text-xs text-gray-600 hover:text-emerald-600 transition"
            >
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-600 text-white font-semibold">
                {user?.name?.charAt(0).toUpperCase() ||
                  user?.email?.charAt(0).toUpperCase() ||
                  "U"}
              </div>
              <span className="mt-1 font-medium">You</span>
            </button>

            {isUserMenuOpen && (
              <div className="absolute bottom-12 right-0 w-40 rounded-lg bg-white shadow-lg border border-gray-100 overflow-hidden z-50">
                <div className="px-3 py-2 border-b border-gray-100 text-center">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.name || "User"}
                  </p>
                </div>
                <ul className="py-1 text-sm text-gray-700">
                  {user?.role === "admin" && (
                    <li>
                      <button
                        onClick={() => navigate("/admin")}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                      >
                        Admin Dashboard
                      </button>
                    </li>
                  )}
                  <li>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-50"
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
            className="flex flex-col items-center text-xs text-gray-600 hover:text-emerald-600 transition"
          >
            <User size={26} />
            <span className="mt-1 font-medium">Account</span>
          </button>
        )}
      </div>
    </>
  );
};

export default BottomNavBar;
