import React from "react";
import { Wallet, Info } from "lucide-react";
import AddCategoryModal from "./AddCategoryModal";
import { useState } from "react";
import { useEffect } from "react";
import api from "../services/api";
import { toast } from "sonner";
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
      toast.success("Categories delete successfully")
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete category");
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
       <button
        className="px-4 py-2 bg-green-500 text-white rounded"
        onClick={() => setModalOpen(true)}
      >
        Add Category
      </button>


      <ul className="mt-4">
        {categories.map((cat) => (
          <li key={cat._id} className="flex justify-between items-center mb-2">
            {cat.categoryName}
            <button
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={() => handleDelete(cat._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <AddCategoryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCategoryAdded={handleCategoryAdded}
      />
    </div>
  );
};

export default AdminDashboard;
