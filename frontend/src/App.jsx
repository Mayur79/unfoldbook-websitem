import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import PrivateRoute from './services/PrivateRoute';
import Dashboard from './Pages/Dashboard';
// import Login from './Pages/Login';
import Admin from './Component/Admin';
import Documents from './Pages/Document';
import Layout from './Layout/Layout';
import PageNotFound from './Pages/PageNotFound';
import DocumentViewer from './Pages/DocumentViewer';
import UploadDocument from './Pages/UploadDocument';
import ShareViewer from './Pages/ShareViewer';
import LoginModal from './Pages/Login';
import { useState } from 'react';
import AdminDashboard from './Component/AdminDashboard';
import RolePage from './Component/RolePage';
import Customer from "./Component/Customer";
import AllDocument from "./Component/AllDocuments";
function App() {

   const [showLoginModal, setShowLoginModal] = useState(false);
  return (
<>
   <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />


    <Routes>
   
    
      <Route
        path="/viewer/:docId"
        element={
           <PrivateRoute openLoginModal={() => setShowLoginModal(true)}>
            <DocumentViewer />
          </PrivateRoute>
        }
      />

   
      <Route
        path="/*"
        element={
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              {/* <Route path="/login" element={<Login />} /> */}

              <Route path="/admin" element={
                      <PrivateRoute openLoginModal={() => setShowLoginModal(true)}><Admin />
                   </PrivateRoute>} />
              <Route
                path="/dashboard"
                element={
                     <PrivateRoute openLoginModal={() => setShowLoginModal(true)}>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/home"
                element={
                
                    <Documents />
               
                }
              />
              {/* <Route
                path="/upload-document"
                element={
                     <PrivateRoute openLoginModal={() => setShowLoginModal(true)}>
                    <UploadDocument />
                  </PrivateRoute>
                }
              /> */}
              <Route path="/share/:token" element={
                 <PrivateRoute openLoginModal={() => setShowLoginModal(true)}>
                <ShareViewer />
                </PrivateRoute>
                } />

              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Layout>
        }
      />
        <Route path="/admin" element={<Admin />}>
         <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="roles" element={<RolePage />} />
          <Route path="customers" element={<Customer />} />
          <Route path="alldocuments" element={<AllDocument  />} />
          <Route path="upload-document" element={<UploadDocument  />} />
         
      
        </Route>
    </Routes>
    </>
    
  );
}

export default App;
