import React, { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "sonner";
import { UploadCloud, X, ImagePlus, Trash2 } from "lucide-react";

const FillBanner = () => {
  const [banner1Files, setBanner1Files] = useState([]);
  const [banner2Files, setBanner2Files] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await api.get("/api/v1/banner/getimages");
        setUploadedImages(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchImages();
  }, []);

  const handleFileChange = (e, setBanner, bannerType) => {
    const alreadyUploaded = uploadedImages.filter(
      (img) => img.bannerType === bannerType
    ).length;
    const maxFiles = Math.min(5 - alreadyUploaded, e.target.files.length);
    if (maxFiles <= 0)
      return toast.warning("Max 5 images allowed per banner");
    setBanner(Array.from(e.target.files).slice(0, maxFiles));
  };

  const handleUpload = async (bannerType, files) => {
    if (files.length === 0) return toast.warning("Select images first");

    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    formData.append("bannerType", bannerType);

    try {
      const res = await api.post("/api/v1/banner/upload-banner", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadedImages((prev) => [...prev, ...res.data.images]);
      toast.success("Images uploaded successfully");
      if (bannerType === "banner1") setBanner1Files([]);
      else setBanner2Files([]);
    } catch (error) {
      console.error(error);
      toast.error("Upload failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete("/api/v1/banner/delete", { data: { id } });
      setUploadedImages((prev) => prev.filter((img) => img._id !== id));
      toast.success("Image deleted");
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  const renderBanner = (bannerName, bannerType, files, setFiles) => {
    const alreadyUploaded = uploadedImages.filter(
      (img) => img.bannerType === bannerType
    ).length;

    return (
      <div className="bg-white/80 backdrop-blur-md rounded-xl border border-blue-200 shadow-md hover:shadow-blue-200 transition-all duration-300 p-5 mb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-blue-700 tracking-tight">
            {bannerName.toUpperCase()}
          </h2>
          <span className="text-xs text-gray-500">
            {alreadyUploaded}/5 Uploaded
          </span>
        </div>

        {/* Upload Section */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
          <label className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-blue-400 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium cursor-pointer transition-all duration-300">
            <ImagePlus size={18} />
            Choose
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileChange(e, setFiles, bannerType)}
              disabled={alreadyUploaded >= 5}
              className="hidden"
            />
          </label>

          <button
            onClick={() => handleUpload(bannerType, files)}
            disabled={files.length === 0}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium shadow-sm text-white text-sm ${
              files.length === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-md hover:scale-[1.02] transition"
            }`}
          >
            <UploadCloud size={16} />
            Upload
          </button>
        </div>

        {/* File Previews */}
        {files.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-4">
            {files.map((file, i) => (
              <div
                key={i}
                className="relative w-28 h-20 rounded-lg overflow-hidden border border-blue-200 shadow-sm hover:shadow-blue-100 transition-all duration-300"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Uploaded Images */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {uploadedImages
            .filter((img) => img.bannerType === bannerType)
            .map((img) => (
              <div
                key={img._id}
                className="relative group rounded-lg overflow-hidden border border-blue-100 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300"
              >
                <img
                  src={img.url}
                  alt="banner"
                  className="w-full h-20 object-cover"
                />
                <button
                  onClick={() => handleDelete(img._id)}
                  className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-blue-700 mb-1">
            Banner Management
          </h1>
          <p className="text-gray-600 text-xs">
            Upload, preview, and manage your promotional banners seamlessly.
          </p>
        </div>

        {renderBanner("Top Banner", "banner1", banner1Files, setBanner1Files)}
        {renderBanner("Bottom Banner", "banner2", banner2Files, setBanner2Files)}
      </div>
    </div>
  );
};

export default FillBanner;
