// src/Pages/Customer.jsx
import React, { useEffect, useState } from "react";
import { Filter } from "lucide-react";
import api from "../services/api";

// Avatar component (blue gradient theme)
function Avatar({ name }) {
  const initials =
    name
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("") || "?";
  return (
    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-blue-300 text-white flex items-center justify-center text-sm font-semibold shadow-sm">
      {initials}
    </div>
  );
}

export default function Customer() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await api.get("/api/users/user-doc-data");
        setCustomers(res.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">Loading customers...</div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-md border border-blue-100 rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          Customer List
          <span className="ml-1 text-xs text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full font-medium">
            Active
          </span>
        </h2>
        <button className="flex items-center gap-2 px-3 py-2 text-sm border border-blue-100 rounded-lg bg-blue-50 text-blue-600">
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
                className="bg-white shadow-sm rounded-xl border border-blue-50"
              >
                {/* Customer Info */}
                <td className="py-4 px-4 rounded-l-xl">
                  <div className="flex items-center gap-3">
                    <Avatar name={c.name} />
                    <div>
                      <div className="font-medium text-gray-900">{c.name}</div>
                      <div className="text-xs text-gray-400">
                        Joined {new Date(c.createdAt).toLocaleDateString()} • Active
                      </div>
                    </div>
                  </div>
                </td>

                {/* Email */}
                <td className="py-4 px-4 text-gray-700">{c.email}</td>

                {/* Password */}
                <td className="py-4 px-4 text-gray-700">
                  {c.password || "*****"}
                </td>

                {/* Documents */}
                <td className="py-4 px-4 rounded-r-xl">
                  <span className="px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
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
