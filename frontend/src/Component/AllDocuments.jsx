// src/Pages/AllDocuments.jsx
import React, { useState, useEffect } from "react";
import { List, Grid, Folder, FileText, ArrowLeft } from "lucide-react";
import api from "../services/api";
import { Toaster, toast } from "sonner";

export default function AllDocuments() {
  const [view, setView] = useState("grid");
  const [categories, setCategories] = useState([]);
  const [files, setFiles] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [loading, setLoading] = useState(false);

  // === Folder and File Data ===
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/doc/categories/list");
      setCategories(res.data);
    } catch (error) {
      console.error("Failed to load categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async (category) => {
    try {
      setLoading(true);
      const res = await api.get(`/api/v1/doc/documents/${category._id}`);
      setFiles(res.data);
      setCurrentFolder(category);
    } catch (error) {
      console.error("Failed to load documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item, type) => {
    const name = type === "folder" ? item.categoryName : item.title;
    if (!window.confirm(`Delete ${type} "${name}"?`)) return;

    try {
      setLoading(true);
      toast.loading(`Deleting ${type}...`, { id: "delete" });

      await api.delete(`/api/v1/doc/delete/${type}/${item._id}`);

      if (type === "folder") {
        fetchCategories();
        toast.success(`Folder "${name}" deleted`, { id: "delete" });
      } else {
        fetchDocuments(currentFolder);
        toast.success(`File "${name}" deleted`, { id: "delete" });
      }
    } catch (error) {
      console.error(error);
      toast.error(`Failed to delete ${type}`, { id: "delete" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <Toaster />
      {/* ===== Header ===== */}
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-3">
          {currentFolder && (
            <button
              onClick={() => {
                setCurrentFolder(null);
                setFiles([]);
              }}
              className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <h2 className="text-lg font-semibold text-gray-800">
            {currentFolder ? currentFolder.categoryName : "All Documents"}
          </h2>
        </div>

        <button
          onClick={() => setView(view === "grid" ? "list" : "grid")}
          className="p-2 bg-blue-50 rounded-lg hover:bg-blue-100 text-blue-600 transition"
        >
          {view === "grid" ? <List size={18} /> : <Grid size={18} />}
        </button>
      </div>

      {/* ===== Content ===== */}
      {loading ? (
        <div className="text-center text-gray-500 py-10">Loading...</div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentFolder
            ? // Inside folder — show files
              files.map((file) => (
                <div
                  key={file._id}
                  className="p-4 border border-blue-100 rounded-xl bg-white shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between hover:-translate-y-1"
                >
                  <div className="flex justify-between items-start w-full">
                    <FileText className="text-blue-600" size={24} />
                    <i
                      className="bx bx-trash text-red-500 text-xl hover:text-red-600 transition cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(file, "file");
                      }}
                    ></i>
                  </div>
                  <div className="mt-2 font-medium text-gray-800 truncate w-full">
                    {file.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {file.type || "—"} •{" "}
                    {new Date(file.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            : // Outside folder — show categories
              categories.map((category) => (
                <div
                  key={category._id}
                  onClick={() => fetchDocuments(category)}
                  className="p-4 border border-blue-100 rounded-xl bg-white shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between hover:-translate-y-1"
                >
                  <div className="flex justify-between items-start w-full">
                    <Folder className="text-blue-600" size={24} />
                    <i
                      className="bx bx-trash text-red-500 text-xl hover:text-red-600 transition cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(category, "folder");
                      }}
                    ></i>
                  </div>
                  <div className="mt-2 font-medium text-gray-800">
                    {category.categoryName}
                  </div>
                </div>
              ))}
        </div>
      ) : (
        // ===== List View =====
        <table className="min-w-full bg-white border border-blue-100 rounded-lg shadow-sm">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm text-gray-600">
                {currentFolder ? "File Name" : "Category Name"}
              </th>
              <th className="px-4 py-2 text-left text-sm text-gray-600">
                {currentFolder ? "Type" : "Created"}
              </th>
              <th className="px-4 py-2 text-center text-sm text-gray-600">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {currentFolder
              ? files.map((file) => (
                  <tr
                    key={file._id}
                    className="border-t border-blue-50 hover:bg-blue-50 cursor-pointer"
                  >
                    <td className="px-4 py-2 flex items-center gap-2 text-gray-800">
                      <FileText className="text-blue-600" size={16} />
                      {file.title}
                    </td>
                    <td className="px-4 py-2 text-gray-600">{file.type}</td>
                    <td className="px-4 py-2 text-center">
                      <i
                        className="bx bx-trash text-red-500 text-xl hover:text-red-600 transition cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(file, "file");
                        }}
                      ></i>
                    </td>
                  </tr>
                ))
              : categories.map((cat) => (
                  <tr
                    key={cat._id}
                    onClick={() => fetchDocuments(cat)}
                    className="border-t border-blue-50 hover:bg-blue-50 cursor-pointer"
                  >
                    <td className="px-4 py-2 flex items-center gap-2 text-gray-800">
                      <Folder className="text-blue-600" size={16} />
                      {cat.categoryName}
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      {new Date(cat.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <i
                        className="bx bx-trash text-red-500 text-xl hover:text-red-600 transition cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(cat, "folder");
                        }}
                      ></i>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
