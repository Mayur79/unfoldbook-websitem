import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export default function LoginModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null; // don't render if closed

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      toast.success("Logged in successfully!");
      onClose(); // close modal
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Login failed");
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-sm shadow-lg relative animate-in fade-in-50">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
