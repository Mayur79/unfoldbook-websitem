import React from "react";
import { Monitor, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

const AdminMobileBlocked = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 text-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center space-y-6"
      >
        <motion.div
          initial={{ rotate: -10, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          <Monitor className="w-28 h-28 text-blue-600 drop-shadow-md" />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="absolute -top-3 -right-3 bg-white p-2 rounded-full shadow-md"
          >
            <AlertTriangle className="w-6 h-6 text-yellow-500" />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-2xl sm:text-3xl font-bold text-gray-800"
        >
          Admin Dashboard is Desktop Only
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-gray-600 text-sm sm:text-base max-w-sm"
        >
          Please switch to a <span className="font-semibold text-blue-600">laptop or desktop</span> to access the admin panel. 
          Mobile view is restricted for better management experience.
        </motion.p>

        <motion.a
          href="/home"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-full shadow-md hover:bg-blue-700 transition-all"
        >
          Go Back Home
        </motion.a>
      </motion.div>
    </div>
  );
};

export default AdminMobileBlocked;
