import React from "react";
import { useGetAllSeatingPlansQuery } from "../../redux/api/seatPlanApi";
import SeatingPlanVisual from "../../layout/SeatingPlanVisual";

const ViewAllSeatingPlans = () => {
  const { data, error, isLoading } = useGetAllSeatingPlansQuery();

  if (isLoading) {
    return (
      <div className="mt-16 p-6 max-w-screen-xl mx-auto bg-white rounded shadow text-center">
        <p className="text-lg">Loading seating plans...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-16 p-6 max-w-screen-xl mx-auto bg-white rounded shadow text-center">
        <p className="text-red-600 text-lg">Failed to load plans</p>
      </div>
    );
  }

  if (!data?.data?.length) {
    return (
      <div className="mt-16 p-6 max-w-screen-xl mx-auto bg-white rounded shadow text-center">
        <p className="text-lg">No seating plans found.</p>
      </div>
    );
  }

  // Collect all seats from all plans
  const allSeats = data.data.flatMap((plan) => plan.seats);

  // Group seats by college
  const seatsByCollege = allSeats.reduce((acc, seat) => {
    const college = seat.student?.college || "Unknown College";
    if (!acc[college]) acc[college] = [];
    acc[college].push(seat);
    return acc;
  }, {});

  // Prepare the college roll range strings
  const collegeRollRanges = Object.entries(seatsByCollege).map(
    ([collegeName, seats]) => {
      const rolls = seats
        .map((seat) => parseInt(seat.student?.symbolNumber))
        .filter((num) => !isNaN(num));

      const minRoll = rolls.length ? Math.min(...rolls) : "N/A";
      const maxRoll = rolls.length ? Math.max(...rolls) : "N/A";

      return `${collegeName}: ${minRoll} - ${maxRoll}`;
    }
  );

  return (
    <div className="mt-16 p-6 max-w-screen-xl mx-auto bg-white rounded shadow">
      <h2 className="text-4xl font-bold text-center mb-8">All Seating Plans</h2>

      {/* Show all colleges and roll ranges in one line, no extra space */}
      <p className="text-lg font-semibold text-center mb-12">
        {collegeRollRanges.join(" | ")}
      </p>

      {/* Show all seating plans together in one list */}
      {data.data.map((plan, idx) => {
        const firstSeat = plan.seats[0];
        const room = firstSeat?.bench?.room;
        const subject = plan.exam.subject;
        const semester = subject?.semester;
        const course = semester?.course;

        return (
          <div
            key={plan.id}
            className="mb-10 p-6 rounded-lg shadow-sm bg-gray-50"
          >
            <p className="mb-6 text-xl font-semibold text-gray-800 flex flex-wrap">
              <span>{`${idx + 1}.`}</span>
              <span className="ml-2">
                Course Name: <span className="font-normal">{course?.name || "N/A"}</span>
              </span>
              <span className="ml-4">
                Semester: <span className="font-normal">{semester?.semesterNum || "N/A"}</span>
              </span>
              <span className="ml-4">
                Exam Subject Name: <span className="font-normal">{subject?.subjectName || "N/A"}</span>
              </span>
            </p>

            <p className="text-lg text-gray-700 flex flex-wrap gap-4 mb-6">
              <span>
                <strong>Room:</strong> {room?.roomNumber || "N/A"}
              </span>
              <span>
                <strong>Block:</strong> {room?.block || "N/A"}
              </span>
              <span>
                <strong>Floor:</strong> {room?.floor || "N/A"}
              </span>
            </p>

            <SeatingPlanVisual seatPlan={plan.seats} />
          </div>
        );
      })}
    </div>
  );
};

export default ViewAllSeatingPlans;
