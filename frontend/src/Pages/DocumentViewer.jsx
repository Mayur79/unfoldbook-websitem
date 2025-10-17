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
      
      <div className="flex items-center justify-between bg-white shadow px-4">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 font-medium hover:underline"
        >
          ← Back
        </button>
      </div>

   {/* zoom aur page no code */}
<div className="flex flex-col sm:flex-row items-center justify-between border-b px-4 py-2 z-50">
  <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-2 py-1 shadow-sm mb-2 sm:mb-0">
    <GoToPreviousPage />
    <div className="flex items-center gap-1 text-gray-800">
      <CurrentPageInput />
      <span className="text-sm text-gray-600">/ <NumberOfPages /></span>
    </div>
    <GoToNextPage />
  </div>


  <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-2 py-1 shadow-sm sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2">
    <ZoomOutButton />
    <ZoomPopover />
    <ZoomInButton />
  </div>

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
        <div className="absolute bottom-3 left-4 text-gray-600 text-sm opacity-80 select-none">
  Viewing on <span className="font-semibold text-blue-600">UNCOV</span>
</div>
      </div>
    </div>
  );
}
