// src/components/Admin.jsx
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import RolePage from "./RolePage";

export default function Admin() {
  const [active, setActive] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto p-1">
        <div className="flex gap-6">
          <Sidebar active={active} onNavigate={setActive} />
          <main className="flex-1">
            <header className="mb-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900">
                  {active === "dashboard" ? "Orders" : "Roles"}
                </h1>
                <div className="flex items-center gap-3">
                  <div className="hidden md:flex items-center space-x-3">
                    <button className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm">June</button>
                    <button className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm">Export</button>
                  </div>
                  <button className="px-3 py-2 text-sm rounded-lg bg-green-100 text-green-700">+ Connect wallet</button>
                </div>
              </div>
            </header>

            <section>
              {active === "dashboard" ? <Dashboard /> : <RolePage />}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
