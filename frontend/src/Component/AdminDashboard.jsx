import React, { useState, useEffect } from "react";
import { PlusCircle, Trash2, FolderOpen } from "lucide-react";
import { toast } from "sonner";
import AddCategoryModal from "./AddCategoryModal";
import api from "../services/api";

const AdminDashboard = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  const handleCategoryAdded = (newCategory) => {
    setCategories([...categories, newCategory]);
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/api/v1/doc/categories/list");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      await api.delete(`/api/v1/doc/deleteCategory/${id}`);
      setCategories(categories.filter((cat) => cat._id !== id));
      toast.success("Category deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete category");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 px-6 py-10 font-poppins">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800">
          Admin <span className="text-blue-600">Dashboard</span>
        </h1>
        <button
          onClick={() => setModalOpen(true)}
          className="mt-4 sm:mt-0 flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          <PlusCircle size={20} />
          Add Category
        </button>
      </div>

      {/* Category Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-blue-100">
        <div className="flex items-center gap-3 mb-6">
          <FolderOpen className="text-blue-600" size={24} />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Categories
          </h2>
        </div>

        {/* Category List */}
        {categories.length === 0 ? (
          <p className="text-gray-500 text-center italic py-8">
            No categories added yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="flex justify-between items-center p-4 bg-gradient-to-r from-white to-blue-50 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {cat.categoryName}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    ID: {cat._id.slice(-6).toUpperCase()}
                  </p>
                </div>

                {/* Minimal Delete Icon */}
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                  title="Delete Category"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Category Modal */}
      <AddCategoryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCategoryAdded={handleCategoryAdded}
      />
    </div>
  );
};

export default AdminDashboard;
