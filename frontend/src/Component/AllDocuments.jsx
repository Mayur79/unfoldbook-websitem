// src/Pages/AllDocuments.jsx
import React, { useState } from "react";
import { List, Grid, Folder, FileText, ArrowLeft } from "lucide-react";

export default function AllDocuments() {
  const [view, setView] = useState("grid");
  const [currentFolder, setCurrentFolder] = useState(null);

  // === Folder and File Data ===
  const folders = [
    {
      name: "Finance",
      files: [
        { name: "Invoice_July.pdf", size: "2.4 MB", created: "2025-07-12" },
        { name: "Expense_Report.xlsx", size: "1.8 MB", created: "2025-07-30" },
      ],
    },
    {
      name: "Projects",
      files: [
        { name: "Project_Plan.docx", size: "1.2 MB", created: "2025-06-05" },
        { name: "Presentation.pptx", size: "3.1 MB", created: "2025-09-10" },
        { name: "Client_Contract.pdf", size: "4.8 MB", created: "2025-08-21" },
      ],
    },
    {
      name: "HR",
      files: [
        { name: "Employee_List.csv", size: "560 KB", created: "2025-05-12" },
        { name: "Leave_Record.pdf", size: "980 KB", created: "2025-04-23" },
      ],
    },
  ];

  // Active files inside folder
  const files = currentFolder ? currentFolder.files : [];

  const handleDelete = (name) => {
    alert(`Delete clicked for "${name}"`);
  };

  return (
    <div className="p-4">
      {/* ===== Header ===== */}
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-3">
          {currentFolder && (
            <button
              onClick={() => setCurrentFolder(null)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <h2 className="text-lg font-semibold text-gray-800">
            {currentFolder ? currentFolder.name : "All Documents"}
          </h2>
        </div>

        {/* View Toggle */}
        <button
          onClick={() => setView(view === "grid" ? "list" : "grid")}
          className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
        >
          {view === "grid" ? <List size={18} /> : <Grid size={18} />}
        </button>
      </div>

      {/* ===== GRID VIEW ===== */}
      {view === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentFolder
            ? // Inside folder: show files
              files.map((file, i) => (
                <div
                  key={i}
                  className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start w-full">
                    <FileText className="text-emerald-600" size={24} />
                    <i
                      className="bx bx-trash text-red-500 text-xl hover:text-red-600 transition cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(file.name);
                      }}
                    ></i>
                  </div>
                  <div className="mt-2 font-medium text-gray-800 truncate w-full">
                    {file.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {file.size} • {file.created}
                  </div>
                </div>
              ))
            : // Outside folder: show folder list
              folders.map((folder, i) => (
                <div
                  key={i}
                  onClick={() => setCurrentFolder(folder)}
                  className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start w-full">
                    <Folder className="text-emerald-600" size={24} />
                    <i
                      className="bx bx-trash text-red-500 text-xl hover:text-red-600 transition cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(folder.name);
                      }}
                    ></i>
                  </div>
                  <div className="mt-2 font-medium text-gray-800">
                    {folder.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {folder.files.length} files
                  </div>
                </div>
              ))}
        </div>
      ) : (
        // ===== LIST VIEW =====
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm text-gray-600">
                {currentFolder ? "File Name" : "Folder Name"}
              </th>
              <th className="px-4 py-2 text-left text-sm text-gray-600">
                {currentFolder ? "Size" : "Items"}
              </th>
              <th className="px-4 py-2 text-left text-sm text-gray-600">
                {currentFolder ? "Date Created" : "Type"}
              </th>
              <th className="px-4 py-2 text-center text-sm text-gray-600">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {currentFolder
              ? files.map((file, i) => (
                  <tr
                    key={i}
                    className="border-t border-gray-100 hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-4 py-2 flex items-center gap-2 text-gray-800">
                      <FileText className="text-emerald-600" size={16} />
                      {file.name}
                    </td>
                    <td className="px-4 py-2 text-gray-600">{file.size}</td>
                    <td className="px-4 py-2 text-gray-600">{file.created}</td>
                    <td className="px-4 py-2 text-center">
                      <i
                        className="bx bx-trash text-red-500 text-xl hover:text-red-600 transition cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(file.name);
                        }}
                      ></i>
                    </td>
                  </tr>
                ))
              : folders.map((folder, i) => (
                  <tr
                    key={i}
                    onClick={() => setCurrentFolder(folder)}
                    className="border-t border-gray-100 hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-4 py-2 flex items-center gap-2 text-gray-800">
                      <Folder className="text-emerald-600" size={16} />
                      {folder.name}
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      {folder.files.length} files
                    </td>
                    <td className="px-4 py-2 text-gray-600">Folder</td>
                    <td className="px-4 py-2 text-center">
                      <i
                        className="bx bx-trash text-red-500 text-xl hover:text-red-600 transition cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(folder.name);
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
