import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ViewExamRoomPage = () => {
  const [symbolNumber, setSymbolNumber] = useState("");
  const [college, setCollege] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!symbolNumber || !college) return;

    navigate(
      `/viewSeatPlan?symbolNumber=${encodeURIComponent(
        symbolNumber
      )}&college=${encodeURIComponent(college)}`
    );
  };

  return (
    <div className="max-w-[900px] mx-auto px-4 py-10">
      <h2 className="text-4xl font-bold text-center mb-6">
        Check Your Exam Seat
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4 mb-6"
      >
        <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
          <input
            type="text"
            placeholder="Enter Symbol Number..."
            value={symbolNumber}
            onChange={(e) => setSymbolNumber(e.target.value)}
            className="px-4 py-2 border rounded-full w-full md:w-[300px]"
            required
          />
          <input
            type="text"
            placeholder="Enter College Name..."
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            className="px-4 py-2 border rounded-full w-full md:w-[300px]"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white font-semibold text-[20px] px-6 py-2 rounded-xl hover:bg-green-600 transition mt-2"
        >
          Submit
        </button>
      </form>

      <div className="mt-12">
        <h3 className="text-3xl font-bold text-center mb-4">
          Important Instructions for Examinees
        </h3>
        <ul className="list-decimal space-y-3 text-justify text-[18px] leading-relaxed">
          <li>
            Candidates must sit in their designated seat according to the seat
            plan prepared by the exam center.
          </li>
          <li>
            Candidates arriving more than 30 minutes late will not be allowed to
            enter the exam hall.
          </li>
          <li>Mobile phones are not allowed inside the examination hall.</li>
          <li>
            Candidates may not leave their seat or the exam hall within one hour
            of the exam start without permission from the supervisor.
          </li>
          <li>
            All candidates must be present on the scheduled exam day without
            fail.
          </li>
          <li>
            Candidates are not allowed to bring any books, notes, or cheat
            materials into the exam hall. Prohibited items may be confiscated.
          </li>
          <li>
            Candidates are not allowed to talk among themselves during the exam
            or write anything other than answers on the paper.
          </li>
          <li>
            If a candidate copies or assists another, both candidates may be
            disqualified.
          </li>
          <li>
            Answer sheets will only be accepted if submitted with the invigilator’s approval.
          </li>
          <li>
            Candidates must submit their answer sheets before leaving the
            examination hall.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ViewExamRoomPage;
