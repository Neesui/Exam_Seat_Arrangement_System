// ✅ ViewSeatPlanDetails.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { useGetSeatPlanByExamQuery } from "../../redux/api/seatPlanApi";

const ViewSeatPlanDetails = () => {
  const { examId } = useParams();
  const { data, isLoading, error } = useGetSeatPlanByExamQuery(examId);

  return (
    <div className="ml-8 mt-20 bg-white p-6 rounded-lg shadow-md w-[99%] max-w-screen-lg mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Seating Plan Details</h2>

      {isLoading ? (
        <p>Loading seating plan...</p>
      ) : error ? (
        <p className="text-red-500">Failed to load seating plan.</p>
      ) : !data?.seatingPlan?.seats?.length ? (
        <p className="text-gray-500 text-center">No seat assignments found.</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">S.N.</th>
              <th className="border px-4 py-2">Student Name</th>
              <th className="border px-4 py-2">College</th>
              <th className="border px-4 py-2">Room</th>
              <th className="border px-4 py-2">Bench</th>
              <th className="border px-4 py-2">Position</th>
            </tr>
          </thead>
          <tbody>
            {data.seatingPlan.seats.map((seat, index) => (
              <tr key={seat.id}>
                <td className="border px-4 py-2 text-center">{index + 1}</td>
                <td className="border px-4 py-2 text-center">{seat.student?.studentName || "-"}</td>
                <td className="border px-4 py-2 text-center">{seat.student?.college || "-"}</td>
                <td className="border px-4 py-2 text-center">{seat.bench?.room?.roomNumber || "-"}</td>
                <td className="border px-4 py-2 text-center">Bench-{seat.bench?.benchNo || "-"}</td>
                <td className="border px-4 py-2 text-center">{seat.position}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewSeatPlanDetails;
