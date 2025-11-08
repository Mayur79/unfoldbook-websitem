// src/components/MobileSearchBar.jsx
import React, { useState } from "react";
import { Search } from "lucide-react";

const MobileSearchBar = ({ onSearch, placeholder = "Search..." }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value.trim()); // live search as user types
  };

  return (
    <div className="md:hidden sticky top-[60px] z-40 bg-white/80 backdrop-blur-md border-b border-blue-100 shadow-sm px-3 py-2">
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center bg-gradient-to-r from-blue-50 to-cyan-50 rounded-full px-3 py-2 shadow-inner transition-all focus-within:ring-2 focus-within:ring-blue-400 focus-within:shadow-md"
      >
        <Search size={18} className="text-blue-600 mr-2" />

        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
          className="flex-grow bg-transparent outline-none text-sm placeholder-gray-500 text-gray-700 font-medium"
        />

        <button
          type="submit"
          className="absolute right-2 flex items-center justify-center bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-full w-8 h-8 shadow-md hover:shadow-lg transition-all"
          aria-label="Search"
        >
          <Search size={16} />
        </button>
      </form>
    </div>
  );
};

export default MobileSearchBar;
