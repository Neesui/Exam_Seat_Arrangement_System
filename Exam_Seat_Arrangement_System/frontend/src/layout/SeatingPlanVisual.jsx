import React from "react";
import { useGetBenchesQuery } from "../redux/api/benchApi";

const SeatingPlanVisual = ({ seats }) => {
  const { data: benchesData, isLoading, error } = useGetBenchesQuery();

  if (isLoading) return <p>Loading benches...</p>;
  if (error) return <p className="text-red-600">Failed to load benches</p>;

  // Map students by bench and position (e.g., LEFT, RIGHT, Center or position number)
  const benchStudentMap = {};
  seats.forEach(({ bench, position, student }) => {
    if (!benchStudentMap[bench.id]) {
      benchStudentMap[bench.id] = {};
    }
    benchStudentMap[bench.id][position] = student;
  });

  // Prepare benches array with students mapped
  const benchesWithStudents = benchesData?.data?.map((bench) => ({
    id: bench.id,
    row: bench.row,
    column: bench.column,
    capacity: bench.capacity,
    studentsByPosition: benchStudentMap[bench.id] || {},
  })) || [];

  // Assign colors per college for visual distinction
  const collegeColors = {
    "College A": "bg-red-600 text-white",
    "College B": "bg-blue-500 text-white",
    // add more if needed
  };

  return (
    <div className="flex flex-col gap-6 items-center">
      {benchesWithStudents.map((bench, idx) => (
        <div key={bench.id} className="flex flex-col items-center">
          <div className="flex border rounded overflow-hidden">
            {/* For each seat in bench capacity */}
            {Array.from({ length: bench.capacity }).map((_, seatIdx) => {
              // position keys in your data may vary, here assuming seat positions are numbered 1, 2, etc.
              const position = seatIdx + 1;
              const student = bench.studentsByPosition[position];

              if (!student) {
                // Empty seat
                return (
                  <div
                    key={seatIdx}
                    className="w-40 h-24 flex flex-col justify-center items-center bg-gray-200 border-r last:border-r-0"
                  >
                    <span className="text-gray-500 font-semibold">Empty</span>
                  </div>
                );
              }

              const collegeName = student.college || "Unknown College";
              const symbolNum = student.symbolNumber || student.symbolNum || "N/A";
              const colorClass = collegeColors[collegeName] || "bg-gray-400 text-black";

              return (
                <div
                  key={seatIdx}
                  className={`w-40 h-24 flex flex-col justify-center items-center border-r last:border-r-0 px-2 ${colorClass}`}
                >
                  <div className="font-bold text-lg">{collegeName}</div>
                  <div className="text-md mt-2">Symbol num {symbolNum}</div>
                </div>
              );
            })}
          </div>
          <div className="mt-2 font-semibold text-blue-600">bench {idx + 1}</div>
        </div>
      ))}
    </div>
  );
};

export default SeatingPlanVisual;
