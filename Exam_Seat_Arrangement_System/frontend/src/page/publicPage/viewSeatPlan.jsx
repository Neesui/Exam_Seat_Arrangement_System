import React from "react";
import { useLocation } from "react-router-dom";
import { useGetStudentActiveSeatingQuery } from "../../redux/api/seatPlanApi";

const ViewSeatplan = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const symbolNumber = searchParams.get("symbolNumber");
  const college = searchParams.get("college");

  const { data, isLoading, isError } = useGetStudentActiveSeatingQuery(
    { symbolNumber, college },
    { skip: !symbolNumber || !college }
  );

  if (!symbolNumber || !college) {
    return (
      <div className="text-center mt-20 text-lg text-red-600">
        Symbol Number and College are required to view the seating plan.
      </div>
    );
  }

  if (isLoading) {
    return (
      <p className="text-center mt-20 text-lg">
        Loading your active seating plan...
      </p>
    );
  }

  if (isError || !data?.data) {
    return (
      <p className="text-center mt-20 text-lg text-red-600">
        No active seating plan found for your details.
      </p>
    );
  }

  const plan = data.data;

  // Generate benches dynamically
  const benches = Array.from(
    { length: plan.room.benchCount || 6 }, 
    (_, i) => {
      const benchNumber = i + 1;
      const benchCapacity = plan.room.benchCapacity || 2;

      const seats = Array.from({ length: benchCapacity }, (_, idx) => {
        const position = idx + 1;
        const isStudentHere =
          plan.benchId === benchNumber && plan.position === position;

        return {
          label: isStudentHere
            ? `${plan.student.college} ${plan.student.symbolNumber}`
            : "DUMMY",
          highlight: isStudentHere,
        };
      });

      return { benchNumber, seats };
    }
  );

  return (
    <div className="mt-5 p-6 max-w-screen-xl mx-auto bg-white rounded shadow">
      <h2 className="text-4xl font-bold text-center mb-6">Your Seating Plan</h2>

      {/* Exam & Room Info */}
      <p className="text-lg mb-2">
        <strong>Course:</strong> {plan.exam.subject.semester.course.name} |{" "}
        <strong>Semester:</strong> {plan.exam.subject.semester.semesterNum}
      </p>
      <p className="text-lg mb-2">
        <strong>Subject:</strong> {plan.exam.subject.subjectName} (
        {plan.exam.subject.code})
      </p>
      <p className="text-lg mb-2">
        <strong>Exam Date:</strong>{" "}
        {new Date(plan.exam.date).toLocaleDateString()} | <strong>Time:</strong>{" "}
        {new Date(plan.exam.startTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}{" "}
        -{" "}
        {new Date(plan.exam.endTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
      <p className="text-lg mb-4">
        <strong>Room:</strong> {plan.room.roomNumber}, <strong>Block:</strong>{" "}
        {plan.room.block}, <strong>Floor:</strong> {plan.room.floor}
      </p>

      {/* Room Layout */}
      <div className="bg-gray-50 p-6 rounded border">
        <p className="text-lg mb-4 text-center">
          <strong>Room:</strong> {plan.room.roomNumber} &nbsp;|&nbsp;{" "}
          <strong>Block:</strong> {plan.room.block} &nbsp;|&nbsp;{" "}
          <strong>Floor:</strong> {plan.room.floor}
        </p>

        <div className="grid grid-cols-2 gap-8 justify-items-center">
          {benches.map((bench) => (
            <div key={bench.benchNumber} className="text-center">
              <div className="flex gap-2 mb-2 flex-wrap justify-center">
                {bench.seats.map((seat, idx) => (
                  <div
                    key={idx}
                    className={`px-4 py-3 rounded-lg text-white text-sm font-semibold w-28 ${
                      seat.highlight ? "bg-green-600" : "bg-blue-900"
                    }`}
                  >
                    {seat.label}
                  </div>
                ))}
              </div>
              <p className="text-sm font-bold">Bench {bench.benchNumber}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewSeatplan;
