import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const ImportStudentData = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  // Change this mapping according to your Excel headers
  const mapExcelRowToStudent = (row) => ({
    studentName: row['studentName'] || row['Student Name'] || '',
    symbolNumber: row['symbolNumber'] || row['Symbol Number'] || '',
    regNumber: row['regNumber'] || row['Registration Number'] || '',
    college: row['college'] || row['College'] || '',
    courseId: Number(row['courseId'] || row['Course ID'] || 0),
    semesterId: Number(row['semesterId'] || row['Semester ID'] || 0),
    imageUrl: row['imageUrl'] || row['Image URL'] || null,
  });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
  };

  const handleImport = () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      // Parse first sheet
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (jsonData.length === 0) {
        setMessage('No data found in file.');
        return;
      }

      // Map rows to expected student data format
      const students = jsonData.map(mapExcelRowToStudent);

      // Optional: Validate required fields (e.g., studentName, courseId)
      const invalidRows = students.filter(
        (s) => !s.studentName || !s.courseId || !s.semesterId
      );
      if (invalidRows.length > 0) {
        setMessage('Some rows are missing required fields (studentName, courseId, semesterId).');
        return;
      }

      // Send to backend
      fetch('/api/students/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(students),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setMessage(data.message || 'Students imported successfully!');
          } else {
            setMessage(data.message || 'Import failed.');
          }
        })
        .catch((error) => {
          console.error(error);
          setMessage('Error occurred during import.');
        });
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Import Students (Excel/CSV)</h2>
      <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileChange} />
      <button
        onClick={handleImport}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Import
      </button>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
};

export default ImportStudentData;
