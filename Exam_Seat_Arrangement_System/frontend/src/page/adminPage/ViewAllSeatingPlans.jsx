import React from "react";
import { useGetAllSeatingPlansQuery } from "../../redux/api/seatPlanApi";

const ViewAllSeatingPlans = () => {
  const { data, error, isLoading } = useGetAllSeatingPlansQuery();

  return (
    <div className="ml-8 mt-20 bg-white p-6 rounded-lg shadow-md w-[99%] max-w-screen-lg mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">All Seating Plans</h2>

      {isLoading ? (
        <p className="text-gray-500">Loading seating plans...</p>
      ) : error ? (
        <p className="text-red-500">Failed to load seating plans.</p>
      ) : (
        <div className="space-y-6">
          {data?.data?.length === 0 ? (
            <p className="text-center text-gray-500">No seating plans found.</p>
          ) : (
            data?.data?.map((plan, index) => (
              <div
                key={plan.id}
                className="border border-gray-300 rounded-lg shadow-sm p-4"
              >
                <h3 className="text-lg font-semibold mb-2">
                  {index + 1}. Exam:{" "}
                  <span className="text-blue-600">
                    {plan.exam.subject.name}
                  </span>{" "}
                  (
                  {plan.exam.subject.semester.course.name} -{" "}
                  {plan.exam.subject.semester.name})
                </h3>
                <p className="mb-2 text-sm text-gray-600">
                  Seating Plan ID: {plan.id}
                </p>

                <div className="mt-3 space-y-1 text-sm text-gray-700">
                  {plan.seats.map((seat) => (
                    <div key={seat.id}>
                      • <span className="font-medium">{seat.student.name}</span> →
                      Room: {seat.bench.room.roomNumber}, Bench: {seat.bench.id}, Position: {seat.position}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ViewAllSeatingPlans;
