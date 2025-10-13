import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';


const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // Load user if token exists
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
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
    await fetchUser();
  }

  // Logout function
  function logout() {
    localStorage.removeItem('token');
    setUser(null);
    navigate("/");
    
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        fetchUser,
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
