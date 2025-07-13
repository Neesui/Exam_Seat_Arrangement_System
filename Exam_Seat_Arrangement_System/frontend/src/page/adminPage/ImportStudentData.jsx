import React, { useState } from "react";
import * as XLSX from "xlsx";

const ImportStudentData = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Map Excel/CSV row headers to student object keys
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
      setMessage("Invalid file type. Please upload XLSX, XLS or CSV file.");
      setFile(null);
      return;
    }
    setFile(selectedFile);
    setMessage("");
  };

  const validateStudents = (students) => {
    const errors = [];
    students.forEach((s, idx) => {
      if (!s.studentName) errors.push(`Row ${idx + 2}: studentName is required.`);
      if (!s.courseId) errors.push(`Row ${idx + 2}: courseId is required and must be a number.`);
      if (!s.semesterId) errors.push(`Row ${idx + 2}: semesterId is required and must be a number.`);
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
          setMessage("No data found in file.");
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
              setMessage(data.message || "Students imported successfully!");
              setFile(null);
            } else {
              setMessage(data.message || "Import failed.");
            }
          })
          .catch(() => {
            setMessage("Error occurred during import.");
          })
          .finally(() => setLoading(false));
      } catch (err) {
        setMessage("Failed to read file. Make sure it is a valid Excel or CSV file.");
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

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Import Students (Excel/CSV)</h2>
      <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileChange} />
      <div className="mt-4 flex space-x-2">
        <button
          onClick={handleImport}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Importing..." : "Import"}
        </button>
        <button
          onClick={handleReset}
          disabled={loading && !file}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Reset
        </button>
      </div>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
};

export default ImportStudentData;
