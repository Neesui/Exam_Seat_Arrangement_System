import React from "react";
import { useGetActiveSeatingPlanQuery } from "../../redux/api/seatPlanApi";
import SeatingPlanCard from "../../component/public/seating/SeatingPlanCard";

const ActiveSeatingPlan = () => {
  const { data, isLoading, error } = useGetActiveSeatingPlanQuery();

  if (isLoading) {
    return <p className="text-center mt-20 text-lg">Loading active seating plan...</p>;
  }

  if (error || !data?.data || data.data.length === 0) {
    return (
      <p className="text-center mt-20 text-lg text-red-600">
        No active seating plan found.
      </p>
    );
  }

  const today = new Date();
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

  // Find today's exam first, otherwise fallback to tomorrow
  let plan = data.data.find(
    (plan) => new Date(plan.exam.date).toDateString() === today.toDateString()
  );

  if (!plan) {
    plan = data.data.find(
      (plan) => new Date(plan.exam.date).toDateString() === tomorrow.toDateString()
    );
  }

  if (!plan) {
    return (
      <p className="text-center mt-20 text-lg text-gray-700">
        No active seating plan for today or tomorrow.
      </p>
    );
  }

  return (
    <div className="mt-5 p-6 max-w-screen-xl mx-auto bg-white rounded shadow">
      <h2 className="text-4xl font-bold text-center mb-6"> Seating Plan</h2>

      <SeatingPlanCard plan={plan} index={0} />

      <div className="flex justify-center mt-6 gap-4 print:hidden">
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Download / Print
        </button>
      </div>
    </div>
  );
};

export default ActiveSeatingPlan;
