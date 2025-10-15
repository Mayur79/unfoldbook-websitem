import React from "react";
import { Wallet, Info } from "lucide-react";

const Dashboard = () => {
  const stats = [
    { title: "Total Revenue", value: "$712,241", change: "+4.7%", trend: "up", description: "from last week" },
    { title: "Total customers", value: "4,213", change: "+3.2%", trend: "up", description: "from last week" },
    { title: "Total transactions", value: "563", change: "-1.3%", trend: "down", description: "from last week" },
    { title: "Total products", value: "882", change: "+1.2%", trend: "up", description: "from last week" },
  ];

  const overview = [
    { title: "Recent sales", value: "$12,420", desc: "in last 7 days" },
    { title: "Documents uploaded", value: "124", desc: "active listings" },
    { title: "Conversion rate", value: "4.3%", desc: "visitors → buyers" },
  ];

  return (
    <div className="flex flex-col w-full min-h-screen p-2 px-3 sm:px-5 lg:px-6 py-5 bg-[#f9fafb]">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-5">
        <h2 className="text-xl font-semibold text-gray-800">Orders</h2>
        <div className="flex flex-wrap gap-2.5">
          <select className="border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs sm:text-sm">
            <option>June</option>
            <option>July</option>
            <option>August</option>
          </select>
          <button className="border border-gray-300 px-3 py-1.5 rounded-lg text-gray-700 text-xs sm:text-sm hover:bg-gray-100 transition">
            Export
          </button>
          <button className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs sm:text-sm hover:bg-emerald-200 transition">
            <Wallet size={14} /> Connect wallet
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-gray-600 font-medium text-xs sm:text-sm">
                {item.title}
              </h3>
              <Info size={12} className="text-gray-400" />
            </div>
            <p className="text-lg sm:text-xl font-semibold text-gray-900">
              {item.value}
            </p>
            <p
              className={`text-xs sm:text-sm mt-1 ${
                item.trend === "up" ? "text-emerald-600" : "text-red-500"
              }`}
            >
              {item.change}{" "}
              <span className="text-gray-500">{item.description}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Search and Overview Controls */}
      <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
        <div className="flex items-center w-full sm:w-auto bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 shadow-sm hover:shadow-md transition">
          <input
            type="text"
            placeholder="Search..."
            className="outline-none text-xs sm:text-sm w-full"
          />
        </div>
        <div className="flex gap-2.5">
          <button className="border border-gray-300 px-3 py-1.5 rounded-lg text-gray-700 text-xs sm:text-sm hover:bg-gray-100 transition">
            Export
          </button>
          <button className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs sm:text-sm hover:bg-emerald-200 transition">
            <Wallet size={14} /> Connect wallet
          </button>
        </div>
      </div>

      {/* Overview Section */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-base font-medium text-gray-800 mb-3">Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {overview.map((item, idx) => (
            <div
              key={idx}
              className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-all"
            >
              <p className="text-xs text-gray-500">{item.title}</p>
              <p className="text-lg font-semibold text-gray-800">
                {item.value}
              </p>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
