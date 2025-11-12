import React from "react";
import { Search, X } from "lucide-react";
import { useSearch } from "../context/SearchContext";

const LaptopSearchbar = ({ placeholder = "Search..." }) => {
  const { searchQuery, setSearchQuery } = useSearch();

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="hidden md:block sticky top-[60px] z-40 bg-transparent px-3 py-2">
      <div className="relative flex items-center bg-gradient-to-r from-blue-50 to-cyan-50 rounded-full px-3 py-2 shadow-inner transition-all focus-within:ring-2 focus-within:ring-blue-400 focus-within:shadow-md">
        <Search size={18} className="text-blue-600 mr-2" />
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleChange}
          className="flex-grow bg-transparent outline-none text-sm placeholder-gray-500 text-gray-700 font-medium"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default LaptopSearchbar;
