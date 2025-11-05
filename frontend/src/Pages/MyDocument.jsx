import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import pdfimage from '../assets/pdfimage.png';
import LoginModal from './Login';
import SignupModal from './SignupModal';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
const MyDocument = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [purchased, setPurchased] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  useEffect(() => {
    if (user) loadPurchased();
  }, [user]);

  async function loadPurchased() {
    try {
      const res = await api.get('/api/v1/doc/my-document/list');
      console.log('Purchased docs:', res.data);
      setPurchased(res.data);
    } catch (err) {
      console.error('Error loading purchased docs:', err);
    }
  }

  function view(doc) {
    navigate(`/viewer/${doc._id}`);
  }

  async function share(doc) {
    try {
      const res = await api.get(`/api/v1/doc/${doc._id}/share`);
      const shareUrl = res.data.shareUrl;

      if (navigator.share) {
        await navigator.share({
          title: doc.title,
          text: `Check out this document: ${doc.title}`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Share link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error generating share link:', err);
      // alert('Failed to generate share link.');
    }
  }

  return (
    <>
      <div className="font-poppins px-4 sm:px-8 py-6 min-h-screen">
        {/* Modals */}
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

        {/* Header */}
        <div className="mb-8 sm:mb-10 text-center sm:text-left">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight">
            My Document
          </h2>
          <p className="text-gray-500 text-sm sm:text-base mt-2">
            Access all your purchased documents in one place.
          </p>
        </div>

        {/* Grid of Purchased Docs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {purchased.length === 0 ? (
            <div className="col-span-full flex justify-center items-center py-16">
              <p className="text-gray-500 text-center text-lg">
                You haven’t purchased any documents yet.
              </p>
            </div>
          ) : (
            purchased.map((doc) => (
              <div
                key={doc._id}
                className="group flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
              >
                {/* Thumbnail */}
                <div className="relative h-40 sm:h-48 bg-gray-100">
                  <img
                    src={doc.thumbnailBase64 || pdfimage}
                    alt={doc.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute top-2 right-2 bg-indigo-600 text-white text-xs font-semibold px-2 py-1 rounded">
                    ₹{doc.price}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-grow p-4">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 line-clamp-1">
                    {doc.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mb-4 line-clamp-3">
                    {doc.description ||
                      'This is your purchased document. View or share it anytime.'}
                  </p>

                  {/* Buttons */}
                  <div className="mt-auto flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => view(doc)}
                      className="w-full text-xs sm:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-md transition-colors"
                    >
                Download
                    </button>
                    <button
                      onClick={() => share(doc)}
                      className="w-full text-xs sm:text-sm font-medium text-indigo-600 border border-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-md transition-colors"
                    >
                      Share
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default MyDocument;
