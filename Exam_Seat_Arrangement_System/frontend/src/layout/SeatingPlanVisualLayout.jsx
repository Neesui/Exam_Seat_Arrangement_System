import React from "react";

const SeatingPlanVisualLayout = ({ seatPlan }) => {
  if (!seatPlan || seatPlan.length === 0) {
    return (
      <p className="text-center text-gray-500 italic">
        No seating data available.
      </p>
    );
  }

  const groupedByRoom = {};

  seatPlan.forEach((seat) => {
    const roomNo = seat.bench?.room?.roomNumber;
    const row = seat.bench?.row;
    const benchNo = seat.bench?.benchNo;

    if (!roomNo || row == null || benchNo == null) return;

    if (!groupedByRoom[roomNo]) groupedByRoom[roomNo] = {};
    if (!groupedByRoom[roomNo][row]) groupedByRoom[roomNo][row] = {};
    if (!groupedByRoom[roomNo][row][benchNo])
      groupedByRoom[roomNo][row][benchNo] = [];

    groupedByRoom[roomNo][row][benchNo].push(seat);
  });

  const getColorsForCapacity = (capacity) => {
    const colors = {
      2: ["#129990", "#000957"],
      3: ["#129990", "#4A9782", "#000957"],
      4: ["#129990", "#4A9782", "#687FE5", "#000957"],
    };
    return colors[capacity] || ["#CCCCCC"];
  };

  return (
    <div className="space-y-10">
      {Object.keys(groupedByRoom).map((roomNo) => (
        <div
          key={roomNo}
          className="border border-gray-300 p-4 rounded-lg shadow"
        >
          <h3 className="text-xl font-bold text-center mb-6">
            Room {roomNo}
          </h3>

          {Object.keys(groupedByRoom[roomNo])
            .sort((a, b) => Number(a) - Number(b))
            .map((row) => {
              const benches = groupedByRoom[roomNo][row];
              const benchNosSorted = Object.keys(benches).sort(
                (a, b) => Number(a) - Number(b)
              );

              return (
                <div key={row} className="mb-3 ">
                  <div className="flex flex-wrap gap-8">
                    {benchNosSorted.map((benchNo) => {
                      const seats = benches[benchNo];
                      const benchCapacity = seats[0]?.bench?.capacity || 2;

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
                          <div className="flex">
                            {fullBench.map((seat, idx) => {
                              const bgColor = colors[idx % colors.length];

                              return (
                                <div
                                  key={seat.id}
                                  className="w-28 h-16 flex flex-col justify-center items-center text-white font-semibold text-xs"
                                  style={{
                                    padding: 0,
                                    margin: 0,
                                    backgroundColor: bgColor,
                                    color: "white",
                                    boxShadow: "inset 0 0 0 1px #333",
                                  }}
                                >
                                  {seat.dummy ? (
                                    <p>DUMMY</p>
                                  ) : (
                                    <>
                                      <p>{seat.student.college}</p>
                                      <p>{seat.student.symbolNumber}</p>
                                    </>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          <p className="text-gray-700 font-bold text-sm mt-2">
                            Bench {benchNo}
                          </p>
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

export default SeatingPlanVisualLayout;
