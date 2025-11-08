import React, { useEffect, useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import DocumentsCard from "../Component/DocumentsCart";
import BottomNavBar from "../Component/BottomNavbar";
import Navbar from "../Component/Navbar";
import MobileSearchBar from "../Component/MobileSearchBar"; // ✅ reusable search bar

export default function Shop() {
  const [docs, setDocs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const { user, toggleWishlist, toggleCart } = useAuth();
  const [loading, setLoading] = useState(true);

  // ✅ Fetch all documents
  useEffect(() => {
    async function loadDocs() {
      try {
        const res = await api.get("/api/v1/doc");
        const docsWithRatings = res.data.map((doc) => ({
          ...doc,
          rating: (Math.random() * (5 - 4) + 4).toFixed(1),
          ratingCount: Math.floor(Math.random() * 200) + 20,
        }));
        setDocs(docsWithRatings);
      } catch (err) {
        toast.error("Failed to load documents");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDocs();
  }, []);

  // ✅ Filter logic (search + case-insensitive)
  const filteredDocs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return docs;
    return docs.filter(
      (doc) =>
        doc.title?.toLowerCase().includes(q) ||
        doc.category?.categoryName?.toLowerCase().includes(q)
    );
  }, [docs, searchQuery]);

  // ✅ Pagination
  const totalPages = Math.ceil(filteredDocs.length / itemsPerPage);
  const currentDocs = filteredDocs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // reset pagination on new search
  };

  // ✅ Loader
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="font-poppins min-h-screen bg-gray-50 pb-20">
      {/* ✅ Navbar */}
      <div className="sticky top-0 z-40">
        <Navbar />

        {/* ✅ Mobile Search Bar */}
        <div className="block md:hidden sticky top-[64px] z-30 bg-white">
          <MobileSearchBar onSearch={handleSearch} placeholder="Search documents..." />
        </div>
      </div>

      {/* ✅ Desktop Search Bar */}
      <div className="hidden md:flex justify-center mt-6 mb-4">
        <div className="w-1/2">
          <MobileSearchBar onSearch={handleSearch} placeholder="Search documents..." />
        </div>
      </div>

      {/* ✅ Heading */}
      <div className="text-center mt-4 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-blue-600">
          All Documents
        </h2>
        <p className="text-gray-600 mt-1">
          Browse, search, and buy documents easily.
        </p>
      </div>

      {/* ✅ Documents Grid */}
      <DocumentsCard
        docs={currentDocs}
        user={user}
        toggleWishlist={toggleWishlist}
        toggleCart={toggleCart}
      />

      {/* ✅ Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-10 space-x-2 sm:space-x-3 mb-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 sm:p-3 rounded-full border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <ChevronLeft className="w-4 h-4 text-gray-700" />
          </button>

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

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 sm:p-3 rounded-full border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <ChevronRight className="w-4 h-4 text-gray-700" />
          </button>
        </div>
      )}

      {/* ✅ Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
}
