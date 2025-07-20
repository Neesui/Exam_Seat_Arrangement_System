import React from "react";

const SeatingPlanVisual = ({ seats }) => {
  // Group seats by benchId
  const benchesMap = {};

  seats.forEach((seat) => {
    const benchId = seat.bench.id;
    if (!benchesMap[benchId]) {
      benchesMap[benchId] = {
        bench: seat.bench,
        students: [],
      };
    }

    benchesMap[benchId].students[seat.position - 1] = seat.student;
  });

  const benches = Object.values(benchesMap);

  const getColor = (index) =>
    index === 0 ? "bg-red-600" : "bg-blue-700"; // 1st = red, 2nd = blue

  return (
    <div className="flex flex-wrap gap-6">
      {benches.map((benchData, index) => (
        <div key={benchData.bench.id} className="flex flex-col items-center">
          {/* Bench with two students */}
          <div className="flex w-60 h-20 rounded overflow-hidden shadow border">
            {benchData.students.map((student, idx) => (
              <div
                key={idx}
                className={`flex-1 ${getColor(idx)} text-white text-xs flex flex-col items-center justify-center font-semibold p-1`}
              >
                <div>College ({student.college})</div>
                <div>{student.symbolNumber}</div>
              </div>
            ))}
          </div>
          {/* Bench label below */}
          <div className="mt-1 font-bold text-blue-700">Bench {index + 1}</div>
        </div>
      ))}
    </div>
  );
};

export default SeatingPlanVisual;
