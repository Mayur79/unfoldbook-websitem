import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import pdfimage from "../assets/pdfimage.png";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import LoginModal from "../Pages/Login";
import SignupModal from "../Pages/SignupModal";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  ShoppingCart,
  Star,
  StarHalf,
} from "lucide-react";
import CategorySelection from "../Component/CategorySelection";
import MobileSearchBar from "../Component/MobileSearchBar";

export default function Documents() {
  const [docs, setDocs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [purchased, setPurchased] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const navigate = useNavigate();
  const { user, toggleWishlist, toggleCart } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [topBanners, setTopBanners] = useState([]);
  const [bottomBanners, setBottomBanners] = useState([]);
  const [currentTop, setCurrentTop] = useState(0);
  const [currentBottom, setCurrentBottom] = useState(0);

  const [loading, setLoading] = useState(true); // ✅ single loader

  // Helpers
  const getRandomRating = () => (Math.random() * (5 - 4) + 4).toFixed(1);
  const getRandomCount = () => Math.floor(Math.random() * 200) + 20;

   const handleSearch = (query) => {
    setSearchQuery(query.toLowerCase());
    setCurrentPage(1);
  };
  // Fetch Data
  useEffect(() => {
    async function fetchAll() {
      try {
        const [bannerRes, docsRes, catRes] = await Promise.all([
          api.get("/api/v1/banner/getimages"),
          api.get("/api/v1/doc"),
          api.get("/api/v1/doc/categories/list"),
        ]);

        // Banners
        const banner1Images = bannerRes.data.filter((img) => img.bannerType === "banner1");
        const banner2Images = bannerRes.data.filter((img) => img.bannerType === "banner2");
        setTopBanners(banner1Images);
        setBottomBanners(banner2Images);

        // Docs
        const docsWithRatings = docsRes.data.map((doc) => ({
          ...doc,
          rating: getRandomRating(),
          ratingCount: getRandomCount(),
        }));
        setDocs(docsWithRatings);

        // Categories
        setCategories(catRes.data);

        // Purchased (if logged in)
        if (user) {
          const purchasedRes = await api.get("/api/v1/pay/purchased");
          setPurchased(purchasedRes.data);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false); // ✅ stop loader when all done
      }
    }

    fetchAll();
  }, [user]);

  // Auto-rotate banners
  useEffect(() => {
    const topInterval = setInterval(() => {
      setCurrentTop((prev) => (topBanners.length > 0 ? (prev + 1) % topBanners.length : 0));
    }, 3000);
    return () => clearInterval(topInterval);
  }, [topBanners]);

  useEffect(() => {
    const bottomInterval = setInterval(() => {
      setCurrentBottom((prev) =>
        bottomBanners.length > 0 ? (prev + 1) % bottomBanners.length : 0
      );
    }, 3000);
    return () => clearInterval(bottomInterval);
  }, [bottomBanners]);

  // Derived Data
const filteredDocs = docs.filter((doc) => {
  const title = doc.title?.toLowerCase() || "";
  const desc = doc.description?.toLowerCase() || "";
  const query = searchQuery.toLowerCase();

  const matchesCategory =
    selectedCategory === "All" || doc.category?._id === selectedCategory;

  const matchesSearch =
    !query || title.includes(query) || desc.includes(query);

  return matchesCategory && matchesSearch;
});

  const totalPages = Math.ceil(filteredDocs.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDocs = filteredDocs.slice(indexOfFirstItem, indexOfLastItem);

  const selectedCategoryName =
    selectedCategory === "All"
      ? "All Document"
      : categories.find((cat) => cat._id === selectedCategory)?.categoryName ||
        "Other";

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ GLOBAL LOADER
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="font-poppins">
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onOpenSignup={() => setIsSignupOpen(true)}
      />
      <SignupModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        onOpenLogin={() => setShowLoginModal(true)}
      />

 <MobileSearchBar onSearch={handleSearch} placeholder="Search documents..." />
      {/* Top Banner Carousel */}
      {topBanners.length > 0 && (
        <div className="relative w-full overflow-hidden mb-5">
          <motion.div
            key={currentTop}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={topBanners[currentTop].url}
              alt={`Top Banner ${currentTop + 1}`}
              className="w-full shadow-md h-48 md:h-128 object-fill"
            />
          </motion.div>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {topBanners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentTop(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  currentTop === i ? "bg-white" : "bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Section Title */}
      <div className="text-center mb-2 sm:mb-12">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-blue-600">
          Buy - Download - Print
        </h2>
        <p className="text-[#64748b] mt-2">
          Anytime, Anywhere, <span className="font-bold">Get 100% Success</span>.
        </p>
      </div>

      <CategorySelection
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedCategoryName={selectedCategoryName}
      />

      {/* Documents Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6 lg:gap-8 justify-center mx-4 md:mx-20 mb-4">
        {currentDocs.map((doc) => (
          <div
            key={doc._id}
            onClick={() =>
              navigate(`/doc/${doc._id}`, {
                state: { rating: doc.rating, ratingCount: doc.ratingCount },
              })
            }
            className="group relative bg-white overflow-hidden transition-all duration-300"
          >
            <div className="relative w-full h-48 flex items-center justify-center overflow-hidden">
              <img
                src={doc.thumbnailBase64 || pdfimage}
                alt={doc.title}
                className="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
              {doc.discountPercent > 0 && (
                <div className="absolute top-2 right-2 bg-[#1206f1] text-white text-xs font-bold px-2 py-1 rounded-sm">
                  -{doc.discountPercent}%
                </div>
              )}
            </div>

            <div className="flex justify-center gap-3 border-b border-gray-100">
              <button
               onClick={() =>
              navigate(`/doc/${doc._id}`, {
                state: { rating: doc.rating, ratingCount: doc.ratingCount },
              })
            }
                className="w-9 h-9 flex items-center justify-center bg-gray-100 hover:bg-blue-100 rounded-full text-gray-600 hover:text-blue-600 transition"
              >
                <Eye size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCart(doc._id);
                }}
                className="w-9 h-9 flex items-center justify-center bg-gray-100 hover:bg-green-100 rounded-full text-gray-600 hover:text-green-600 transition"
              >
                <ShoppingCart
                  size={16}
                  fill={user?.cart?.includes(doc._id) ? "#16a34a" : "none"}
                  stroke="#16a34a"
                />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(doc._id);
                }}
                className="w-9 h-9 flex items-center justify-center bg-gray-100 hover:bg-pink-100 rounded-full text-gray-600 hover:text-pink-600 transition"
              >
                <Heart
                  size={16}
                  fill={user?.wishlist?.includes(doc._id) ? "#ff4d6d" : "none"}
                  stroke="#ff4d6d"
                />
              </button>
            </div>

            <div className="px-4 py-3 bg-blue-100 mt-2 rounded-md">
              <h3 className="text-sm sm:text-base font-medium text-[#312427] leading-tight line-clamp-2 mb-1">
                {doc.title}
              </h3>
              <div className="flex flex-col md:flex-row items-baseline md:gap-2 md:mb-1 mt-2">
                <p className="text-[#696969] text-sm line-through">
                  ₹{Number(doc.price).toLocaleString()}
                </p>
                <p className="text-[#1206f1] font-medium text-base">
                  ₹{Number(doc.finalPrice).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center text-yellow-400 mt-1">
                {Array.from({ length: 5 }).map((_, i) => {
                  if (i < Math.floor(doc.rating))
                    return <Star key={i} fill="#FDBC00" stroke="#FDBC00" height={18} />;
                  if (i === Math.floor(doc.rating) && doc.rating % 1 >= 0.5)
                    return <StarHalf key={i} fill="#FDBC00" stroke="#FDBC00" height={18} />;
                  return <Star key={i} stroke="#FDBC00" height={18} />;
                })}
                <span className="ml-1 text-sm text-black font-medium">
                  ({doc.ratingCount})
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-10 space-x-2 sm:space-x-3 mb-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 sm:p-3 rounded-full border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow"
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
            className="p-2 sm:p-3 rounded-full border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow"
          >
            <ChevronRight className="w-4 h-4 text-gray-700" />
          </button>
        </div>
      )}

      {/* Bottom Banner Carousel */}
      {bottomBanners.length > 0 && (
        <div className="relative w-full overflow-hidden mt-10 mb-1">
          <motion.div
            key={currentBottom}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={bottomBanners[currentBottom].url}
              alt={`Bottom Banner ${currentBottom + 1}`}
              className="w-full object-cover shadow-md"
            />
          </motion.div>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {bottomBanners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentBottom(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  currentBottom === i ? "bg-white" : "bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
