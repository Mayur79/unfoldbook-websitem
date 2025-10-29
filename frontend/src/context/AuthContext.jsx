import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
   const [logoutTimer, setLogoutTimer] = useState(null);
  // Load user if token exists
   useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      scheduleAutoLogout(token);
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  // Function to fetch user info using /me
  async function fetchUser() {
    try {
      const res = await api.get('/api/v1/auth/me');
      const fetchedUser = res.data.user || res.data;
      setUser(fetchedUser);
    
    } catch (err) {
      console.error('Failed to fetch user:', err);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  // Login function
  async function login(email, password) {
    const res = await api.post('/api/v1/auth/login', { email, password });
    const { token } = res.data;
    localStorage.setItem('token', token);
    scheduleAutoLogout(token);
    await fetchUser();
  }
  async function signup(name, email, password) {
    const res = await api.post("/api/v1/auth/signup", { name, email, password });
    const { token, user } = res.data;
    // setToken(token);
    // setUser(user);
    localStorage.setItem('token', token);
    scheduleAutoLogout(token);
    await fetchUser();
  }

    async function googleLogin(googleToken) {
    try {
      const res = await api.post("/api/v1/auth/googleLogin", { token: googleToken });
      const { token, user } = res.data;

      // Save token + update user
      localStorage.setItem("token", token);
      scheduleAutoLogout(token);
    await fetchUser();
      // setUser(user);
    } catch (err) {
      console.error("Google login failed:", err.response?.data || err.message);
      localStorage.removeItem("token");
      setUser(null);
    }
  }

    function scheduleAutoLogout(token) {
    try {
      const decoded = jwtDecode(token);
      const expTime = decoded.exp * 1000 - Date.now(); // milliseconds until expiry
      console.log("Token will expire in:", expTime / 1000, "seconds");

      if (logoutTimer) clearTimeout(logoutTimer);
      const timer = setTimeout(() => {
        console.warn("Token expired. Auto logging out...");
        logout(); // or window.location.reload();
      }, expTime);

      setLogoutTimer(timer);
    } catch (err) {
      console.error("Failed to decode token:", err);
    }
  }

  // Logout function
   function logout() {
    localStorage.removeItem("token");
    setUser(null);
    if (logoutTimer) clearTimeout(logoutTimer);
    navigate("/");
    window.location.reload();
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        fetchUser,
        googleLogin,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use AuthContext easily
export function useAuth() {
  return useContext(AuthContext);
}
