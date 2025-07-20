import React from "react";

const SeatingPlanVisual = ({ seats }) => {
  if (!seats || seats.length === 0) {
    return <p>No seats data available.</p>;
  }

  const groupedByRow = {};

  seats.forEach((seat) => {
    const row = seat.bench.row;
    const benchNo = seat.bench.benchNumber;

    if (!groupedByRow[row]) {
      groupedByRow[row] = {};
    }

    if (!groupedByRow[row][benchNo]) {
      groupedByRow[row][benchNo] = [];
    }

    groupedByRow[row][benchNo].push(seat);
  });

  return (
    <div className="overflow-x-auto">
      {Object.keys(groupedByRow)
        .sort((a, b) => a - b)
        .map((row) => (
          <div key={row} className="flex gap-4 mb-4 items-start">
            <p className="w-12 font-semibold text-center">Row {row}</p>
            <div className="flex gap-4">
              {Object.keys(groupedByRow[row])
                .sort((a, b) => a - b)
                .map((benchNo) => (
                  <div
                    key={benchNo}
                    className="border rounded p-2 bg-gray-100 min-w-[100px] text-center"
                  >
                    <p className="font-medium mb-2">Bench {benchNo}</p>
                    {groupedByRow[row][benchNo].map((seat, idx) => (
                      <p key={idx} className="text-sm text-blue-700">
                        {seat.student.rollNumber}
                      </p>
                    ))}
                  </div>
                ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default SeatingPlanVisual;
