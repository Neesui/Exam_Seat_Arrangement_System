import React from "react";

const BenchLayout = ({ benches }) => {
  const maxRow = benches.length > 0 ? Math.max(...benches.map((b) => b.row)) : 0;
  const maxCol = benches.length > 0 ? Math.max(...benches.map((b) => b.column)) : 0;

  const grid = Array.from({ length: maxRow }, () => Array(maxCol).fill(null));
  benches.forEach((bench) => {
    grid[bench.row - 1][bench.column - 1] = bench;
  });

  let displayIndex = 1;

  const getColorsForCapacity = (capacity) => {
    const colors = {
      2: ["bg-red-400", "bg-blue-400"],
      3: ["bg-pink-300", "bg-purple-400", "bg-rose-400"],
      4: ["bg-yellow-400", "bg-green-400", "bg-orange-400", "bg-indigo-400"],
    };
    return colors[capacity] || ["bg-gray-400"];
  };

  return (
    <div className="flex flex-col gap-4 items-start justify-center">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-3">
          {row.map((bench, colIndex) => (
            <div key={colIndex} className="flex flex-col items-center">
              <div className="relative w-24 h-12 flex items-stretch rounded overflow-hidden border">
                {bench ? (
                  getColorsForCapacity(bench.capacity).map((colorClass, index) => (
                    <div
                      key={index}
                      className={`flex-1 flex items-center justify-center text-black font-semibold text-sm ${colorClass}`}
                    >
                      {index + 1}
                    </div>
                  ))
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center">--</div>
                )}
              </div>
              {bench && (
                <div className="text-xs font-bold mt-1 text-gray-700">Bench {displayIndex++}</div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default BenchLayout;
