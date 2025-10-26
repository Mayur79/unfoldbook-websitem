// src/components/Admin.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Layout from "../Layout/Layout";

export default function Admin() {
  return (
      <Layout>
    <div className="min-h-screen flex bg-gray-50">
    
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto transition-all">
        <Outlet />
      </main>
    </div>
    </Layout>
  );
}
