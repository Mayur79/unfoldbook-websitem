import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; // your axios instance

export default function AdminRoute({ children, openLoginModal }) {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // 1️⃣ If no token, open login modal (if provided)
    if (!token) {
      if (openLoginModal) {
        openLoginModal();
      } else {
        navigate("/login");
      }
      return;
    }

    // 2️⃣ Verify admin access via backend
    api
      .get("/api/v1/auth/admin/verify", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => setAuthorized(true))
      .catch(() => {
        setAuthorized(false);
        navigate("/unauthorized");
      });
  }, [navigate, openLoginModal]);

  if (!authorized) return null;

  return children;
}
