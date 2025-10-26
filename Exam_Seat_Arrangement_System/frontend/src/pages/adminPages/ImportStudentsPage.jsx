import React, { useState } from "react";
import { useImportStudentsMutation } from "../../redux/api/studentApi";
import { toast } from "react-toastify";

const ImportStudentsPage = () => {
  const [excelFile, setExcelFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [importStudents] = useImportStudentsMutation();

  // Handle Excel file selection
  const handleExcelChange = (e) => {
    setExcelFile(e.target.files[0]);
  };

  // Handle import submit
  const handleImport = async (e) => {
    e.preventDefault();

    if (!excelFile) {
      toast.error("Please select an Excel file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", excelFile);

    try {
      setIsUploading(true);
      const res = await importStudents(formData).unwrap();

      toast.success(res.message || "Students imported successfully!");
      setExcelFile(null);
      e.target.reset();
    } catch (err) {
      console.error("Import Error:", err);
      toast.error(err?.data?.message || "Failed to import students.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-[99%]  mt-3 p-6 ml-2 bg-white rounded shadow">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          📚 Import Students (Excel File)
        </h2>

        <form onSubmit={handleImport} className="space-y-6">
          {/* Excel Upload */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Excel File
            </label>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleExcelChange}
              className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none p-2"
            />
            {excelFile && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: <span className="font-medium">{excelFile.name}</span>
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isUploading}
            className={`w-full py-3 text-white font-semibold rounded-lg transition ${
              isUploading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isUploading ? "Uploading..." : "Import Students"}
          </button>
        </form>

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          <p className="font-semibold mb-1">📋 Excel Format Required:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>studentName</li>
            <li>symbolNumber</li>
            <li>regNumber</li>
            <li>college</li>
            <li>courseName</li>
            <li>batchYear</li>
            <li>semesterNum</li>
            <li>email</li>
            <li>imageUrl or imageFileName</li>
          </ul>
          <p className="mt-2">
            💡 The <strong>imageUrl</strong> or <strong>imageFileName</strong>{" "}
            column should contain either a full image URL or the image file name
            stored on the server.
          </p>
        </div>
    </div>
  );
};

export default ImportStudentsPage;
