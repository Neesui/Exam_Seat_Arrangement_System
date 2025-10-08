import React, { useState } from "react";
import { useGetAllSeatingPlansQuery } from "../../redux/api/seatPlanApi";
import SeatingPlanCard from "../../component/public/seating/SeatingPlanCard";
import SeatingPlanFilter from "../../component/public/seating/SeatingPlanFilter";

const ViewAllSeatingPlans = () => {
  const { data, error, isLoading } = useGetAllSeatingPlansQuery();
  const [searchTerm, setSearchTerm] = useState("");

  if (isLoading) {
    return (
      <p className="text-center mt-20 text-lg">Loading seating plans...</p>
    );
  }

  if (error || !data?.data?.length) {
    return (
      <p className="text-center mt-20 text-lg text-red-600">
        No seating plans found or failed to load.
      </p>
    );
  }

  const filteredPlans = data.data.filter((plan) => {
    const subject = plan.exam.subject?.subjectName?.toLowerCase() || "";
    const course =
      plan.exam.subject?.semester?.course?.name?.toLowerCase() || "";
    const room =
      plan.seats?.[0]?.bench?.room?.roomNumber?.toLowerCase() || "";
    return (
      subject.includes(searchTerm) ||
      course.includes(searchTerm) ||
      room.includes(searchTerm)
    );
  });

  return (
    <div className="mt-5 p-6 max-w-screen-xl mx-auto bg-white rounded shadow">
      <h2 className="text-4xl font-bold text-center mb-6">All Seating Plans</h2>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 print:hidden">
        <SeatingPlanFilter
          value={searchTerm}
          onChange={(val) => setSearchTerm(val.toLowerCase())}
        />
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Download / Print This Page
        </button>
      </div>

      <div id="printable">
        {filteredPlans.map((plan, index) => (
          <SeatingPlanCard key={plan.id} plan={plan} index={index} />
        ))}
      </div>
    </div>
  );
};

export default ViewAllSeatingPlans;
