import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const TermsModal = ({ isOpen, onClose }) => {
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    setAccepted(true);
    setTimeout(() => {
      onClose();
      setAccepted(false);
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
              <span className="text-2xl">⚖️</span>
              <h2 className="text-2xl font-semibold text-blue-700">
                Terms & Conditions
              </h2>
            </div>

            {/* Scrollable Content */}
            <div className="space-y-5 text-gray-700 text-[15px] leading-relaxed">
              <p>
                By purchasing any PDF or digital product from our platform, you
                agree to the following terms:
              </p>

              <ol className="list-decimal list-inside space-y-3">
                <li>
                  All books are for <strong>personal use only</strong>.
                  Redistribution, sharing, or resale is strictly prohibited.
                </li>

                <li>
                  Once purchased, the PDF link or file can be sent to your{" "}
                  <strong>registered email</strong> or{" "}
                  <strong>WhatsApp number</strong>.
                </li>

                <li>
                  We reserve the right to <strong>update the content or price</strong> of
                  any book without prior notice.
                </li>

                <li>
                  Any dispute will be subject to the jurisdiction of{" "}
                  <strong>[Your City], India</strong>.
                </li>
              </ol>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-gray-600">
                  Please read these terms carefully before making a purchase.
                  By proceeding, you confirm that you understand and agree to
                  these conditions.
                </p>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-4">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-md text-sm font-medium border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleAccept}
                className={`px-6 py-2.5 rounded-md text-sm font-semibold text-white transition ${
                  accepted
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {accepted ? "Accepted ✅" : "Accept & Close"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TermsModal;
