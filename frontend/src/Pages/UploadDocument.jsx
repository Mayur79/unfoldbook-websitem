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
  const [type, setType] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showModal, setShowModal] = useState(false); // modal toggle
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
    setThumbnail(selected);
    if (selected) setPreview(URL.createObjectURL(selected));
  };

  const handleDescriptionChange = (e) => {
    const words = e.target.value.split(/\s+/).slice(0, 20);
    setDescription(words.join(" "));
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
      formData.append("type", type);
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
      setType("");
      setFile(null);
      setThumbnail(null);
      setPreview(null);
      setSelectedCategory("");
      setShowModal(false);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
          <div className="mx-auto">
              <div className="flex gap-6">
                <Sidebar />
                <main className="flex-1">
      <button
        onClick={() => setShowModal(true)}
        className="absolute right-8 text-xs sm:text-sm text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 font-medium rounded-md sm:rounded-lg px-3 py-1.5 sm:px-5 sm:py-2 text-center cursor-pointer"
      >
        Upload Document
      </button>

            {showModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
                {/* Backdrop */}
                <div 
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                  onClick={() => !isUploading && setShowModal(false)}
                />
                
                {/* Modal Content */}
                <div className="relative bg-white rounded-3xl shadow-elegant w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
                  {/* Header with Icon */}
                  <div className=" top-0 bg-gradient-blue text-white px-8 py-6 rounded-t-3xl">
                    <button
                      onClick={() => !isUploading && setShowModal(false)}
                      disabled={isUploading}
                      className="absolute top-6 right-6 text-black/80 hover:text-black transition-colors disabled:opacity-50"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    
                    <div className="flex items-center ">
                    
                      <div>
                        <h2 className="text-2xl font-bold  text-transparent bg-clip-text bg-gradient-to-r from-[#4f46e5] to-[#22c55e]">
                          Upload Document
                        </h2>
                    
                      </div>
                    </div>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="px-8">
                    {/* Title */}
                    <div className="space-y-2">
                      <label htmlFor="title" className="block text-sm font-semibold text-gray-700">
                        Document Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="title"
                        type="text"
                        placeholder="Enter a descriptive title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        disabled={isUploading}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <label htmlFor="description" className="block text-sm font-semibold text-gray-700">
                        Description <span className="text-xs text-gray-500 font-normal">(max 20 words)</span> <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="description"
                        placeholder="Brief description of your document"
                        value={description}
                        onChange={handleDescriptionChange}
                        required
                        disabled={isUploading}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500">
                        {description.split(/\s+/).filter(Boolean).length} / 20 words
                      </p>
                    </div>

                    {/* Price and Category Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Price */}
                      <div className="space-y-2">
                        <label htmlFor="price" className="block text-sm font-semibold text-gray-700">
                          Price <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
                          <input
                            id="price"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                            disabled={isUploading}
                            className="w-full pl-8 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                        </div>
                      </div>

                      {/* Category */}
                      <div className="space-y-2">
                        <label htmlFor="category" className="block text-sm font-semibold text-gray-700">
                          Category <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="category"
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          required
                          disabled={isUploading}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all appearance-none bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 0.75rem center',
                            backgroundSize: '1.25rem'
                          }}
                        >
                          <option value="">Select a category</option>
                          {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                              {cat.categoryName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* File Uploads */}
                    <div className="space-y-4">
                      {/* PDF Upload */}
                     <div className="space-y-2 relative">
  <label htmlFor="pdf" className="block text-sm font-semibold text-gray-700">
    PDF Document <span className="text-red-500">*</span>
  </label>
  <div
    className="relative"
    onDragOver={(e) => e.preventDefault()}
    onDrop={(e) => {
      e.preventDefault();
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile.type === "application/pdf") {
          setFile(droppedFile);
        } else {
          alert("Please drop a PDF file");
        }
      }
    }}
  >
    {/* Hidden Input */}
    <input
      id="pdf"
      type="file"
      accept="application/pdf"
      onChange={(e) => setFile(e.target.files?.[0] || null)}
      className="hidden"
    />

    {/* Upload Box */}
    <label
      htmlFor="pdf"
      className={`relative flex items-center justify-center gap-3 w-full px-6 py-4 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
        file
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
      } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <svg
        className={`w-6 h-6 ${file ? "text-blue-600" : "text-gray-400"}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
      <div className="text-left">
        <p className={`font-semibold ${file ? "text-blue-700" : "text-gray-700"}`}>
          {file ? file.name : "Click to upload PDF"}
        </p>
        {!file && <p className="text-xs text-gray-500 mt-1">PDF files only</p>}
      </div>

      {/* ❌ Clear Button */}
      {file && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setFile(null);
          }}
          className="absolute -top-4 -right-1 text-black rounded-full text-3xl flex items-center justify-center"
        >
          ×
        </button>
      )}
    </label>
  </div>
</div>


                      {/* Thumbnail Upload */}
                   <div className="space-y-2 relative">
  <label htmlFor="thumbnail" className="block text-sm font-semibold text-gray-700">
    Thumbnail Image <span className="text-red-500">*</span>
  </label>
  <div
    className="relative"
    onDragOver={(e) => e.preventDefault()}
    onDrop={(e) => {
      e.preventDefault();
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile.type.startsWith("image/")) {
          setThumbnail(droppedFile);
          setPreview(URL.createObjectURL(droppedFile));
        } else {
          alert("Please drop an image file");
        }
      }
    }}
  >
    <input
      id="thumbnail"
      type="file"
      accept="image/*"
      onChange={handleThumbnailChange}
      disabled={isUploading}
      className="hidden"
    />

    <label
      htmlFor="thumbnail"
      className={`relative flex items-center justify-center gap-3 w-full px-6 py-4 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
        thumbnail
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
      } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <svg
        className={`w-6 h-6 ${thumbnail ? "text-blue-600" : "text-gray-400"}`}
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
      <div className="text-left">
        <p className={`font-semibold ${thumbnail ? "text-blue-700" : "text-gray-700"}`}>
          {thumbnail ? thumbnail.name : "Click to upload thumbnail"}
        </p>
        {!thumbnail && (
          <p className="text-xs text-gray-500 mt-1">JPG, PNG, GIF up to 10MB</p>
        )}
      </div>

      {/* ❌ Clear Button */}
      {thumbnail && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setThumbnail(null);
            setPreview(null);
          }}
   className="absolute -top-4 -right-1 text-black rounded-full text-3xl flex items-center justify-center"
        >
          ×
        </button>
      )}
    </label>
  </div>

 
</div>


                      {/* Thumbnail Preview */}
                      {preview && (
                        <div className="flex justify-center pt-2 animate-slide-up">
                          <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-blue rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                            <img
                              src={preview}
                              alt="Thumbnail Preview"
                              className="relative w-40 h-40 object-cover rounded-2xl border-4 border-white shadow-elegant transition-transform group-hover:scale-105"
                            />
                            <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-lg shadow-soft">
                              Preview
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isUploading}
                      className="w-full bg-gradient-blue text-white font-bold py-4 rounded-xl shadow-blue hover:shadow-elegant transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                    >
                      {isUploading ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Uploading...
                        </>
                      ) : (
                        <>
                        <div className="w-full text-xs sm:text-sm text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 font-medium rounded-md sm:rounded-lg px-3 py-1.5 sm:px-5 sm:py-2 text-center cursor-pointer">
    Upload Document
                        </div>
                      
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            )}
        </main>
        </div>
      </div>
    </div>
  );
};

export default UploadDocument;
