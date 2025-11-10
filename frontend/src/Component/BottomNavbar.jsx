import React, { useState } from "react";
import { Heart, ShoppingCart, User, Search, Store, Home } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import SignupModal from "../Pages/SignupModal";
import LoginModal from "../Pages/Login";
import { useAuth } from "../context/AuthContext";

const BottomNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navItems = [
    { label: "Shop", icon: Store, path: "/shop" },
    { label: "Wishlist", icon: Heart, path: "/wishlist", count: user?.wishlist?.length || 0 },
     { label: "Home", icon: Home, path: "/home" },
    { label: "Cart", icon: ShoppingCart, path: "/cart", count: user?.cart?.length || 0 },
   
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
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 font-poppins">
        <div className="bg-white border-t border-blue-100 shadow-[0_-2px_8px_rgba(0,0,0,0.08)] flex justify-around items-center py-2 ">
          {navItems.map(({ label, icon: Icon, path, count }) => {
            const isActive = location.pathname === path;
const handleClick = () => {
    // If not logged in and the nav is Wishlist or Cart → show login modal
    if (!user && (label === "Wishlist" || label === "Cart")) {
      setShowLoginModal(true);
      return;
    }

    navigate(path);
  };

            return (
              <button
                key={label}
                onClick={handleClick}
                className={`relative flex flex-col items-center text-[11px] transition-all duration-300 ${
                  isActive
                    ? "text-blue-600 scale-110"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                <div
                  className={`p-1 rounded-full ${
                    isActive ? "bg-blue-50" : "hover:bg-blue-50"
                  } transition-all duration-300`}
                >
                  <Icon size={22} />
                </div>

                {typeof count === "number" && count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
                    {count}
                  </span>
                )}
                <span className="mt-0.5 font-medium tracking-tight">
                  {label}
                </span>
              </button>
            );
          })}

          {/* Account Section */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex flex-col items-center text-[11px] text-gray-600 hover:text-blue-600 transition-all duration-300"
              >
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 font-semibold">
                  {user?.name?.charAt(0).toUpperCase() ||
                    user?.email?.charAt(0).toUpperCase() ||
                    "U"}
                </div>
                <span className="mt-0.5 font-medium">You</span>
              </button>

              {isUserMenuOpen && (
                <div className="absolute bottom-12 right-0 w-44 rounded-xl bg-white shadow-lg border border-blue-100 overflow-hidden z-50">
                  <div className="px-3 py-2 border-b border-blue-100 text-center bg-blue-50">
                    <p className="text-sm font-semibold text-blue-700 truncate">
                      {user?.name || "User"}
                    </p>
                  </div>
                  <ul className="py-1 text-sm text-gray-700">
                    {user?.role === "admin" && (
                      <li>
                        <button
                          onClick={() => navigate("/admin")}
                          className="block w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-800"
                        >
                          Admin Dashboard
                        </button>
                      </li>
                    )}

                      <li>
                        <button
                          onClick={() => navigate("/my-document")}
                          className="block w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-800"
                        >
                          My Document
                        </button>
                      </li>
                   
                    <li>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-800"
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
              className="flex flex-col items-center text-[11px] text-gray-600 hover:text-blue-600 transition-all duration-300"
            >
              <div className="p-1 rounded-full hover:bg-blue-50">
                <User size={22} />
              </div>
              <span className="mt-0.5 font-medium">Account</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default BottomNavBar;
