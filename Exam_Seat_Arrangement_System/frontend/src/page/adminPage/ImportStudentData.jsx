import React, { useState } from "react";
import * as XLSX from "xlsx";
import { FiUpload } from "react-icons/fi";

const ImportStudentData = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const mapExcelRowToStudent = (row) => ({
    studentName: (row["studentName"] || row["Student Name"] || "").trim(),
    symbolNumber: (row["symbolNumber"] || row["Symbol Number"] || "").trim(),
    regNumber: (row["regNumber"] || row["Registration Number"] || "").trim(),
    college: (row["college"] || row["College"] || "").trim(),
    courseId: Number(row["courseId"] || row["Course ID"] || 0),
    semesterId: Number(row["semesterId"] || row["Semester ID"] || 0),
    imageUrl: (row["imageUrl"] || row["Image URL"] || null),
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (
      selectedFile &&
      !["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel", "text/csv"].includes(
        selectedFile.type
      )
    ) {
      setMessage("❌ Invalid file type. Please upload XLSX, XLS or CSV file.");
      setFile(null);
      return;
    }
    setFile(selectedFile);
    setMessage("");
  };

  const validateStudents = (students) => {
    const errors = [];
    students.forEach((s, idx) => {
      if (!s.studentName) errors.push(`Row ${idx + 2}: Student Name is required.`);
      if (!s.courseId) errors.push(`Row ${idx + 2}: Course ID is required and must be a number.`);
      if (!s.semesterId) errors.push(`Row ${idx + 2}: Semester ID is required and must be a number.`);
    });
    return errors;
  };

  const handleImport = () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    setLoading(true);
    setMessage("");

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
          setMessage("❗ No data found in file.");
          setLoading(false);
          return;
        }

        const students = jsonData.map(mapExcelRowToStudent);
        const validationErrors = validateStudents(students);
        if (validationErrors.length > 0) {
          setMessage(validationErrors.join(" "));
          setLoading(false);
          return;
        }

        fetch("/api/student/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(students),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              setMessage(data.message || "✅ Students imported successfully!");
              setFile(null);
            } else {
              setMessage(data.message || "❌ Import failed.");
            }
          })
          .catch(() => {
            setMessage("❌ Error occurred during import.");
          })
          .finally(() => setLoading(false));
      } catch (err) {
        setMessage("❌ Failed to read file. Make sure it is a valid Excel or CSV file.");
        setLoading(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleReset = () => {
    setFile(null);
    setMessage("");
    setLoading(false);
  };

  const handleDownloadTemplate = () => {
    const headers = [
      ["studentName", "symbolNumber", "regNumber", "college", "courseId", "semesterId", "imageUrl"],
    ];
    const ws = XLSX.utils.aoa_to_sheet(headers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "StudentImportTemplate.xlsx");
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md mt-20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Import Students (Excel/CSV)</h2>
        <button
          onClick={handleDownloadTemplate}
          className="flex items-center gap-2 text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <FiUpload /> Download Template
        </button>
      </div>

      <input
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileChange}
        className="block w-full mb-4 border border-gray-300 rounded p-2"
      />

      <div className="flex gap-4">
        <button
          onClick={handleImport}
          disabled={loading}
          className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Importing..." : "Import"}
        </button>
        <button
          onClick={handleReset}
          disabled={loading && !file}
          className="flex-1 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Reset
        </button>
      </div>

      {message && (
        <p className="mt-6 text-center text-sm font-medium text-gray-700">{message}</p>
      )}
    </div>
  );
};

export default ImportStudentData;
