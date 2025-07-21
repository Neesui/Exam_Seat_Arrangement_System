import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const DownloadSeatingPlansButton = ({ printableId }) => {
  const handleDownload = async () => {
    const input = document.getElementById(printableId);
    if (!input) return alert("Content not found for download.");

    // Temporarily override CSS that causes problems:
    // For example, remove all oklch colors by adding a class that resets colors.
    input.classList.add("pdf-export");

    try {
      const canvas = await html2canvas(input, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "pt", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("seating-plans.pdf");
    } catch (err) {
      alert("Failed to generate PDF: " + err.message);
    } finally {
      input.classList.remove("pdf-export");
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Download Seating Plans as PDF
    </button>
  );
};

export default DownloadSeatingPlansButton;
