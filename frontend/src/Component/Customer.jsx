// src/Pages/Customer.jsx
import React from "react";
import { Filter } from "lucide-react";

// Avatar component (same style as RolePage)
function Avatar({ name }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
  return (
    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-300 text-white flex items-center justify-center text-sm font-semibold shadow-sm">
      {initials}
    </div>
  );
}

export default function Customer() {
  const customers = [
    {
      name: "John Doe",
      email: "john.doe@gmail.com",
      password: "••••••••",
      documents: 5,
    },
    {
      name: "Jane Smith",
      email: "jane.smith@gmail.com",
      password: "••••••••",
      documents: 3,
    },
    {
      name: "David Chen",
      email: "david.chen@gmail.com",
      password: "••••••••",
      documents: 8,
    },
    {
      name: "Sophia Patel",
      email: "sophia.patel@gmail.com",
      password: "••••••••",
      documents: 6,
    },
  ];

  return (
    <div className="bg-white/70 backdrop-blur-md border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          Customer List
          <span className="ml-1 text-xs text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-medium">
            Active
          </span>
        </h2>
        <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition">
          <Filter size={16} />
          Filter
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] table-auto border-separate border-spacing-y-2">
          <thead>
            <tr className="text-left text-sm text-gray-500 uppercase tracking-wide">
              <th className="py-2 px-4">Customer</th>
              <th className="py-2 px-4">User ID (Email)</th>
              <th className="py-2 px-4">Password</th>
              <th className="py-2 px-4">Documents</th>
            </tr>
          </thead>

          <tbody className="text-sm text-gray-700">
            {customers.map((c, idx) => (
              <tr
                key={idx}
                className="bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm rounded-xl"
              >
                {/* Customer Info */}
                <td className="py-4 px-4 rounded-l-xl">
                  <div className="flex items-center gap-3">
                    <Avatar name={c.name} />
                    <div>
                      <div className="font-medium text-gray-900">{c.name}</div>
                      <div className="text-xs text-gray-400">
                        Joined 2025 • Active
                      </div>
                    </div>
                  </div>
                </td>

                {/* Email */}
                <td className="py-4 px-4 text-gray-700">{c.email}</td>

                {/* Password */}
                <td className="py-4 px-4 text-gray-700">{c.password}</td>

                {/* Documents */}
                <td className="py-4 px-4 rounded-r-xl">
                  <span className="px-3 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-full">
                    {c.documents} Docs
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
