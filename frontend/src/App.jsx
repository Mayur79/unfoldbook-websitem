
import './App.css'
import { Navigate, Route, Router, Routes } from 'react-router-dom'
import PrivateRoute from './services/PrivateRoute'
import Dashboard from './Pages/Dashboard'
import Login from './Pages/Login'
import Documents from './Pages/Document'
import Layout from './Layout/Layout'
import PageNotFound from './Pages/PageNotFound'
import useHealthCheck from './services/useHealthCheck'
import "@fontsource/poppins"; 
import "@fontsource/poppins/600.css"; 

function App() {

 const status = useHealthCheck();


  if (status === 'error') {
    return (
      <>
      <Layout>
         <PageNotFound />
      </Layout>
      </>
    );
  }

  return (
    <>
   
      <Layout>
     <Routes>
        <Route path="/" element={<Navigate to="/document" replace />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/document"
          element={
            <PrivateRoute>
              <Documents />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      
      </Layout>
    </>
  )
}

export default App
