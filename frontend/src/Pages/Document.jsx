import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import pdfimage from "../assets/pdfimage.png";
export default function Documents() {
  const [docs, setDocs] = useState([]);
  const [purchased, setPurchased] = useState([]);

  const {user}=useAuth();
  useEffect(() => {
    loadDocs();
    loadPurchased(); 
  }, []);

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
  try {
    const res = await api.get(`/api/v1/doc/${doc._id}/view`, {
      responseType: "blob", 
    });

    // Convert the blob to a URL and open in a new tab
    const fileURL = URL.createObjectURL(res.data);
    window.open(fileURL, "_blank");
  } catch (err) {
    console.error("Error viewing document:", err);
    alert("Failed to open document");
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
      link.download = doc.title || "document"; // filename suggestion
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
     <div className="font-poppins">
      
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#4f46e5] to-[#22c55e]">
          Explore Premium Documents
        </h2>
        <p className="text-[#64748b] mt-2 text-sm">
          Browse, preview, and buy high-quality notes, reports, and guides.
        </p>
      </div>

    {/* apna data display wala function */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 justify-center">
        {docs.map((doc) => (
          <div
            key={doc._id}
            className="group flex flex-col bg-white rounded-2xl shadow-sm border border-[#e2e8f0] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
          
            <div className="relative h-48 bg-[#f1f5f9]">
              <img
                src={
                  doc.image ||
                  pdfimage
                }
                alt={doc.title}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                ₹{doc.price}
              </span>
            </div>

           
            <div className="flex flex-col flex-grow p-5">
              <h3 className="text-lg font-semibold text-[#0f172a] mb-2 line-clamp-1">
                {doc.title}
              </h3>
              <p className="text-sm text-[#475569] mb-5 line-clamp-3">
                {doc.description ||
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
              </p>

             
              <div className="mt-auto">
                {purchased.includes(doc._id) ? (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => view(doc)}
                      
                      className="flex-1 text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg  px-5 py-2 text-center "
                    >
                      View
                    </button>
                    <button
                      onClick={() => download(doc)}
                      className="flex-1 text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg  px-5 py-2 text-center"
                    >
                      Download
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => buy(doc)}
                    className="w-full bg-gradient-to-r from-blue-600 to-[#22c55e] hover:from-[#4f46e5] hover:to-[#16a34a] text-white px-4 py-2 rounded-lg transition font-semibold cursor-pointer"
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
