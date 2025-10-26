// PrivateRoute.jsx
import React, { useEffect } from "react";

export default function PrivateRoute({ children, openLoginModal }) {
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token && openLoginModal) {
      openLoginModal();
    }
  }, [token, openLoginModal]);

  if (!token) {
    // Don't render the protected content
    return null;
  }

  return children;
}
