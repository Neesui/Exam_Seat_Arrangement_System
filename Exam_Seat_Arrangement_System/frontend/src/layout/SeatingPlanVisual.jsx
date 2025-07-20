import React from "react";

const SeatingPlanVisual = ({ seatPlan }) => {
  if (!seatPlan || seatPlan.length === 0) {
    return <p className="text-center text-gray-500 italic">No seating data available.</p>;
  }

  // Group seats by room -> row -> bench
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

  // Color helper matching bench capacity
  const getColorsForCapacity = (capacity) => {
    const colors = {
      2: ["bg-red-400", "bg-blue-400"],
      3: ["bg-pink-300", "bg-purple-400", "bg-rose-400"],
      4: ["bg-yellow-400", "bg-green-400", "bg-orange-400", "bg-indigo-400"],
    };
    return colors[capacity] || ["bg-gray-400"];
  };

  return (
    <div className="space-y-10">
      {Object.keys(groupedByRoom).map((roomNo) => (
        <div key={roomNo} className="border border-gray-300 p-4 rounded-lg shadow">
          {Object.keys(groupedByRoom[roomNo])
            .sort((a, b) => Number(a) - Number(b))
            .map((row) => {
              const benches = groupedByRoom[roomNo][row];
              const benchNosSorted = Object.keys(benches).sort((a, b) => Number(a) - Number(b));

              return (
                <div key={row} className="mb-10">
                  <h3 className="text-lg font-semibold mb-4">Row: {row}</h3>

                  {/* Benches container */}
                  <div className="flex flex-wrap justify-center gap-8">
                    {benchNosSorted.map((benchNo) => {
                      const seats = benches[benchNo];
                      const benchCapacity = seats[0]?.bench?.capacity || 2;

                      // Fill with dummy seats if not full
                      const fullBench = [...seats];
                      while (fullBench.length < benchCapacity) {
                        fullBench.push({
                          id: `dummy-${benchNo}-${fullBench.length}`,
                          dummy: true,
                        });
                      }

                      const colors = getColorsForCapacity(benchCapacity);

                      return (
                        <div
                          key={benchNo}
                          className="flex flex-col items-center"
                          style={{ minWidth: benchCapacity * 64 }}
                        >
                          {/* Seats inside bench */}
                          <div className="flex">
                            {fullBench.map((seat, idx) => (
                              <div
                                key={seat.id}
                                className={`w-27 h-16 flex flex-col justify-center items-center text-black font-semibold text-xs ${
                                  colors[idx % colors.length]
                                }`}
                                style={{ padding: 0, margin: 0, borderRadius: 0 }}
                              >
                                {seat.dummy ? (
                                  <p className="text-center">DUMMY</p>
                                ) : (
                                  <>
                                    <p className="text-center">{seat.student.college}</p>
                                    <p className="text-center">{seat.student.symbolNumber}</p>
                                  </>
                                )}
                              </div>
                            ))}
                          </div>

                          <p className="text-gray-700 font-bold text-sm mt-2">Bench {benchNo}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>
      ))}
    </div>
  );
};

export default SeatingPlanVisual;
