// src/Pages/UploadDocument.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../services/api";
import Sidebar from "../Component/Sidebar";

const UploadDocument = () => {
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await api.get("/api/v1/doc/getCategory");
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    }
    fetchCategories();
  }, []);

  const handleThumbnailChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setThumbnail(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !thumbnail) {
      alert("Both document and thumbnail are required");
      return;
    }
    setIsUploading(true);

    try {
      const { data } = await api.post("/api/v1/doc/presign", {
        filename: file.name,
        filetype: file.type,
      });

      await axios.put(data.uploadUrl, file, {
        headers: { "Content-Type": file.type },
      });

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", selectedCategory);
      formData.append("fileKey", data.fileKey);
      formData.append("thumbnail", thumbnail);

      await api.post("/api/v1/doc/saveMetadata", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Upload successful!");
      setTitle("");
      setDescription("");
      setPrice("");
      setFile(null);
      setThumbnail(null);
      setPreview(null);
      setSelectedCategory("");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">
          Upload New Document
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-3xl p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 border border-gray-100"
        >
          {/* Left side: Preview */}
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl p-6 bg-gray-50 hover:border-blue-400 hover:bg-blue-50 transition-all">
            {preview ? (
              <img
                src={preview}
                alt="Thumbnail Preview"
                className="w-64 h-64 object-cover rounded-xl shadow-lg"
              />
            ) : (
              <div className="text-center text-gray-500">
                <svg
                  className="mx-auto mb-3 w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm">No Thumbnail Selected</p>
              </div>
            )}
            <label className="mt-5 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-lg shadow transition">
              Upload Thumbnail
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Right side: Form fields */}
          <div className="space-y-6">
            {/* Document Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Document Name
              </label>
              <input
                type="text"
                placeholder="Enter document name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
              />
            </div>

            {/* Document Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Document Description
              </label>
              <textarea
                rows={3}
                placeholder="Enter short description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition resize-none"
              />
            </div>

            {/* File Upload */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files[0]) {
                  const droppedFile = e.dataTransfer.files[0];
                  if (droppedFile.type === "application/pdf") {
                    setFile(droppedFile);
                  } else alert("Please drop a PDF file");
                }
              }}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                file
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
              }`}
            >
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
                id="pdfFile"
              />
              <label htmlFor="pdfFile" className="block cursor-pointer">
                <svg
                  className="w-8 h-8 mx-auto mb-2 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <p className="font-medium text-gray-700">
                  {file ? file.name : "Drag & Drop or Click to Upload PDF"}
                </p>
              </label>
            </div>

            {/* Price and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  required
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition bg-white"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isUploading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold py-3 rounded-xl shadow-lg transition-transform transform hover:scale-[1.02] disabled:opacity-50"
            >
              {isUploading ? "Uploading..." : "Upload Document"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default UploadDocument;
