// src/components/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

// Individual Navigation Item
const NavItem = ({to, icon, label }) => (
   <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl transition-all duration-150 ${
        isActive
          ? "bg-emerald-50 text-emerald-700 font-semibold shadow-sm"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      }`
    }
  >
    <span className="flex items-center justify-center w-5 h-5">{icon}</span>
    <span className="text-sm tracking-wide">{label}</span>
  </NavLink>
);

export default function Sidebar({ active, onNavigate }) {
  // Icons
  const DashboardIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <rect x="13" y="3" width="8" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
      <rect x="13" y="10" width="8" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );

  const RolesIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.2" />
      <path d="M3 20c1.7-3 6.3-4 9-4s7.3 1 9 4" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );

  const CustomersIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4 20c1.5-3 6-4 8-4s6.5 1 8 4" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );

  const DocumentsIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );

  return (
    <aside className="w-60 bg-white border-r border-gray-100 h-screen sticky top-0 shadow-[0_0_10px_rgba(0,0,0,0.03)] flex flex-col justify-between">
      {/* Top section */}
      <div className="p-4">
       

        {/* Navigation */}
        <nav className="space-y-1">
          <NavItem
           to="/admin/dashboard"
            icon={DashboardIcon}
            label="Dashboard"
           
          />
          <NavItem
          to="/admin/roles"
            icon={RolesIcon}
            label="Roles"
           
          />
          <NavItem
          to="/admin/customers" 
            icon={CustomersIcon}
            label="Customers"
            
          />
          <NavItem
          to="/admin/alldocuments"
            icon={DocumentsIcon}
            label="All Documents"
            
          />
          <NavItem
          to="/admin/upload-document"
            icon={DocumentsIcon}
            label="Upload Document"
            
          />
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1 px-2">
          Support
        </p>
        <button className="w-full text-left px-3 py-2 rounded-lg text-gray-600 text-sm hover:bg-gray-50 hover:text-gray-900 transition">
          Settings
        </button>
        <button className="w-full text-left px-3 py-2 rounded-lg text-gray-600 text-sm hover:bg-gray-50 hover:text-gray-900 transition">
          Feedback
        </button>
      </div>
    </aside>
  );
}
