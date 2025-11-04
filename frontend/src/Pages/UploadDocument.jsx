// src/Pages/UploadDocument.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../services/api";
import { toast } from "sonner";
const UploadDocument = () => {
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);
const [originalPrice, setOriginalPrice] = useState("");
const [discountPercent, setDiscountPercent] = useState("");
const [finalPrice, setFinalPrice] = useState("");
const [extraImages, setExtraImages] = useState([]); // 4–5 images
const [extraPreviews, setExtraPreviews] = useState([]);

useEffect(() => {
  if (originalPrice && discountPercent) {
    const discount = (Number(originalPrice) * Number(discountPercent)) / 100;
    const final = Number(originalPrice) - discount;
    setFinalPrice(final.toFixed(2));
  } else {
    setFinalPrice(originalPrice || "");
  }
}, [originalPrice, discountPercent]);
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await api.get("/api/v1/doc/categories/list");
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

  const handleExtraImagesChange = (e) => {
  const files = Array.from(e.target.files);
  if (files.length > 5) {
    toast.warning("You can upload up to 5 extra images only");
    return;
  }
  setExtraImages(files);
  setExtraPreviews(files.map((f) => URL.createObjectURL(f)));
};
 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!file || !thumbnail) {
    toast.warning("Both document and thumbnail are required");
    return;
  }
  setIsUploading(true);

  try {
    // 1️⃣ Get presigned URL for main document
    const { data: docData } = await api.post("/api/v1/doc/presign", {
      filename: file.name,
      filetype: file.type,
      uploadType: "document",
    });

    // Upload PDF file to S3
    await axios.put(docData.uploadURL, file, {
      headers: { "Content-Type": file.type },
    });

    // 2️⃣ Get presigned URL for thumbnail
    const { data: thumbData } = await api.post("/api/v1/doc/presign", {
      filename: thumbnail.name,
      filetype: thumbnail.type,
      uploadType: "thumbnail",
    });

    // Upload thumbnail image
    await axios.put(thumbData.uploadURL, thumbnail, {
      headers: { "Content-Type": thumbnail.type },
    });

    // 3️⃣ Upload extra images (if any)
    const extraImageKeys = [];
    for (const img of extraImages) {
      const { data: imgData } = await api.post("/api/v1/doc/presign", {
        filename: img.name,
        filetype: img.type,
        uploadType: "image",
      });

      await axios.put(imgData.uploadURL, img, {
        headers: { "Content-Type": img.type },
      });

      extraImageKeys.push(imgData.fileKey);
    }

    // 4️⃣ Save metadata
    const formData = {
      title,
      description,
      originalPrice,
      discountPercent,
      finalPrice,
      category: selectedCategory,
      fileKey: docData.fileKey,
      thumbnailKey: thumbData.fileKey,
      extraImageKeys,
    };

    await api.post("/api/v1/doc/saveMetadata", formData);

    toast.success("Upload successful!");
    setTitle("");
    setDescription("");
    setOriginalPrice("");
    setDiscountPercent("");
    setFinalPrice("");
    setFile(null);
    setThumbnail(null);
    setPreview(null);
    setExtraImages([]);
    setExtraPreviews([]);
    setSelectedCategory("");
  } catch (error) {
    console.error("Upload error:", error);
    toast.error("Upload failed. Please try again.");
  } finally {
    setIsUploading(false);
  }
};


  return (
    <div className="flex bg-gray-50 min-h-screen">
    
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
                  } else toast.warning("Please drop a PDF file");
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
            {/* Extra Images Upload */}
<div className="border-2 border-dashed border-gray-300 rounded-2xl p-4 bg-gray-50">
  <p className="font-semibold text-gray-700 mb-2">Additional Images (max 5)</p>
  <div className="flex flex-wrap gap-3">
    {extraPreviews.map((img, i) => (
      <img
        key={i}
        src={img}
        alt={`Extra ${i}`}
        className="w-24 h-24 object-cover rounded-lg shadow-sm"
      />
    ))}
    <label className="flex items-center justify-center w-24 h-24 bg-blue-100 text-blue-600 rounded-lg cursor-pointer hover:bg-blue-200">
      +
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleExtraImagesChange}
        className="hidden"
      />
    </label>
  </div>
</div>


            {/* Price and Category */}
         {/* Price and Category Section */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* Original Price */}
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">
      Original Price
    </label>
    <input
      type="number"
      placeholder="Enter original price"
      value={originalPrice}
      onChange={(e) => setOriginalPrice(e.target.value)}
      required
      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
    />
  </div>

  {/* Discount (%) */}
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">
      Discount (%)
    </label>
    <input
      type="number"
      placeholder="Enter discount percentage"
      value={discountPercent}
      onChange={(e) => setDiscountPercent(e.target.value)}
      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
    />
  </div>

  {/* Final Price (auto-calculated) */}
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">
      Final Price
    </label>
    <input
      type="text"
      value={finalPrice}
      readOnly
      className="w-full bg-gray-100 border-2 border-gray-200 rounded-xl px-4 py-3 outline-none text-gray-700 font-semibold"
    />
  </div>

  {/* Category */}
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">
      Category
    </label>
    <select
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)}
      required
      className="z-50 w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition bg-white"
    >
      <option value="">Select category</option>
      {categories.map((cat) => (
        <option key={cat._id} value={cat._id} className="z-50">
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