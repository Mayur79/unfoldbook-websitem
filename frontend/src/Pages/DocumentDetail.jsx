import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import api from "../services/api";
import pdfimage from "../assets/pdfimage.png";
import { Heart, Star, StarHalf } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function DocDetail() {
  const { id } = useParams();
  const location = useLocation();
  const [doc, setDoc] = useState(null);
  const { user, toggleWishlist, toggleCart } = useAuth();

  const passedRating = location.state?.rating;
  const passedCount = location.state?.ratingCount;

  useEffect(() => {
    async function fetchDoc() {
      const res = await api.get(`/api/v1/doc/${id}`);
      setDoc(res.data);
    }
    fetchDoc();
  }, [id]);

  if (!doc) return <p className="text-center mt-20">Loading...</p>;

  const rating = passedRating || doc.rating || 4.8;
  const ratingCount = passedCount || doc.ratingCount || 120;

  return (
    <div className="md:max-w-6xl sm:mx-auto mt-6 sm:mt-10 p-4 sm:p-6 bg-white rounded-xl shadow-lg font-poppins">
      <div className="flex flex-col sm:flex-row sm:gap-10 md:items-center sm:items-start">
        {/* Thumbnail */}
        <div className="relative sm:w-1/2">
          <img
            src={doc.thumbnailBase64 || pdfimage}
            alt={doc.title}
            className="w-full h-64 sm:h-[420px] object-contain rounded-md mb-4 sm:mb-0 sm:hover:scale-105 transition-transform duration-300"
          />
          {doc.discountPercent && (
            <span className="absolute top-3 right-3 bg-orange-500 text-white text-sm sm:text-base font-semibold px-3 py-1 rounded-full shadow-md">
              -{doc.discountPercent}%
            </span>
          )}
        </div>

        {/* Details */}
        <div className="sm:w-1/2 sm:mt-0 mt-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            {doc.title}
          </h1>

          {/* ⭐ Rating */}
          <div className="flex items-center mt-1 mb-3 gap-[2px]">
            {Array.from({ length: 5 }).map((_, i) => {
              if (i < Math.floor(rating))
                return <Star key={i} fill="#FDBC00" stroke="#FDBC00" height={18} />;
              if (i === Math.floor(rating) && rating % 1 >= 0.5)
                return <StarHalf key={i} fill="#FDBC00" stroke="#FDBC00" height={18} />;
              return <Star key={i} stroke="#FDBC00" height={18} />;
            })}
            <span className="ml-2 text-sm text-gray-700">
              ({ratingCount} reviews)
            </span>
          </div>

          {/* 💰 Price + Wishlist */}
          <div className="flex items-center space-x-3 mt-3">
            <div>
              <span className="text-gray-400 line-through text-sm mr-1">
                ₹{doc.price}
              </span>
              <span className="text-red-600 font-semibold text-xl">
                ₹{doc.finalPrice}
              </span>
            </div>

            {/* Wishlist button */}
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition"
              aria-label="Add to Wishlist"
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(doc._id);
              }}
            >
              <Heart
                size={18}
                fill={user?.wishlist?.includes(doc._id) ? "#ff4d6d" : "none"}
                stroke="#ff4d6d"
              />
            </button>
          </div>

          {/* 🛒 Cart Button */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-5">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full text-sm sm:text-base shadow-md transition"
              onClick={(e) => {
                e.stopPropagation();
                toggleCart(doc._id);
              }}
            >
              {user?.cart?.includes(doc._id)
                ? "Remove from Cart"
                : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
