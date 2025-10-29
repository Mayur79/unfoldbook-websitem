import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import pdfimage from "../assets/pdfimage.png";
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import LoginModal from '../Pages/Login';
import SignupModal from '../Pages/SignupModal';
export default function Documents() {
  const [docs, setDocs] = useState([]);
  const [purchased, setPurchased] = useState([]);
const [showLoginModal, setShowLoginModal] = useState(false);
const [isSignupOpen, setIsSignupOpen] = useState(false);
  const navigate = useNavigate();
  const {user}=useAuth();
 useEffect(() => {
  loadDocs();
  if (user) loadPurchased();
}, [user]);

  async function loadDocs() {
    const res = await api.get('/api/v1/doc');
    setDocs(res.data);
  }

  
  async function loadPurchased() {
    try {
      const res = await api.get('/api/v1/pay/purchased');
      setPurchased(res.data);
    } catch (err) {
      console.error('Error loading purchased docs:', err);
    }
  }
  async function buy(doc) {
     if (!user) {
    toast.success("You must log in to buy this document."); 
    setShowLoginModal(true);
    return;
  }
    const { data } = await api.post('/api/v1/pay/order', { documentId: doc._id });
    const { order, key } = data;
console.log("data",data);
    const options = {
      key,
      amount: order.amount,
      currency: 'INR',
      name: "Demo Store",
      description: doc.title,
      order_id: order.id,
      handler: async function (response) {
        await api.post('/api/v1/pay/verify', {
          documentId: doc._id,
          ...response
        });
        alert('Payment success!');
        setPurchased([...purchased, doc._id]);
      },
      prefill: { email: user?.email || '' },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  }

async function view(doc) {
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
      alert("Share link copied to clipboard!");
    }
  } catch (err) {
    console.error("Error generating share link:", err);
    alert("Failed to generate share link.");
  }
}




 async function download(doc) {
    try {
      const res = await api.get(`/api/v1/doc/${doc._id}/view`, {
        responseType: "blob",
      });

      // Create a temporary download link
      const blob = new Blob([res.data], {
        type: res.headers["content-type"],
      });
      const fileURL = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = doc.title || "document";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(fileURL);
    } catch (err) {
      console.error("Error downloading document:", err);
      alert("Failed to download document");
    }
  }


  return (
      <div className="font-poppins px-3 sm:px-8 py-6">
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
    <div className="text-center mb-8 sm:mb-12">
      <h2 className="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#4f46e5] to-[#22c55e]">
       Buy - Download - Print
      </h2>
      <p className="text-[#64748b] mt-2 text-xs sm:text-sm">
      Anytime, Anywhere, <span className='font-bold'>Get 100% Success</span>. All the Best!
      </p>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 justify-center">
      {docs.map((doc) => (
        <div
          key={doc._id}
          className="group flex flex-col bg-white rounded-xl sm:rounded-2xl shadow-md border border-[#e2e8f0] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
        >
          {/* Image */}
          <div className="relative h-36 sm:h-48 bg-[#f1f5f9]">
            <img
           src={doc.thumbnailBase64 || pdfimage}

              alt={doc.title}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
            <span className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-blue-600 text-white text-[10px] sm:text-xs font-semibold px-2 py-1 rounded-full shadow-md">
              ₹{doc.price}
            </span>
          </div>

          {/* Card content */}
          <div className="flex flex-col flex-grow p-3 sm:p-5">
            <h3 className="text-sm sm:text-lg font-semibold text-[#0f172a] mb-1 sm:mb-2 line-clamp-1">
              {doc.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#475569] mb-4 sm:mb-5 line-clamp-3">
              {doc.description ||
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
            </p>

            {/* Buttons */}
            <div className="mt-auto">
              {purchased.includes(doc._id) ? (
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button
                    onClick={() => view(doc)}
                    className="w-full text-xs sm:text-sm text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 font-medium rounded-md sm:rounded-lg px-3 py-1.5 sm:px-5 sm:py-2 text-center cursor-pointer"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => share(doc)}
                    className="w-full text-xs sm:text-sm text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 font-medium rounded-md sm:rounded-lg px-3 py-1.5 sm:px-5 sm:py-2 text-center cursor-pointer"
                  >
Share
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => buy(doc)}
                  className="w-full text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-[#22c55e] hover:from-[#4f46e5] hover:to-[#16a34a] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md sm:rounded-lg transition font-semibold cursor-pointer"
                >
                  Buy Now
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
  );
}
