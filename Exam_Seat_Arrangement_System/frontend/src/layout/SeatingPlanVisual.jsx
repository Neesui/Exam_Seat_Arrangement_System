import React from "react";

const SeatingPlanVisual = ({ seatPlan }) => {
  if (!seatPlan || seatPlan.length === 0) {
    return <p className="text-center text-gray-500 italic">No seating data available.</p>;
  }

  const groupedByRoom = {};

  seatPlan.forEach((seat) => {
    const roomNo = seat.bench?.room?.roomNumber;
    const row = seat.bench?.row;
    const benchNo = seat.bench?.benchNo;

    if (!roomNo || row == null || benchNo == null) return;

    if (!groupedByRoom[roomNo]) groupedByRoom[roomNo] = {};
    if (!groupedByRoom[roomNo][row]) groupedByRoom[roomNo][row] = {};
    if (!groupedByRoom[roomNo][row][benchNo]) groupedByRoom[roomNo][row][benchNo] = [];

    groupedByRoom[roomNo][row][benchNo].push(seat);
  });

  return (
    <div className="space-y-10">
      {Object.keys(groupedByRoom).map((roomNo) => (
        <div key={roomNo} className="border border-gray-300 p-4 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-center mb-6">Room: {roomNo}</h2>

          {Object.keys(groupedByRoom[roomNo])
            .sort((a, b) => Number(a) - Number(b))
            .map((row) => (
              <div key={row} className="mb-10">
                <h3 className="text-lg font-semibold mb-4">Row: {row}</h3>
                <div className="flex flex-wrap gap-8 justify-center">
                  {Object.keys(groupedByRoom[roomNo][row])
                    .sort((a, b) => Number(a) - Number(b))
                    .map((benchNo) => {
                      const seats = groupedByRoom[roomNo][row][benchNo];

                      return (
                        <div key={benchNo} className="flex flex-col items-center">
                          <div className="flex">
                            {seats
                              .sort((a, b) => a.position - b.position)
                              .map((seat, idx) => (
                                <div
                                  key={seat.id}
                                  className={`w-40 h-24 flex flex-col justify-center items-center text-white font-semibold text-sm px-2 py-1 ${
                                    idx % 2 === 0 ? "bg-red-600" : "bg-blue-700"
                                  }`}
                                >
                                  <p className="text-center">{seat.student.college}</p>
                                  <p className="text-center">{seat.student.symbolNo}</p>
                                </div>
                              ))}
                          </div>
                          <p className="text-blue-800 font-bold text-lg mt-2">
                            Bench {benchNo}
                          </p>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

export default SeatingPlanVisual;
