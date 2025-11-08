// src/layout/Layout.jsx
import React from "react";
import Footer from "../Component/Footer";
import Navbar from "../Component/Navbar";
import Admin from "../Component/Admin";
import { Toaster } from "sonner";
import BottomNavBar from "../Component/BottomNavbar";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
         <Toaster  richColors />
      <Navbar />
      
      <main className="flex-grow ">{children}</main>
         <BottomNavBar />

      <Footer />
    </div>
  );
}
