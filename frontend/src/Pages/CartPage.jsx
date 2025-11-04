import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import pdfimage from "../assets/pdfimage.png";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const { user, toggleCart } = useAuth();
  const [cartDocs, setCartDocs] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCart() {
      if (!user?._id) return;
      const res = await api.get(`/api/users/getUserCart`);
      setCartDocs(res.data.cart);

      const total = res.data.cart.reduce(
        (sum, doc) => sum + (doc.finalPrice || 0),
        0
      );
      setTotalPrice(total);
    }

    fetchCart();
  }, [user]);

  if (!user)
    return (
      <p className="text-center mt-20 text-gray-600">
        Please login to view your cart.
      </p>
    );

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8 font-poppins">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        🛍️ Your Cart
      </h1>

      {cartDocs.length === 0 ? (
        <p className="text-gray-500 text-center mt-20 text-lg">
          Your cart is empty 🛒
        </p>
      ) : (
        <>
          <div className="bg-white shadow-xl rounded-2xl p-6 divide-y divide-gray-100">
            <AnimatePresence>
              {cartDocs.map((doc) => (
                <motion.div
                  key={doc._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={doc.thumbnailBase64 || pdfimage}
                      alt={doc.title}
                      className="w-20 h-20 object-contain "
                    />
                    <div>
                      <h2 className="font-semibold text-lg text-gray-800">
                        {doc.title}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Price:{" "}
                        <span className="text-blue-600 font-medium">
                          ₹{doc.finalPrice}
                        </span>
                      </p>
                    </div>
                  </div>

                  <button
                    className="p-2 hover:bg-red-100 rounded-full transition self-end sm:self-auto"
                    onClick={() => toggleCart(doc._id)}
                    title="Remove from cart"
                  >
                    <Trash2 className="text-red-500" size={20} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary Section */}
          <div className="mt-8 bg-gray-50 border border-gray-100 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700">
              Total:{" "}
              <span className="text-blue-600">
                ₹{totalPrice.toFixed(2)}
              </span>
            </h3>
            <button
              onClick={() =>
                navigate("/checkout", { state: { totalPrice, cartDocs } })
              }
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-sm font-semibold tracking-wide transition-all shadow-md hover:shadow-lg"
            >
              Proceed to Checkout →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
