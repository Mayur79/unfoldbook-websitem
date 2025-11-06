import React from "react";
// import "boxicons/css/boxicons.min.css";
import { motion } from "framer-motion";

export default function CategorySelection({
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedCategoryName,
}) {
  return (
    <div className=" mb-12">
      {/* Section Title */}
      

      {/* Horizontal Scroll Categories */}
      <div className="relative overflow-x-auto scrollbar-hide px-4 sm:px-8">
        <div
  className="flex justify-center sm:justify-center md:justify-center lg:justify-center space-x-5 py-4 min-w-max mx-auto"
  style={{ overflow: "visible", paddingBottom: "10px" }}
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
      <div className="text-center mt-10">
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
      whileHover={{ y: -8, scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
      onClick={onClick}
     className={`relative flex flex-col items-center justify-between 
  w-[130px] sm:w-[160px] md:w-[180px] 
  h-[140px] sm:h-[160px] 
  p-4 rounded-2xl border-2 cursor-pointer shadow-md transition-all duration-300 

        ${
          active
            ? "border-blue-500 bg-gradient-to-b from-blue-50 to-cyan-50 shadow-blue-100"
            : "border-gray-200 bg-white hover:shadow-lg hover:border-blue-400"
        }`}
      style={{ flex: "0 0 auto" }} // prevents wrapping
    >
      {/* Gradient Glow (on active) */}
      {active && (
        <div className="absolute inset-0 rounded-2xl border-2 border-blue-400 opacity-60 animate-pulse pointer-events-none"></div>
      )}

      {/* Icon/Image Section */}
      <div className="flex flex-col items-center mt-3">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-[2px] border-dotted border-blue-400 flex items-center justify-center bg-gradient-to-b from-white to-blue-50 shadow-inner mb-3">
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

        <h3 className="font-semibold text-sm sm:text-base text-gray-800 text-center leading-snug">
          {title}
        </h3>
      </div>

     
    </motion.div>
  );
}
