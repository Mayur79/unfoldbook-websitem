import React, { useEffect, useState } from "react";
import { Filter, Info, ChevronDown } from "lucide-react";

const templatePeople = [
  { handle: "@alicesmith", method: "VISA •••• 18", categories: ["Arts", "Business", "Travel"], pct: 0.8 },
  { handle: "@bobjohnson", method: "MC •••• 99", categories: ["Books", "Computers"], pct: 0.35 },
  { handle: "@claragarcia", method: "MC •••• 14", categories: ["Kitchen", "Books"], pct: 0.98 },
  { handle: "@emmalee", method: "MC •••• 19", categories: ["Furniture"], pct: 0.45 },
  { handle: "@gracetaylor", method: "VISA •••• 50", categories: ["Beauty", "Apparel"], pct: 0.65 },
   { handle: "@gracetaylor", method: "VISA •••• 50", categories: ["Beauty", "Apparel"], pct: 0.65 },
    { handle: "@gracetaylor", method: "VISA •••• 50", categories: ["Beauty", "Apparel"], pct: 0.65 },
];

function Avatar({ name }) {
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("");
  return (
    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-300 text-white flex items-center justify-center text-sm font-semibold shadow-sm">
      {initials}
    </div>
  );
}

export default function RolePage() {
  const [people, setPeople] = useState([]);
  const [roles, setRoles] = useState({});

  useEffect(() => {
    fetch("http://localhost:4000/api/users")
      .then(res => res.json())
      .then(userList => {
        // Assign MongoDB names to template objects
        const rendered =
          userList.length > 0
            ? userList.slice(0, templatePeople.length).map((user, i) => ({
                ...templatePeople[i],
                name: user.name,
              }))
            : [];
        setPeople(rendered);
        setRoles(Object.fromEntries(rendered.map((u) => [u.name, u.role || "User"])));
      });
  }, []);

  const handleRoleChange = (name, newRole) => {
    setRoles(prev => ({ ...prev, [name]: newRole }));
  };

  const roleOptions = ["User", "Secure Admin", "Admin"];

  return (
    <div className="bg-white/70 backdrop-blur-md border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          Your Customers
          <span className="ml-1 text-xs text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-medium">
            Live
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
            
              
              <th className="py-2 px-4">Role</th>
            
            </tr>
          </thead>

          <tbody className="text-sm text-gray-700">
            {people.map((p, idx) => (
              <tr
                key={idx}
                className="bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm rounded-xl"
              >
                {/* Customer */}
                <td className="py-4 px-4 rounded-l-xl">
                  <div className="flex items-center gap-3">
                    <Avatar name={p.name} />
                    <div>
                      <div className="font-medium text-gray-900">{p.name}</div>
                      <div className="text-xs text-gray-400">{p.handle}</div>
                    </div>
                  </div>
                </td>

               

                
                

                {/* Role Dropdown */}
                <td className="py-4 px-4">
                  <div className="relative inline-block text-left w-36">
                    <select
                      value={roles[p.name]}
                      onChange={(e) => handleRoleChange(p.name, e.target.value)}
                      className="w-full appearance-none text-xs font-medium bg-gray-50 border border-gray-200 text-gray-700 rounded-lg px-3 py-2 pr-6 cursor-pointer hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
                    >
                      {roleOptions.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                    />
                  </div>
                </td>

                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
