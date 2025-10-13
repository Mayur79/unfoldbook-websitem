// src/layout/Layout.jsx
import React from "react";
import Footer from "../Component/Footer";
import Navbar from "../Component/Navbar";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow p-4">{children}</main>
      <Footer />
    </div>
  );
}
