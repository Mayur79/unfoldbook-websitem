import React, { useState } from "react";
import { Home, Heart, ShoppingCart, User, Search, Store } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import SignupModal from "../Pages/SignupModal";
import LoginModal from "../Pages/Login";

const BottomNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Temporary hardcoded values (you can replace with context/localStorage later)
  const [cartItems, setCartItem] = useState(2);
  const [wishlistItems, setWishlistItems] = useState(2);

  // Modals
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const navItems = [
    { label: "Shop", icon: Store, path: "/" },
    { label: "Wishlist", icon: Heart, path: "/wishlist", count: wishlistItems },
    { label: "Cart", icon: ShoppingCart, path: "/cart", count: cartItems },
    {
      label: "Account",
      icon: User,
      action: () => setShowLoginModal(true), // 👈 Open modal on click
    },
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
        {navItems.map(({ label, icon: Icon, path, count, action }) => {
          const isActive = location.pathname === path;

          const handleClick = () => {
            if (action) action(); // if custom action (like Account)
            else if (path) navigate(path);
          };

          return (
            <button
              key={label}
              onClick={handleClick}
              className={`relative flex flex-col items-center text-xs text-black ${
                isActive ? "text-blue-600" : "text-gray-600"
              } hover:text-blue-500 transition`}
            >
              <Icon size={26} />
              {count > 0 && (
               <span
  className={`absolute -top-1 ${
    location.label === "Cart" ? "-right-1" : "-right-0.5"
  } bg-black text-white text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center`}
>
  {count}
</span>
              )}
              <span className="mt-1 text-black font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};

export default BottomNavBar;
