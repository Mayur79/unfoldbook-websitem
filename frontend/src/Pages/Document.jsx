import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

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
    <div style={{ padding: 24 }}>
      <h2>Documents</h2>
      {docs.map(doc => (
        <div key={doc._id} style={{ borderBottom: '1px solid #ddd', marginBottom: 10, paddingBottom: 10 }}>
          <strong>{doc.title}</strong> — ₹{doc.price}
          <div>
            {purchased.includes(doc._id)
              ? 
              <>
              <button onClick={() => view(doc)}>View</button>
              <button onClick={() => download(doc)} style={{marginLeft:10}}>Download</button>
              </>
              : <button onClick={() => buy(doc)}>Buy</button>}
          </div>
        </div>
      ))}
    </div>
  );
}
