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
import SignupModal from './Pages/SignupModal';
import AdminRoute from './services/AdminRoute';
import MyDocument from './Pages/MyDocument';
import DocDetail from './Pages/DocumentDetail';
import CartPage from './Pages/CartPage';
import CheckoutPage from './Pages/CheckoutPage';
import Shop from "./Pages/Shop";
import FillBanner from './Pages/FillBanner';

function App() {

   const [showLoginModal, setShowLoginModal] = useState(false);
     const [isSignupOpen, setIsSignupOpen] = useState(false);
  return (
<>
   <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      onOpenSignup={() => setIsSignupOpen(true)}

      />
        <SignupModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
     onOpenLogin={() => setShowLoginModal(true)}
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

             
              <Route
                path="/dashboard"
                element={
                     <PrivateRoute openLoginModal={() => setShowLoginModal(true)}>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/doc/:id"
                element={
                     <PrivateRoute openLoginModal={() => setShowLoginModal(true)}>
                    <DocDetail />
                  </PrivateRoute>
                }
              />
              <Route
                path="/cart"
                element={
                     <PrivateRoute openLoginModal={() => setShowLoginModal(true)}>
                    <CartPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                     <PrivateRoute openLoginModal={() => setShowLoginModal(true)}>
                    <CheckoutPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/my-document"
                element={
                     <PrivateRoute openLoginModal={() => setShowLoginModal(true)}>
                    <MyDocument />
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
        <Route path="/admin" element={
          
             <AdminRoute openLoginModal={() => setShowLoginModal(true)}><Admin /></AdminRoute>}>
         <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={
            <AdminRoute openLoginModal={() => setShowLoginModal(true)}>
            <AdminDashboard />
            </AdminRoute>} />
          <Route path="roles" element={
               <AdminRoute openLoginModal={() => setShowLoginModal(true)}><RolePage /></AdminRoute>} />
          <Route path="customers" element={
               <AdminRoute openLoginModal={() => setShowLoginModal(true)}><Customer /></AdminRoute>} />
          <Route path="alldocuments" element={   <AdminRoute openLoginModal={() => setShowLoginModal(true)}><AllDocument  /></AdminRoute>} />
          <Route path="upload-document" element={
               <AdminRoute openLoginModal={() => setShowLoginModal(true)}><UploadDocument  /></AdminRoute>} />
          <Route path="add-banner" element={
               <AdminRoute openLoginModal={() => setShowLoginModal(true)}><FillBanner  /></AdminRoute>} />
         
      
        </Route>
        <Route path="/shop" element={<Shop />} />

    </Routes>
    </>
    
  );
}

export default App;
