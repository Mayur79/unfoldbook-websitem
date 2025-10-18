import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';
import api from '../services/api';
import { SpecialZoomLevel } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/zoom/lib/styles/index.css';
import '@react-pdf-viewer/page-navigation/lib/styles/index.css';

export default function DocumentViewer() {
  const { docId } = useParams();
  const [pdfUrl, setPdfUrl] = useState(null);
  const navigate = useNavigate();

 
  const zoomPluginInstance = zoomPlugin();
  const { ZoomInButton, ZoomOutButton, ZoomPopover } = zoomPluginInstance;

  const pageNavigationPluginInstance = pageNavigationPlugin();
  const {
    CurrentPageInput,
    GoToNextPage,
    GoToPreviousPage,
    NumberOfPages,
  } = pageNavigationPluginInstance;

  useEffect(() => {
    loadDocument();
  }, [docId]);

async function loadDocument() {
  try {
    // 1️⃣ Get the pre-signed URL from your backend
    const res = await api.get(`/api/v1/doc/${docId}/presign`);
    const presignedUrl = res.data.url; // The URL returned from the server

    // 2️⃣ Set it directly for your PDF viewer
    setPdfUrl(presignedUrl);
  } catch (err) {
    console.error('Error loading PDF:', err);
    alert('Failed to load document');
  }
}

  return (
    <div className="flex flex-col h-screen w-full">
      
      <div className="flex items-center  bg-white shadow px-4 gap-2">
       Viewing on <span className="font-semibold text-blue-600">UNCOV</span>
      </div>




     {/* viewer ka code */}
      <div className="flex-1 overflow-hidden ">
        {pdfUrl ? (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <div className="h-full w-full">
             <Viewer
  fileUrl={pdfUrl}
  plugins={[zoomPluginInstance, pageNavigationPluginInstance]}
defaultScale={SpecialZoomLevel.PageFit}
/>
            </div>
          </Worker>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-600">
            Loading PDF...
          </div>
        )}
      
      </div>
     {/* page no and zoom ka code */}
<div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 ">
  <div className="flex items-center md:gap-2 bg-white border border-gray-200 rounded-full shadow-lg px-2 md:px-4 py-2 backdrop-blur-sm bg-opacity-95">
  
    <div className="flex items-center gap-2">
      <button className="md:p-1.5 hover:bg-gray-100 rounded-full transition-colors duration-200 text-gray-600 hover:text-gray-900">
        <GoToPreviousPage />
      </button>

      <div className="flex items-center md:gap-1 md:px-2 py-0.5 text-sm font-medium text-gray-700">
        <CurrentPageInput />
        <span className="text-gray-400">/</span>
        <span>
          <NumberOfPages />
        </span>
      </div>

      <button className="md:p-1.5 hover:bg-gray-100 rounded-full transition-colors duration-200 text-gray-600 hover:text-gray-900">
        <GoToNextPage />
      </button>
    </div>

   
    <div className="h-6 border-l border-gray-300 mx-3"></div>

 
    <div className="flex items-center gap-2">
      <button className="md:p-1.5 hover:bg-gray-100 rounded-full transition-colors duration-200 text-gray-600 hover:text-gray-900">
        <ZoomOutButton />
      </button>

      <div className="md:px-1">
        <ZoomPopover />
      </div>

      <button className="md:p-1.5 hover:bg-gray-100 rounded-full transition-colors duration-200 text-gray-600 hover:text-gray-900">
        <ZoomInButton />
      </button>
    </div>
  </div>
</div>


    </div>
  );
}
