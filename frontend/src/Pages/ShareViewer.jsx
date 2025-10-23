import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { SpecialZoomLevel } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import api from "../services/api";

export default function ShareViewer() {
  const { token } = useParams();
  const [pdfUrl, setPdfUrl] = useState(null);

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
    } catch (err) {
      console.error("Error loading shared document:", err);
      alert("Invalid or expired share link.");
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center justify-center bg-white shadow px-4 py-2">
        Viewing shared document on <span className="font-semibold text-blue-600 ml-1">UNCOV</span>
      </div>

      <div className="flex-1 overflow-hidden">
        {pdfUrl ? (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <Viewer fileUrl={pdfUrl} defaultScale={SpecialZoomLevel.PageFit} />
          </Worker>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-600">
            Loading shared document...
          </div>
        )}
      </div>
    </div>
  );
}
