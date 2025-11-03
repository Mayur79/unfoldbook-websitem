import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import pdfimage from "../assets/pdfimage.png";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
        Your Cart
      </h1>

      {cartDocs.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">
          Your cart is empty 🛒
        </p>
      ) : (
        <>
          <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
            {cartDocs.map((doc) => (
              <div
                key={doc._id}
                className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={doc.thumbnailBase64 || pdfimage}
                    alt={doc.title}
                    className="w-16 h-16 object-contain rounded-md"
                  />
                  <div>
                    <h2 className="font-semibold text-gray-800">{doc.title}</h2>
                    <p className="text-sm text-gray-500">₹{doc.finalPrice}</p>
                  </div>
                </div>

                <button
                  className="p-2 hover:bg-red-100 rounded-full transition"
                  onClick={() => toggleCart(doc._id)}
                >
                  <Trash2 className="text-red-500" size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700">
              Total: <span className="text-blue-600">₹{totalPrice.toFixed(2)}</span>
            </h3>
            <button
              className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition"
              onClick={() => navigate("/checkout", { state: { totalPrice, cartDocs } })}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
