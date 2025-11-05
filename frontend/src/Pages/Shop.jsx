import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import pdfimage from "../assets/pdfimage.png";
import { Eye, Heart, Star, StarHalf } from "lucide-react";
import DocumentsCard from "../Component/DocumentsCart";

export default function Shop() {
  const [docs, setDocs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const { user, toggleWishlist, toggleCart } = useAuth();
  const navigate = useNavigate();

  // Fetch documents
  useEffect(() => {
    async function loadDocs() {
      const res = await api.get("/api/v1/doc");
      const docsWithRatings = res.data.map((doc) => ({
        ...doc,
        rating: (Math.random() * (5 - 4) + 4).toFixed(1),
        ratingCount: Math.floor(Math.random() * 200) + 20,
      }));
      setDocs(docsWithRatings);
    }
    loadDocs();
  }, []);

  const totalPages = Math.ceil(docs.length / itemsPerPage);
  const currentDocs = docs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="font-poppins min-h-screen bg-gray-50 pb-10">
      {/* Top bar */}
      <div className="flex justify-between items-center px-6 py-4 bg-white shadow-sm sticky top-0 z-20">
        <button className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition">
          <Filter size={20} />
          <span className="font-medium hidden sm:block">Filter</span>
        </button>
        <h2 className="text-xl sm:text-2xl font-semibold text-blue-600">
          Shop Documents
        </h2>
        <button
          onClick={() => navigate("/cart")}
          className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
        >
          <ShoppingCart size={22} />
          <span className="font-medium hidden sm:block">Cart</span>
        </button>
      </div>

      {/* Documents Grid */}
      <DocumentsCard
        docs={currentDocs}
        user={user}
        navigate={navigate}
        toggleWishlist={toggleWishlist}
        toggleCart={toggleCart}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-10 space-x-2 sm:space-x-3">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 sm:p-3 rounded-full border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow"
          >
            <ChevronLeft className="w-4 h-4 text-gray-700" />
          </button>
          <div className="flex items-center space-x-1 sm:space-x-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full font-medium text-sm flex items-center justify-center transition-all ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white shadow-md scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 sm:p-3 rounded-full border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow"
          >
            <ChevronRight className="w-4 h-4 text-gray-700" />
          </button>
        </div>
      )}
    </div>
  );
}
