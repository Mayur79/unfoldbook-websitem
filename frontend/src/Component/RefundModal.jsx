import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const RefundModal = ({ isOpen, onClose }) => {
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
              <span className="text-2xl">💸</span>
              <h2 className="text-2xl font-semibold text-blue-700">
                Refund & Cancellation Policy
              </h2>
            </div>

            {/* Content */}
            <div className="space-y-5 text-gray-700 text-[15px] leading-relaxed">
              <section>
                <h3 className="font-semibold text-lg text-blue-600 mb-2">
                  Refund Policy
                </h3>
                <p>
                  Since our products are digital in nature (PDF books and downloadable study
                  materials), <strong>we do not offer refunds</strong> once the file has been
                  successfully delivered or downloaded.
                </p>

                <p className="mt-3">
                  However, if you face any technical issue such as:
                </p>

                <ul className="list-disc list-inside space-y-2 mt-2">
                  <li>Wrong file delivered</li>
                  <li>Corrupted or unreadable file</li>
                  <li>Duplicate payment</li>
                </ul>

                <p className="mt-3">
                  You can contact us within <strong>48 hours</strong> at{" "}
                  <strong>support@vishantbooks.in</strong>, and we will resolve the issue or
                  provide a replacement.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-lg text-blue-600 mt-5 mb-2">
                  Cancellation Policy
                </h3>
                <p>
                  Once the payment is completed and access to the PDF material has been granted,
                  the order <strong>cannot be cancelled</strong>.
                </p>
              </section>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 mt-5">
                <p className="text-sm text-gray-600">
                  Please ensure you review your order carefully before making payment.
                </p>
              </div>
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

export default RefundModal;
