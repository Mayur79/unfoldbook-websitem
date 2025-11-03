// src/Pages/CheckoutPage.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { totalPrice, cartDocs } = state;

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
        name: "MyDocs",
        order_id: res.data.orderId,
        handler: async function (response) {
          await api.post("/api/v1/pay/verify-payment", {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });

          toast.success("Payment Successful!");
          navigate("/"); // or wherever user can see purchased docs
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.log(error);
      alert("Payment failed!");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <p>Total: ₹{totalPrice.toFixed(2)}</p>
      <button
        onClick={handlePayment}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full"
      >
        Pay Now
      </button>
    </div>
  );
}
