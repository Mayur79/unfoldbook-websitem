import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import PrivateRoute from './services/PrivateRoute';
import Dashboard from './Pages/Dashboard';
import Login from './Pages/Login';
import Admin from './Component/Admin';
import Documents from './Pages/Document';
import Layout from './Layout/Layout';
import PageNotFound from './Pages/PageNotFound';
import DocumentViewer from './Pages/DocumentViewer';
import UploadDocument from './Pages/UploadDocument';
import ShareViewer from './Pages/ShareViewer';

function App() {
  return (
    <Routes>
   
    
      <Route
        path="/viewer/:docId"
        element={
          <PrivateRoute>
            <DocumentViewer />
          </PrivateRoute>
        }
      />

   
      <Route
        path="/*"
        element={
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/document" replace />} />
              <Route path="/login" element={<Login />} />

              <Route path="/admin" element={
                   <PrivateRoute><Admin />
                   </PrivateRoute>} />
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
              <Route
                path="/upload-document"
                element={
                  <PrivateRoute>
                    <UploadDocument />
                  </PrivateRoute>
                }
              />
              <Route path="/share/:token" element={
                <PrivateRoute>
                <ShareViewer />
                </PrivateRoute>
                } />

              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;
