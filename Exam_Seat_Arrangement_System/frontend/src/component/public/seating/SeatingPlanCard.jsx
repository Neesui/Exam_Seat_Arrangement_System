import React from "react";
import SeatingPlanVisual from "../../../layout/SeatingPlanVisual";

const SeatingPlanCard = ({ plan, index }) => {
  const subject = plan.exam.subject;
  const semester = subject?.semester;
  const course = semester?.course;

  // Group seats by room
  const seatsByRoom = (plan.seats || []).reduce((acc, seat) => {
    const roomNo = seat.bench?.room?.roomNumber;
    if (!roomNo) return acc;
    if (!acc[roomNo]) acc[roomNo] = [];
    acc[roomNo].push(seat);
    return acc;
  }, {});

  return (
    <div className="mb-12">
      {/* Loop each room separately */}
      {Object.entries(seatsByRoom).map(([roomNo, seats], idx) => {
        // Roll ranges per college for this room
        const seatsByCollege = seats.reduce((acc, seat) => {
          const college = seat.student?.college || "Unknown College";
          if (!acc[college]) acc[college] = [];
          acc[college].push(seat);
          return acc;
        }, {});

        const collegeRollRanges = Object.entries(seatsByCollege).map(
          ([collegeName, collegeSeats]) => {
            const numbers = collegeSeats
              .map((s) => parseInt(s.student?.symbolNumber))
              .filter((n) => !isNaN(n));
            const min = numbers.length ? Math.min(...numbers) : "N/A";
            const max = numbers.length ? Math.max(...numbers) : "N/A";
            return `${collegeName}: ${min} - ${max}`;
          }
        );

        const roomData = seats[0]?.bench?.room;

        return (
          <div
            key={`${roomNo}-${idx}`}
            className="mb-10 bg-gray-50 p-6 rounded-lg shadow-sm"
          >
            {/* Roll Number Ranges */}
            <p className="text-base text-gray-600 italic mb-2">
              <strong>Roll Number Ranges:</strong>{" "}
              {collegeRollRanges.length > 0
                ? collegeRollRanges.join(" | ")
                : "No data"}
            </p>

            {/* Exam Info */}
            <p className="mb-4 text-lg font-semibold text-gray-800 flex flex-wrap gap-4">
              <span>{`${index + 1}.${idx + 1}`}</span>
              <span>
                Course Name:{" "}
                <span className="font-normal">{course?.name || "N/A"}</span>
              </span>
              <span>
                Semester:{" "}
                <span className="font-normal">
                  {semester?.semesterNum || "N/A"}
                </span>
              </span>
              <span>
                Exam Subject Name:{" "}
                <span className="font-normal">
                  {subject?.subjectName || "N/A"}
                </span>
              </span>
            </p>

            {/* Room Info */}
            <p className="text-base text-gray-700 mb-4">
              <strong>Room:</strong> {roomData?.roomNumber || "N/A"},{" "}
              <strong>Block:</strong> {roomData?.block || "N/A"},{" "}
              <strong>Floor:</strong> {roomData?.floor || "N/A"}
            </p>

            {/* Visual seating for THIS room only */}
            <SeatingPlanVisual seatPlan={seats} />
          </div>
        );
      })}
    </div>
  );
};

export default SeatingPlanCard;
