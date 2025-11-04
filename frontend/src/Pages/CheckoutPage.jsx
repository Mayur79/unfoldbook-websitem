import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { toast } from "sonner";
import { CreditCard } from "lucide-react";
import { motion } from "framer-motion";

export default function CheckoutPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { totalPrice, cartDocs } = state || {};

  const handlePayment = async () => {
    try {
      const res = await api.post("/api/v1/pay/create-order", {
        userId: user._id,
        amount: totalPrice,
        documentIds: cartDocs.map((d) => d._id),
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: res.data.amount,
        currency: "INR",
        name: "UnfoldBook",
        order_id: res.data.orderId,
        handler: async function (response) {
          await api.post("/api/v1/pay/verify-payment", {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });

          toast.success("Payment Successful!");
          navigate("/purchased"); // Redirect to purchased docs
        },
        theme: { color: "#2563eb" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.log(error);
      toast.error("Payment failed! Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto mt-10 bg-white shadow-lg rounded-2xl p-8 font-poppins"
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Checkout
      </h1>

      <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          Order Summary
        </h2>
        {cartDocs?.map((doc) => (
          <div
            key={doc._id}
            className="flex justify-between text-gray-600 mb-2"
          >
            <span>{doc.title}</span>
            <span className="font-medium text-blue-600">
              ₹{doc.finalPrice.toFixed(2)}
            </span>
          </div>
        ))}
        <hr className="my-3" />
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span className="text-blue-700">₹{totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={handlePayment}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 py-3 rounded-full text-base font-semibold shadow-md transition"
      >
        <CreditCard size={20} />
        Pay ₹{totalPrice.toFixed(2)}
      </button>

      <p className="text-sm text-gray-500 text-center mt-4">
        Secure payments powered by Razorpay 🔒
      </p>
    </motion.div>
  );
}
