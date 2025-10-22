// src/components/Admin.jsx
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import RolePage from "./RolePage";
import Customer from "./Customer";
import AllDocuments from "./AllDocuments";

export default function Admin() {
  const [active, setActive] = useState("dashboard");

  const renderPage = () => {
    switch (active) {
      case "dashboard":
        return <Dashboard />;
      case "roles":
        return <RolePage />;
      case "customers":
        return <Customer />;
      case "alldocuments":
        return <AllDocuments />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <Sidebar active={active} onNavigate={setActive} />

      {/* Main Content Area */}
      <main className="flex-1 p-6 overflow-auto transition-all">
        

        {/* Page Content */}
        <section >
          {renderPage()}
        </section>
      </main>
    </div>
  );
}
