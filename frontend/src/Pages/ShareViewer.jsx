import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { SpecialZoomLevel } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';
import api from "../services/api";
import { Printer } from 'lucide-react';
import { toast } from "sonner";
export default function ShareViewer() {
  const { token } = useParams();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [printBlobUrl, setPrintBlobUrl] = useState(null);
  const iframeRef = useRef(null);
  const zoomPluginInstance = zoomPlugin();
    const navigate = useNavigate();
  const { ZoomInButton, ZoomOutButton, ZoomPopover } = zoomPluginInstance;

  const pageNavigationPluginInstance = pageNavigationPlugin();
  const {
    CurrentPageInput,
    GoToNextPage,
    GoToPreviousPage,
    NumberOfPages,
  } = pageNavigationPluginInstance;

  useEffect(() => {
    loadSharedDocument();
  }, [token]);

  async function loadSharedDocument() {
    try {
      const res = await api.get(`/api/v1/doc/share/${token}`);
      const response = await fetch(res.data.url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      setPdfUrl(blobUrl);
        setPrintBlobUrl(blobUrl);
    } catch (err) {
      console.error("Error loading shared document:", err);
      toast.error("Invalid or expired share link.");
    }
  }
  const handlePrint = () => {
    if (!printBlobUrl) return;

    const iframe = iframeRef.current;
    if (iframe) {
      iframe.src = printBlobUrl;
      iframe.onload = () => {
        setTimeout(() => {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        }, 500);
      };
    }
  };

  return (
    <div className="flex flex-col h-screen">
     <div className="flex items-center  bg-white shadow px-4 gap-2">
       Viewing on <span className="font-semibold text-blue-600">UNCOV</span>
      </div>


      <div className="flex-1 overflow-hidden">
      {pdfUrl ? (
  <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
    <div className="h-full w-full">
      <Viewer
        fileUrl={pdfUrl}
        defaultScale={SpecialZoomLevel.PageFit}
        plugins={[zoomPluginInstance, pageNavigationPluginInstance]}
      />
    </div>
  </Worker>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-600">
            Loading shared document...
          </div>
        )}
      </div>
        <iframe
        ref={iframeRef}
        style={{ display: 'none' }}
        title="print-frame"
      />

     {/* page no and zoom ka code */}
 <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex items-center md:gap-2 bg-white border border-gray-200 rounded-full shadow-lg px-3 md:px-5 py-2 backdrop-blur-sm bg-opacity-95">
    
          <div className="flex items-center gap-2">
            <button className="md:p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-gray-900">
              <GoToPreviousPage />
            </button>

            <div className="flex items-center md:gap-1 md:px-2 py-0.5 text-sm font-medium text-gray-700">
              <CurrentPageInput />
              <span className="text-gray-400">/</span>
              <span>
                <NumberOfPages />
              </span>
            </div>

            <button className="md:p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-gray-900">
              <GoToNextPage />
            </button>
          </div>

          <div className="h-6 border-l border-gray-300 mx-3"></div>

      
          <div className="flex items-center gap-2">
            <button className="md:p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-gray-900">
              <ZoomOutButton />
            </button>

            <div className="md:px-1">
              <ZoomPopover />
            </div>

            <button className="md:p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-gray-900">
              <ZoomInButton />
            </button>
          </div>

          <div className="h-6 border-l border-gray-300 mx-3"></div>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            title="Print Document"
            className="flex items-center justify-center gap-2 md:px-3 py-1.5 rounded-full hover:bg-gray-100 transition-all text-gray-700 hover:text-gray-900"
          >
            <Printer size={18} />
            {/* <span className="hidden md:inline text-sm font-medium">Print</span> */}
          </button>
        </div>
      </div>
    </div>
  );
}
