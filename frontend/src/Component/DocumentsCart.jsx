import React from "react";
import { Eye, Heart, ShoppingCart, Star, StarHalf } from "lucide-react";
import pdfimage from "../assets/pdfimage.png";

export default function DocumentsCard({
  docs,
  user,
  navigate,
  toggleWishlist,
  toggleCart,
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 justify-center mt-6 mx-4 md:mx-20">
      {docs.map((doc) => (
        <div
          key={doc._id}
          onClick={() =>
            navigate(`/doc/${doc._id}`, {
              state: { rating: doc.rating, ratingCount: doc.ratingCount },
            })
          }
          className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1"
        >
          <div className="relative w-full h-48 flex items-center justify-center overflow-hidden">
            <img
              src={doc.thumbnailBase64 || pdfimage}
              alt={doc.title}
              className="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            {doc.discountPercent > 0 && (
              <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                -{doc.discountPercent}%
              </div>
            )}
          </div>

          {/* Icons */}
          <div className="flex justify-center gap-3 border-b border-gray-100 py-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/viewer/${doc._id}`);
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

          {/* Details */}
          <div className="px-4 py-3 bg-blue-50 rounded-b-lg">
            <h3 className="text-sm sm:text-base font-medium text-gray-800 line-clamp-2">
              {doc.title}
            </h3>
            <div className="flex flex-col md:flex-row items-baseline md:gap-2 mt-2">
              <p className="text-gray-500 text-sm line-through">
                ₹{Number(doc.price).toLocaleString()}
              </p>
              <p className="text-blue-600 font-semibold text-base">
                ₹{Number(doc.finalPrice).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center text-yellow-400 mt-1">
              {Array.from({ length: 5 }).map((_, i) => {
                if (i < Math.floor(doc.rating))
                  return <Star key={i} fill="#FDBC00" stroke="#FDBC00" height={18} />;
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
  );
}
