import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";
import { SearchProvider } from './context/SearchContext.jsx'

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId={clientId}>

     <AuthProvider>
      <SearchProvider>
    <App />
    </SearchProvider>
    </AuthProvider>
    </GoogleOAuthProvider>
    </BrowserRouter>
    
  </StrictMode>,
)
