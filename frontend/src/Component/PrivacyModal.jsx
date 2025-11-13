import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck } from "lucide-react";

const PrivacyModal = ({ isOpen, onClose }) => {
  const [acknowledged, setAcknowledged] = useState(false);

  const handleAcknowledge = () => {
    setAcknowledged(true);
    setTimeout(() => {
      onClose();
      setAcknowledged(false);
    }, 500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto relative p-6 border border-gray-200"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
            >
              <X size={22} />
            </button>

            {/* Title */}
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="text-blue-700" size={26} />
              <h2 className="text-2xl font-semibold text-blue-700">
                Privacy Policy
              </h2>
            </div>

            {/* Content */}
            <div className="space-y-5 text-gray-700 text-[15px] leading-relaxed">
              <p>
                We value your privacy. All personal details (name, email, phone number,
                and payment details) shared on our website or payment page are kept
                confidential and secure.
              </p>

              <h3 className="font-semibold text-lg text-blue-600 mt-4">
                How We Use Your Information
              </h3>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Order confirmation and delivery of digital books</li>
                <li>Customer support and updates about new releases</li>
              </ul>

              <p className="mt-3">
                We never share, sell, or rent your personal data to any third party.
              </p>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-gray-600">
                  Your payment details are processed securely through{" "}
                  <strong>Razorpay’s encrypted payment gateway</strong>, ensuring full
                  data protection and compliance with security standards.
                </p>
              </div>

              <p className="text-sm text-gray-500 mt-3">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>

            {/* Footer Buttons */}
            <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-4">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-md text-sm font-medium border border-gray-300 hover:bg-gray-100 transition"
              >
                Close
              </button>

              <button
                onClick={handleAcknowledge}
                className={`px-6 py-2.5 rounded-md text-sm font-semibold text-white transition ${
                  acknowledged
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {acknowledged ? "Understood ✅" : "I Understand"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PrivacyModal;
