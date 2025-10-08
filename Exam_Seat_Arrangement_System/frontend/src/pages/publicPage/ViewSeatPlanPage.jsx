import React from "react";
import { useLocation } from "react-router-dom";
import { useGetStudentActiveSeatingQuery } from "../../redux/api/seatPlanApi";
import SeatingPlanVisualLayout from "../../layout/SeatingPlanVisualLayout";

const ViewSeatPlanPage = () => {
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

  if (isError || !data?.data || data.data.length === 0) {
    return (
      <p className="text-center mt-20 text-lg text-red-600">
        No active seating plan found for your details.
      </p>
    );
  }

  return (
    <div className="mt-5 p-6 max-w-screen-xl mx-auto bg-white rounded shadow space-y-12">
      <h2 className="text-4xl font-bold text-center mb-6">Your Seating Plan</h2>

      {data.data.map((plan, idx) =>
        [plan.room].map((room) => {
          const seatsForLayout = [];

          room.benches.forEach((bench) => {
            for (let pos = 1; pos <= bench.capacity; pos++) {
              const assignedSeat = plan.seats.find(
                (seat) => seat.benchId === bench.id && seat.position === pos
              );

              seatsForLayout.push({
                id: assignedSeat ? assignedSeat.id : `dummy-${bench.benchNo}-${pos}`,
                bench: {
                  benchNo: bench.benchNo,
                  capacity: bench.capacity,
                  row: bench.row || 1,
                  room,
                },
                student: assignedSeat ? assignedSeat.student : null,
                dummy: !assignedSeat,
              });
            }
          });

          return (
            <div key={`${idx}-${room.id}`}>
              {/* Exam & Room Info */}
              <div className="mb-6 text-lg space-y-2">
                <p>
                  <strong>Course:</strong>{" "}
                  {plan.exam.subject.semester.course.name} |{" "}
                  <strong>Semester:</strong>{" "}
                  {plan.exam.subject.semester.semesterNum}
                </p>
                <p>
                  <strong>Subject:</strong> {plan.exam.subject.subjectName} (
                  {plan.exam.subject.code})
                </p>
                <p>
                  <strong>Exam Date:</strong>{" "}
                  {new Date(plan.exam.date).toLocaleDateString()} |{" "}
                  <strong>Time:</strong>{" "}
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
                <p>
                  <strong>Room:</strong> {room.roomNumber},{" "}
                  <strong>Block:</strong> {room.block},{" "}
                  <strong>Floor:</strong> {room.floor}
                </p>
              </div>

              {/* Room Layout */}
              <div className="bg-gray-50 p-6 rounded border">
                <SeatingPlanVisualLayout seatPlan={seatsForLayout} />
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ViewSeatPlanPage;
