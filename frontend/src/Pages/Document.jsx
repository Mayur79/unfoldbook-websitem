import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import pdfimage from "../assets/pdfimage.png";
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import LoginModal from '../Pages/Login';
import SignupModal from '../Pages/SignupModal';
import banner1 from "../assets/banner1.jpg";
import banner2 from "../assets/banner2.jpg";
import banner3 from "../assets/banner3.jpg";
import banner4 from "../assets/banner4.jpg";
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from "lucide-react"
export default function Documents() {
  const [docs, setDocs] = useState([]);
  const [purchased, setPurchased] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const { user } = useAuth();
  const banners = [banner1, banner2, banner3, banner4];

const [selectedCategory, setSelectedCategory] = useState("All");
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    loadDocs();
    if (user) loadPurchased();
  }, [user]);

  
  async function loadDocs() {
    const res = await api.get('/api/v1/doc');
    setDocs(res.data);
  }
const [categories, setCategories] = useState([]);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  async function loadPurchased() {
    try {
      const res = await api.get('/api/v1/pay/purchased');
      setPurchased(res.data);
    } catch (err) {
      console.error('Error loading purchased docs:', err);
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
    const { data } = await api.post('/api/v1/pay/order', { documentId: doc._id });
    const { order, key } = data;

    const options = {
      key,
      amount: order.amount,
      currency: 'INR',
      name: "Demo Store",
      description: doc.title,
      order_id: order.id,
      handler: async function (response) {
        await api.post('/api/v1/pay/verify', {
          documentId: doc._id,
          ...response
        });
        toast.success('Payment success!');
        setPurchased([...purchased, doc._id]);
      },
      prefill: { email: user?.email || '' },
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

const filteredDocs = selectedCategory === "All"
  ? docs
  : docs.filter((doc) => doc.category?._id === selectedCategory);

const totalPages = Math.ceil(filteredDocs.length / itemsPerPage);


const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentDocs = filteredDocs.slice(indexOfFirstItem, indexOfLastItem);

const selectedCategoryName =
  selectedCategory === "All"
    ? "All Document"
    : categories.find((cat) => cat._id === selectedCategory)?.categoryName || "Other";

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="font-poppins px-3 sm:px-8 py-6">
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
      <div className="relative w-full overflow-hidden rounded-xl mb-10">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.6 }}
        >
          <img
            src={banners[current]}
            alt={`Banner ${current + 1}`}
            className="w-full h-48 sm:h-64 md:h-96 object-cover rounded-xl shadow-md"
          />
        </motion.div>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${current === i ? 'bg-white' : 'bg-gray-400'}`}
            />
          ))}
        </div>
      </div>

      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#4f46e5] to-[#22c55e]">
          Buy - Download - Print
        </h2>
        <p className="text-[#64748b] mt-2 text-xs sm:text-sm">
          Anytime, Anywhere, <span className='font-bold'>Get 100% Success</span>. All the Best!
        </p>
      </div>


<div className="overflow-x-auto scrollbar-hide mb-8 flex justify-center">
  <div className="flex space-x-2 sm:space-x-3 px-2">
    <button
      onClick={() => setSelectedCategory("All")}
      className={`flex-shrink-0 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-sm font-medium border transition-all duration-300 shadow-sm
        ${
          selectedCategory === "All"
            ? "bg-gradient-to-r from-blue-600 to-green-500 text-white border-transparent shadow-md scale-105"
            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
        }`}
    >
      All
    </button>

    {categories.map((cat) => (
      <button
        key={cat._id}
        onClick={() => setSelectedCategory(cat._id)}
        className={`flex-shrink-0 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-sm font-medium border transition-all duration-300 
          ${
            selectedCategory === cat._id
              ? "bg-gradient-to-r from-blue-600 to-green-500 text-white border-transparent shadow-md scale-105"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
      >
        {cat.categoryName}
      </button>
    ))}
  </div>
</div>


  <h2 className="flex justify-center text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#4f46e5] to-[#22c55e]">
  {selectedCategoryName}
</h2>

      {/* Documents Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 justify-center mt-2">
        {currentDocs.map((doc) => (
          <div
            key={doc._id}
            className="group flex flex-col bg-white rounded-xl sm:rounded-2xl shadow-md border border-[#e2e8f0] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            <div className="relative h-36 sm:h-48 bg-[#f1f5f9]">
              <img
                src={doc.thumbnailBase64 || pdfimage}
                alt={doc.title}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-blue-600 text-white text-[10px] sm:text-xs font-semibold px-2 py-1 rounded-full shadow-md">
                ₹{doc.price}
              </span>
            </div>
            <div className="flex flex-col flex-grow p-3 sm:p-5">
              <h3 className="text-sm sm:text-lg font-semibold text-[#0f172a] mb-1 sm:mb-2 line-clamp-1">
                {doc.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#475569] mb-4 sm:mb-5 line-clamp-3">
                {doc.description ||
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
              </p>
              <div className="mt-auto">
                {purchased.includes(doc._id) ? (
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <button
                      onClick={() => view(doc)}
                      className="w-full text-xs sm:text-sm text-white bg-gradient-to-r from-cyan-500 to-blue-500 font-medium rounded-md sm:rounded-lg px-3 py-1.5 sm:px-5 sm:py-2"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => share(doc)}
                      className="w-full text-xs sm:text-sm text-white bg-gradient-to-br from-green-400 to-blue-600 font-medium rounded-md sm:rounded-lg px-3 py-1.5 sm:px-5 sm:py-2"
                    >
                      Share
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => buy(doc)}
                    className="w-full text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-[#22c55e] hover:from-[#4f46e5] hover:to-[#16a34a] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md sm:rounded-lg transition font-semibold"
                  >
                    Buy Now
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
     {/* Modern Pagination Controls */}
{totalPages > 1 && (
  <div className="flex justify-center items-center mt-10 space-x-2 sm:space-x-3">
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
                ? 'bg-gradient-to-r from-blue-600 to-green-500 text-white shadow-md scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
  <div className="relative w-full overflow-hidden rounded-xl mb-10 mt-10">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.6 }}
        >
          <img
            src={banners[current]}
            alt={`Banner ${current + 1}`}
            className="w-full h-48 sm:h-64 md:h-96 object-cover rounded-xl shadow-md"
          />
        </motion.div>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${current === i ? 'bg-white' : 'bg-gray-400'}`}
            />
          ))}
        </div>
      </div>

    </div>
  );
}
