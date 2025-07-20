import React from "react";
import { useGetAllSeatingPlansQuery } from "../../redux/api/seatPlanApi";
import SeatingPlanVisual from "../../layout/SeatingPlanVisual";

const ViewAllSeatingPlans = () => {
  const { data, error, isLoading } = useGetAllSeatingPlansQuery();

  return (
    <div className="mt-16 p-6 max-w-screen-lg mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold text-center mb-8">All Seating Plans</h2>

      {isLoading ? (
        <p>Loading seating plans...</p>
      ) : error ? (
        <p className="text-red-600">Failed to load plans</p>
      ) : data?.data?.length === 0 ? (
        <p>No seating plans found.</p>
      ) : (
        data?.data?.map((plan, idx) => {
          const firstSeat = plan.seats[0];
          const room = firstSeat?.bench?.room;

          return (
            <div
              key={plan.id}
              className="mb-10 border p-5 rounded-lg shadow-sm"
            >
              <h3 className="text-lg font-semibold mb-2">
                {idx + 1}. {plan.exam.subject.name} (
                {plan.exam.subject.semester.course.name} -{" "}
                {plan.exam.subject.semester.name})
              </h3>

              <p className="text-sm text-gray-700 mb-4">
                <strong>Room:</strong> {room?.roomNumber} | <strong>Block:</strong>{" "}
                {room?.block} | <strong>Floor:</strong> {room?.floor}
              </p>

              <SeatingPlanVisual seatPlan={plan.seats} />
            </div>
          );
        })
      )}
    </div>
  );
};

export default ViewAllSeatingPlans;
