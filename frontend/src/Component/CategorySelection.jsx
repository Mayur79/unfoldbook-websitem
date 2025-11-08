import React from "react";
import { motion } from "framer-motion";

export default function CategorySelection({
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedCategoryName,
}) {
  return (
    <div className="">
      {/* Horizontal Scroll Categories */}
      <div className="relative overflow-x-auto scrollbar-hide px-4 sm:px-8">
        <div
          className="flex justify-center sm:justify-center md:justify-center lg:justify-center space-x-4 py-4 min-w-max mx-auto"
          style={{ overflow: "visible", paddingBottom: "8px" }}
        >
          {/* "All" Category */}
          <CategoryCard
            title="All"
            icon="bx-grid-alt"
            active={selectedCategory === "All"}
            onClick={() => setSelectedCategory("All")}
          />

          {/* Dynamic Categories */}
          {categories.map((cat) => (
            <CategoryCard
              key={cat._id}
              title={cat.categoryName}
              icon={cat.icon || "bx-book-open"}
              img={cat.imageUrl}
              active={selectedCategory === cat._id}
              onClick={() => setSelectedCategory(cat._id)}
            />
          ))}
        </div>
      </div>

      {/* Category Heading Below */}
      <div className="text-center mt-5">
        <h3 className="text-2xl sm:text-3xl font-bold text-blue-600">
          {selectedCategoryName || "All Documents"}
        </h3>
      </div>
    </div>
  );
}

/* -------------------- Card Component -------------------- */
function CategoryCard({ title, icon, img, active, onClick }) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
      onClick={onClick}
      className={`relative flex flex-col items-center justify-between 
        w-[100px] sm:w-[120px] md:w-[140px] 
        h-[110px] sm:h-[125px] 
        p-3 rounded-2xl border-2 cursor-pointer shadow-md transition-all duration-300
        ${
          active
            ? "border-blue-500 bg-gradient-to-b from-blue-50 to-cyan-50 shadow-blue-100"
            : "border-gray-200 bg-white hover:shadow-lg hover:border-blue-400"
        }`}
      style={{ flex: "0 0 auto" }}
    >
      {/* Active Glow */}
      {active && (
        <div className="absolute inset-0 rounded-2xl border-2 border-blue-400 opacity-60 animate-pulse pointer-events-none"></div>
      )}

      {/* Icon/Image */}
      <div className="flex flex-col items-center mt-2">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-[2px] border-dotted border-blue-400 flex items-center justify-center bg-gradient-to-b from-white to-blue-50 shadow-inner mb-2">
          {img ? (
            <img
              src={img}
              alt={title}
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
            />
          ) : (
            <i className={`bx ${icon} text-2xl sm:text-3xl text-blue-600`}></i>
          )}
        </div>

        <h3 className="font-semibold text-xs sm:text-sm text-gray-800 text-center leading-snug">
          {title}
        </h3>
      </div>
    </motion.div>
  );
}
