import React from "react";

const BenchLayout = ({ benches }) => {
  // Get max rows and columns
  const maxRow = benches.length > 0 ? Math.max(...benches.map((b) => b.row)) : 0;
  const maxCol = benches.length > 0 ? Math.max(...benches.map((b) => b.column)) : 0;

  // Create empty 2D grid
  const grid = Array.from({ length: maxRow }, () => Array(maxCol).fill(null));

  // Place benches into the grid
  benches.forEach((bench) => {
    grid[bench.row - 1][bench.column - 1] = bench;
  });

  // Track display index
  let displayIndex = 1;

  return (
    <div className="flex flex-col gap-4 items-start justify-center">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-3">
          {row.map((bench, colIndex) => (
            <div
              key={colIndex}
              className={`w-12 h-12 flex items-center justify-center rounded border text-sm font-medium ${
                bench ? "bg-gray-900 text-white border-red-500" : "bg-gray-300"
              }`}
            >
              {bench ? displayIndex++ : "--"}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default BenchLayout;
