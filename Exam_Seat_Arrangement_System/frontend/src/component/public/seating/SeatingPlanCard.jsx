import React from "react";
import SeatingPlanVisual from "../../../layout/SeatingPlanVisual";

const SeatingPlanCard = ({ plan, index }) => {
  const firstSeat = plan.seats?.[0];
  const subject = plan.exam.subject;
  const semester = subject?.semester;
  const course = semester?.course;
  const room = firstSeat?.bench?.room;

  const seatsByCollege = (plan.seats || []).reduce((acc, seat) => {
    const college = seat.student?.college || "Unknown College";
    if (!acc[college]) acc[college] = [];
    acc[college].push(seat);
    return acc;
  }, {});

  const collegeRollRanges = Object.entries(seatsByCollege).map(
    ([collegeName, seats]) => {
      const numbers = seats
        .map((s) => parseInt(s.student?.symbolNumber))
        .filter((n) => !isNaN(n));
      const min = numbers.length ? Math.min(...numbers) : "N/A";
      const max = numbers.length ? Math.max(...numbers) : "N/A";
      return `${collegeName}: ${min} - ${max}`;
    }
  );

  return (
    <div className="mb-12 bg-gray-50 p-6 rounded-lg shadow-sm">
      <p className="text-base text-gray-600 italic mb-2">
        <strong>Roll Number Ranges:</strong>{" "}
        {collegeRollRanges.length > 0
          ? collegeRollRanges.join(" | ")
          : "No data"}
      </p>

      <p className="mb-4 text-lg font-semibold text-gray-800 flex flex-wrap">
        <span className="mr-4">{`${index + 1}.`}</span>
        <span className="mr-4">
          Course Name: <span className="font-normal">{course?.name || "N/A"}</span>
        </span>
        <span className="mr-4">
          Semester: <span className="font-normal">{semester?.semesterNum || "N/A"}</span>
        </span>
        <span>
          Exam Subject Name:{" "}
          <span className="font-normal">{subject?.subjectName || "N/A"}</span>
        </span>
      </p>

      <p className="text-base text-gray-700 flex flex-wrap gap-4 mb-4">
        <span><strong>Room:</strong> {room?.roomNumber || "N/A"}</span>
        <span><strong>Block:</strong> {room?.block || "N/A"}</span>
        <span><strong>Floor:</strong> {room?.floor || "N/A"}</span>
      </p>

      <SeatingPlanVisual seatPlan={plan.seats} />
    </div>
  );
};

export default SeatingPlanCard;
