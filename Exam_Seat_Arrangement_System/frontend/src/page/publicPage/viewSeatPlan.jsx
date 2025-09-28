import React from "react";
import { useLocation } from "react-router-dom";
import { useGetStudentActiveSeatingQuery } from "../../redux/api/seatPlanApi";
import SeatingPlanCard from "../../component/public/seating/SeatingPlanCard";

const ViewSeatplan = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const symbolNumber = searchParams.get("symbolNumber");
  const college = searchParams.get("college");

  // Skip API call if params are missing
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

  return (
    <div className="mt-5 p-6 max-w-screen-xl mx-auto bg-white rounded shadow">
      <h2 className="text-4xl font-bold text-center mb-6">Your Seating Plan</h2>

      {plan ? (
        <SeatingPlanCard plan={plan} />
      ) : (
        <p className="text-center text-lg">No seating assigned today or tomorrow.</p>
      )}

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

export default ViewSeatplan;
