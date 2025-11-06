import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import pdfimage from "../assets/pdfimage.png";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import LoginModal from "../Pages/Login";
import SignupModal from "../Pages/SignupModal";
import banner1 from "../assets/banner1.jpg";
import banner2 from "../assets/banner2.jpg";
import banner3 from "../assets/banner3.jpg";
import banner4 from "../assets/banner4.jpg";
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
import StarRating from "../Component/StarRating";
import CategorySelection from "../Component/CategorySelection";

export default function Documents() {
  const [docs, setDocs] = useState([]);
  const [purchased, setPurchased] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const { user, toggleWishlist, toggleCart } = useAuth();
  // Generate random rating between 3.5 and 5.0 (1 decimal)
  const getRandomRating = () => (Math.random() * (5 - 4) + 4).toFixed(1);
  const getRandomCount = () => Math.floor(Math.random() * 200) + 20; // between 20–220
  const banners = [banner1];

  const [selectedCategory, setSelectedCategory] = useState("All");
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [topBanners, setTopBanners] = useState([]);
  const [bottomBanners, setBottomBanners] = useState([]);
  const [currentTop, setCurrentTop] = useState(0);
  const [currentBottom, setCurrentBottom] = useState(0);


  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await api.get("/api/v1/banner/getimages");
        // Separate by banner type
        const banner1Images = res.data.filter((img) => img.bannerType === "banner1");
        const banner2Images = res.data.filter((img) => img.bannerType === "banner2");

        setTopBanners(banner1Images);
        setBottomBanners(banner2Images);
      } catch (err) {
        console.error("Error fetching banners:", err);
      }
    };
    fetchBanners();
  }, []);
   useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTop((prev) => (topBanners.length > 0 ? (prev + 1) % topBanners.length : 0));
    }, 3000);
    return () => clearInterval(interval);
  }, [topBanners]);

  // Auto-rotate bottom banners
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBottom((prev) => (bottomBanners.length > 0 ? (prev + 1) % bottomBanners.length : 0));
    }, 3000);
    return () => clearInterval(interval);
  }, [bottomBanners]);


  useEffect(() => {
    loadDocs();
    if (user) loadPurchased();
  }, [user]);

  async function loadDocs() {
    const res = await api.get("/api/v1/doc");
    const docsWithRatings = res.data.map((doc) => ({
      ...doc,
      rating: getRandomRating(),
      ratingCount: getRandomCount(),
    }));
    setDocs(docsWithRatings);
  }

  const [categories, setCategories] = useState([]);

  async function loadPurchased() {
    try {
      const res = await api.get("/api/v1/pay/purchased");
      setPurchased(res.data);
    } catch (err) {
      console.error("Error loading purchased docs:", err);
    }
  }
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await api.get("/api/v1/doc/categories/list");
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    }
    fetchCategories();
  }, []);

  async function buy(doc) {
    if (!user) {
      toast.success("You must log in to buy this document.");
      setShowLoginModal(true);
      return;
    }
    const { data } = await api.post("/api/v1/pay/order", {
      documentId: doc._id,
    });
    const { order, key } = data;

    const options = {
      key,
      amount: order.amount,
      currency: "INR",
      name: "Demo Store",
      description: doc.title,
      order_id: order.id,
      handler: async function (response) {
        await api.post("/api/v1/pay/verify", {
          documentId: doc._id,
          ...response,
        });
        toast.success("Payment success!");
        setPurchased([...purchased, doc._id]);
      },
      prefill: { email: user?.email || "" },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  }

  async function view(doc) {
    navigate(`/viewer/${doc._id}`);
  }

  async function share(doc) {
    try {
      const res = await api.get(`/api/v1/doc/${doc._id}/share`);
      const shareUrl = res.data.shareUrl;

      if (navigator.share) {
        await navigator.share({
          title: doc.title,
          text: `Check out this document: ${doc.title}`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Share link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error generating share link:", err);
    }
  }

  async function download(doc) {
    try {
      const res = await api.get(`/api/v1/doc/${doc._id}/view`, {
        responseType: "blob",
      });
      const blob = new Blob([res.data], {
        type: res.headers["content-type"],
      });
      const fileURL = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = doc.title || "document";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(fileURL);
    } catch (err) {
      console.error("Error downloading document:", err);
      toast.error("Failed to download document");
    }
  }

  const filteredDocs =
    selectedCategory === "All"
      ? docs
      : docs.filter((doc) => doc.category?._id === selectedCategory);

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

  const ratingOptions = [
    { rating: 4.8, count: 95 },
    { rating: 4.6, count: 72 },
    { rating: 4.9, count: 134 },
    { rating: 4.7, count: 88 },
    { rating: 5.0, count: 150 },
  ];

  const [ratingData, setRatingData] = useState({ rating: 0, count: 0 });

  useEffect(() => {
    // Pick one rating randomly from hardcoded list
    const random =
      ratingOptions[Math.floor(Math.random() * ratingOptions.length)];
    setRatingData(random);
  }, []);

  const filledStars = Math.floor(ratingData.rating);
  const halfStar = ratingData.rating - filledStars >= 0.5;

  return (
    <div className="font-poppins ">
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

      {/* Banner carousel */}
      <div className="relative w-full overflow-hidden mb-10">
         {topBanners.length > 0 && (
        <div className="relative w-full overflow-hidden mb-10">
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
             className="w-full shadow-md h-60 md:h-128 object-fill"
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

      </div>

      <div className="text-center mb-5 sm:mb-12">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-blue-600">
          Buy - Download - Print
        </h2>
        <p className="text-[#64748b] mt-2 ">
          Anytime, Anywhere, <span className="font-bold">Get 100% Success</span>
          .
        </p>
      </div>

    <CategorySelection
  categories={categories}
  selectedCategory={selectedCategory}
  setSelectedCategory={setSelectedCategory}
  selectedCategoryName={selectedCategoryName}
/>


      {/* Documents Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6 lg:gap-8 justify-center mt-2 mx-4 md:mx-20 mb-4">
        {currentDocs.map((doc) => (
          <div
            key={doc._id}
            onClick={() =>
              navigate(`/doc/${doc._id}`, {
                state: { rating: doc.rating, ratingCount: doc.ratingCount },
              })
            }
            className="group relative bg-white  overflow-hidden transition-all duration-300"
          >
            {/* Top Section (Image + Discount Badge) */}
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

            {/* Middle Section (Icons) */}
            <div className="flex justify-center gap-3 border-b border-gray-100 ">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  view(doc);
                }}
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

            {/* Bottom Section (Title + Prices + Rating) */}
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
                    return (
                      <Star
                        key={i}
                        fill="#FDBC00"
                        stroke="#FDBC00"
                        height={18}
                      />
                    );
                  if (i === Math.floor(doc.rating) && doc.rating % 1 >= 0.5)
                    return (
                      <StarHalf
                        key={i}
                        fill="#FDBC00"
                        stroke="#FDBC00"
                        height={18}
                      />
                    );
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

      {/* Pagination Controls */}
      {/* Modern Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-10 space-x-2 sm:space-x-3 mb-4">
          {/* Prev Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 sm:p-3 rounded-full border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow"
          >
            <ChevronLeft className="w-4 h-4 text-gray-700" />
          </button>

          {/* Page Buttons */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full font-medium text-sm flex items-center justify-center transition-all
            ${
              currentPage === i + 1
                ? "bg-blue-600 text-white shadow-md scale-105"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 sm:p-3 rounded-full border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow"
          >
            <ChevronRight className="w-4 h-4 text-gray-700" />
          </button>
        </div>
      )}
     <div className="relative w-full overflow-hidden mb-10">
        {bottomBanners.length > 0 && (
        <div className="relative w-full overflow-hidden mt-10">
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

    </div>
  );
}
