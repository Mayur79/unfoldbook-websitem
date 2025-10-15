import React, { useState } from "react";

// Individual Navigation Item Component
const NavItem = ({ icon, label, active, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 w-full text-left px-2.5 py-2 rounded-md transition-all duration-150 ${
      active
        ? "bg-emerald-50 text-emerald-700 font-medium"
        : "text-gray-700 hover:bg-gray-100"
    }`}
  >
    <span className="w-5 h-5">{icon}</span>
    <span className="flex-1 text-sm">{label}</span>
    {badge && (
      <span className="text-xs px-2 py-0.5 bg-white border border-gray-200 rounded-full text-gray-600">
        {badge}
      </span>
    )}
  </button>
);

export default function Sidebar({ active, onNavigate }) {
  const [open, setOpen] = useState(false);

  // === Icons ===
  const MenuIcon = (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      className="opacity-90"
    >
      <path
        d="M3 12h18M3 6h18M3 18h18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const DashboardIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="3"
        width="8"
        height="8"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <rect
        x="13"
        y="3"
        width="8"
        height="5"
        rx="1.2"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <rect
        x="13"
        y="10"
        width="8"
        height="11"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <rect
        x="3"
        y="13"
        width="8"
        height="8"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );

  const RolesIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle
        cx="9"
        cy="8"
        r="3"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M3 20c1.7-3 6.3-4 9-4s7.3 1 9 4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <rect
        x="13"
        y="6"
        width="8"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );

  return (
    <aside className="w-full md:w-48 bg-white border-r border-gray-100 h-screen md:h-auto sticky top-0">
      <div className="p-3 md:p-3">
        {/* Header */}
        <div className="flex items-center justify-between md:block mb-4 md:mb-5">
          <div className="flex items-center gap-2">
            <div className="text-emerald-700 font-bold text-base tracking-tight">
              DocBuy
            </div>
          </div>
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {MenuIcon}
          </button>
        </div>

        {/* Navigation */}
        <div className={`${open ? "block" : "hidden"} md:block`}>
          <nav className="space-y-1.5">
            <NavItem
              icon={DashboardIcon}
              label="Dashboard"
              active={active === "dashboard"}
              onClick={() => {
                onNavigate("dashboard");
                setOpen(false);
              }}
            />
            <NavItem
              icon={RolesIcon}
              label="Roles"
              active={active === "roles"}
              onClick={() => {
                onNavigate("roles");
                setOpen(false);
              }}
            />

            {/* Divider: Products */}
            <div className="mt-3 border-t border-gray-100 pt-3">
              <p className="text-xs text-gray-400 uppercase tracking-wide px-2">
                Products
              </p>
              <button className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-gray-100 text-gray-700 text-sm mt-1">
                All Documents
              </button>
              <button className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-gray-100 text-gray-700 text-sm">
                Upload
              </button>
            </div>

            {/* Divider: Settings */}
            <div className="mt-4 border-t border-gray-100 pt-3">
              <button className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-gray-100 text-gray-700 text-sm">
                Settings
              </button>
              <button className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-gray-100 text-gray-700 text-sm">
                Feedback
              </button>
            </div>
          </nav>
        </div>
      </div>
    </aside>
  );
}
