import React, { useState } from "react";
import { Search } from "lucide-react";

const LaptopSearchbar = ({ onSearch, placeholder = "Search..." }) => {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value); // no need to trim or lowercase here, do it in parent
  };

  return (
    <div className="hidden md:block sticky top-[60px] z-40 bg-transparent   border-blue-100  px-3 py-2">
      <div className="relative flex items-center bg-gradient-to-r from-blue-50 to-cyan-50 rounded-full px-3 py-2 shadow-inner transition-all focus-within:ring-2 focus-within:ring-blue-400 focus-within:shadow-md">
        <Search size={18} className="text-blue-600 mr-2" />
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
          className="flex-grow bg-transparent outline-none text-sm placeholder-gray-500 text-gray-700 font-medium"
        />
      </div>
    </div>
  );
};

export default LaptopSearchbar;
